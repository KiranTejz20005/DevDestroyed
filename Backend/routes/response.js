import { Hono } from 'hono'
import { rateLimiter } from 'hono-rate-limiter'
import { supabase } from '../lib/supabase.js'
import { fetchGitHubProfile, fetchGitHubRepos } from '../services/githubApi.js'
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = new Hono()

const limiter = rateLimiter({
  windowMs: 40 * 60 * 1000,
  limit: 15, 
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
})

export async function getAIResponse(prompt) {
  // ── 1. NVIDIA NIM (primary) ──────────────────────────────────────────────
  if (process.env.NVIDIA_API_KEY) {
    try {
      const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.NVIDIA_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta/llama-3.3-70b-instruct",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.8,
          max_tokens: 2048,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          console.log("✅ NVIDIA NIM responded successfully.");
          return text;
        }
      } else {
        const err = await response.text();
        console.warn(`⚠️  NVIDIA NIM failed (${response.status}):`, err);
      }
    } catch (error) {
      console.warn("⚠️  NVIDIA NIM connection error:", error.message);
    }
  }

  // ── 2. Google Gemini (fallback) ──────────────────────────────────────────
  let geminiKeys = [];
  if (process.env.GEMINI) {
    geminiKeys.push(...process.env.GEMINI.split(',').map(k => k.trim()).filter(Boolean));
  }
  if (process.env.API_KEYS) {
    geminiKeys.push(...process.env.API_KEYS.split(',').map(k => k.trim()).filter(Boolean));
  }
  Object.keys(process.env).forEach(key => {
    if (key.startsWith('GEMINI_API_KEY_')) geminiKeys.push(process.env[key].trim());
  });
  geminiKeys = [...new Set(geminiKeys)];

  if (geminiKeys.length > 0) {
    const modelsToTry = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];
    for (const apiKey of geminiKeys) {
      const genAI = new GoogleGenerativeAI(apiKey);
      for (const modelName of modelsToTry) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const text = result.response.text();
          if (text) return text;
        } catch (error) {
          console.warn(`⚠️  Gemini ${modelName} failed: ${error.message}`);
        }
      }
    }
  }

  // ── 3. OpenRouter (last resort) ──────────────────────────────────────────
  if (process.env.OPENROUTER_API_KEY) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.choices[0].message.content;
      }
    } catch (error) {
      console.error("OpenRouter error:", error);
    }
  }

  throw new Error('All AI providers failed. Check your API keys.');
}

function extractGitHubStats(repos) {
  const languageCounts = {}
  let totalRepos = repos.length
  
  repos.forEach(repo => {
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1
    }
  })
  
  const languageArray = Object.entries(languageCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalRepos) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
  
  return languageArray.map(({ name, percentage }) => ({ name, percentage }))
}

async function generateRoastQuestions(repos, username) {
  const recentRepos = repos.slice(0, 10).map(r => ({
    name: r.name,
    description: r.description,
    language: r.language,
    stars: r.stargazers_count
  }));
  
  const roastPrompt = `Based on the GitHub repositories below, generate exactly two playful or sarcastic yes/no questions about this developer's coding habits, repo naming, or project choices.

Each question must feel like something a roasting senior dev would casually ask, witty, slightly judgmental, a bit sarcastic, but still fun. Use really basic english to make them understand, Gen Z energy, but don't overdo it. Think teasing, not trying too hard.

The questions should clearly relate to patterns in their repos. This could include their project types, language choices, lack of descriptions, weird repo names, or anything they clearly do way too often.

Return the result as a JSON array of two objects with exactly these keys:
- question: the question text
- yes_response: the response if the user answers "yes"  
- no_response: the response if the user answers "no"

Example structure:
[
{
"question": "",
"yes_response": "",
"no_response": ""
},
{
"question": "",
"yes_response": "",
"no_response": ""
}
]

Here's the GitHub activity to analyze:
${JSON.stringify(recentRepos)}

Generate the JSON response:`

  try {
    const response = await getAIResponse(roastPrompt)

    await supabase
      .from('roasts')
      .upsert({ 
        username, 
        questions: response,
        updated_at: new Date()
      }, { onConflict: 'username' })
      .then(({ error }) => {
        if (error) {
          console.error('Supabase Upsert Error (Questions):', error);
          throw error;
        }
      });
    
    console.log(`Successfully generated questions for ${username}`);
    return response
  } catch (error) {
    console.error('Error generating roast questions:', error)
    throw error
  }
}

async function generateCombinedRoast(repos, profile, username) {
    const simplifiedRepos = repos.slice(0, 30).map(r => ({
        name: r.name,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        topics: r.topics
    }));

    const combinedRoastPrompt = `
You are an AI assistant. Your task is to analyze the user's GitHub activity provided below and generate a multi-part roast.
Your response MUST be a single, well-formed JSON object and nothing else. Do not include any text, markdown, or formatting outside of the JSON object. It is critical that all property names (keys) are enclosed in double quotes.

The JSON object must have the following keys: "detailedRoast", "strengthAnalysis", "weaknessAnalysis", "loveLifeAnalysis", "lifePurposeAnalysis".

**GitHub Profile to Analyze:**
${JSON.stringify({
    bio: profile.bio,
    public_repos: profile.public_repos,
    followers: profile.followers,
    following: profile.following,
    location: profile.location
})}

**GitHub Repositories:**
\`\`\`json
${JSON.stringify(simplifiedRepos)}
\`\`\`

Now, generate the content for each key in the JSON object by following these individual prompts EXACTLY as described.

1. "detailedRoast"
PROMPT:
Based on the GitHub repos and profile above, write a long-form roast of this developer.
Be witty, sarcastic, slightly unhinged, and observant. This should feel like a senior dev who has spent way too much time looking at your messy codebases.

Roast their repo naming, choice of languages, outdated projects, lack of stars, weird bios, and the way they clearly think they're building the next big thing but it's just another Todo app.
You're allowed to exaggerate, speculate, and creatively connect dots, as long as it feels emotionally accurate.

Use Gen Z / internet slang where it fits. Grammar can be loose.
No formal language. No safe corporate tone.
Sharp, clever, chaotic, but not cruel.
Strictly around 400 words.

2. "strengthAnalysis"
PROMPT:
Now roast them lovingly.
Call out their strengths in a way that sounds sarcastic but is actually respect.
If they're consistent, oddly dedicated to a niche language, have one repo with actual stars, or quietly competent, highlight it — but do it like someone who's impressed but refuses to say it normally.

Casual tone. Minimal grammar. Human voice.
Borderline feral admiration.
Strictly around 150 words.

3. "weaknessAnalysis"
PROMPT:
Time to call them out.
Identify their weak spots based on their GitHub.
Abandoned projects, 0 stars, messy commit messages, 40 different forks they never touched, pretending to be a "Software Architect" with a profile full of tutorials — whatever shows up, drag it into the light.

This should feel like a friend saying “be so serious right now” while still caring.
Funny, spicy, honest.
Not just insults — actual insight wrapped in jokes.
Strictly around 150 words.

4. "loveLifeAnalysis"
PROMPT:
Make funny, dark, or suspicious guesses about their love life based on their GitHub behavior.
Maybe they prefer documentation over conversation. Maybe they try to git merge their way into a date. Maybe their only long-term commitment is to a repo.

Be entertaining and a little uncomfortably accurate.
Speculate, exaggerate, joke — but also sneak in insight about how they probably act in relationships or what they actually want.

Casual, chaotic tone. No formal analysis.
Strictly around 150 words.

5. "lifePurposeAnalysis"
PROMPT:
Based on everything above, guess what actually drives this person.
What keeps them pushing code? What are they subconsciously chasing?
Validation? A job at FAANG that they'll never get? Understanding? Control?
 
Be creative. Be sarcastic. Be slightly philosophical but not corny.
This should read like a bored but perceptive friend guessing their destiny at 2am.
Raw, funny, a little unhinged, but meaningful.
Strictly around 150 words.

**Universal Rule:**
For all generated text values in the JSON object: DO NOT USE ANY MARKDOWN FORMATTING. This means no asterisks, no bolding, no italics, no headers, and no bullet points. All responses must be plain text. Sometimes the context won't be fully visible so you can make things up, but don't just assume anything based off just one project, use really basic english, You are allowed to use swear words but not directly towards the user. Start directly with the roast DO NOT write any intro like "Alright", "Okay", or "Here's the roast" etc. Do not refer to the user by any name or even as user, It should be like a friend talking to another friend. Your goal should be to roast them but not make them feel bad. DO NOT WRITE ANY INTRO GET STARTED DIRECTLY WITH THE ROAST IN EACH.
`;

    try {
        const response = await getAIResponse(combinedRoastPrompt);
        
        if (!response) {
            throw new Error("No response received from AI.");
        }
        
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("No valid JSON object found in the AI response.");
        }
        const jsonString = jsonMatch[0];
        const parsedResponse = JSON.parse(jsonString);

        await supabase
            .from('roasts')
            .upsert({ 
                username, 
                roast: parsedResponse.detailedRoast,
                strength: parsedResponse.strengthAnalysis,
                weakness: parsedResponse.weaknessAnalysis,
                love_life: parsedResponse.loveLifeAnalysis,
                life_purpose: parsedResponse.lifePurposeAnalysis,
                updated_at: new Date()
            }, { onConflict: 'username' });
    
        return parsedResponse;
    } catch (error) {
        console.error('Error generating combined roast:', error);
        throw error;
    }
}

router.post('/', limiter, async (c) => {
  try {
    const { username } = await c.req.json()

    if (!username || !username.trim()) {
      return c.json({
        success: false,
        message: 'GitHub username is required'
      }, 400)
    }

    const cleanUsername = username.trim().toLowerCase();

    try {
      const { data: existingUser, error: dbError } = await supabase
        .from('roasts')
        .select('*')
        .eq('username', cleanUsername)
        .single();

      if (existingUser) {
        return c.json({
          success: true,
          redirect: true,
          username: existingUser.username,
          message: 'User already exists in database'
        }, 200)
      }

      const userProfile = await fetchGitHubProfile(cleanUsername);
      const repos = await fetchGitHubRepos(cleanUsername, 100);

      if (!repos || repos.length === 0 && !userProfile.bio) {
        return c.json({
          success: false,
          message: 'No active profile or repositories found for this user'
        }, 404)
      }

      const languages = extractGitHubStats(repos)

      try {
        await supabase
          .from('roasts')
          .upsert({ 
            username: cleanUsername,
            avatar: userProfile.avatar_url,
            languages: languages,
            updated_at: new Date()
          }, { onConflict: 'username' })
      } catch (dbError) {
        console.error('Error updating basic data in Supabase:', dbError)
      }

      try {
        generateCombinedRoast(repos, userProfile, cleanUsername).catch(error => {
          console.error('Background roast generation failed:', error);
        });
        
        await generateRoastQuestions(repos, cleanUsername);

        return c.json({
          success: true,
          redirect: false,
          message: 'Questions generated successfully, roast analysis generating in background',
        }, 200);

      } catch (questionsError) {
        console.error('Error generating questions:', questionsError);
        return c.json({
          success: false,
          message: 'Failed to generate roast questions',
          error: questionsError.message
        }, 500);
      }

    } catch (githubError) {
      console.error('GitHub fetch error:', githubError)
      
      return c.json({
        success: false,
        message: githubError.message || 'Failed to fetch GitHub data'
      }, 404)
    }
    
  } catch (error) {
    console.error('Error in roast generation:', error)
    return c.json({
      success: false,
      message: 'Failed to process roast request',
      error: error.message
    }, 500)
  }
})

export default router