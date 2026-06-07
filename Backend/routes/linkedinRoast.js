import { Hono } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import { supabase } from '../lib/supabase.js';
import { getAIResponse } from './response.js';
import { scrapeLinkedInProfile } from '../services/linkedinScraper.js';

const router = new Hono();

const limiter = rateLimiter({
  windowMs: 40 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (c) => c.req.header('x-forwarded-for') || c.req.ip,
});

async function generateLinkedInRoast(profileUrl, profileData) {
  const roastPrompt = `
You are an AI assistant. Your task is to analyze the user's LinkedIn profile provided below and generate a multi-part brutal roast.
Your response MUST be a single, well-formed JSON object and nothing else. Do not include any text, markdown, or formatting outside of the JSON object. It is critical that all property names (keys) are enclosed in double quotes.

The JSON object must have exactly the following format:
{
  "profile_summary": "brief overview of the profile",
  "roasts": [
    {
      "category": "Skills Padding",
      "target": "specific detail from profile",
      "roast": "witty brutal critique"
    }
  ],
  "overall_score": "roast intensity 1-10",
  "brutal_summary": "final paragraph of pure roast"
}

Ensure there are exactly 3-5 items in the "roasts" array. Target categories like "Headline Flex", "Experience Exaggeration", "Buzzword Overload", "Endorsement Farming", "AI-Generated Content", etc.

**LinkedIn Profile to Analyze:**
${JSON.stringify({
  name: profileData.name,
  headline: profileData.headline,
  summary: profileData.summary,
  raw_text: profileData.raw_text ? profileData.raw_text.substring(0, 1500) : ''
})}

**Universal Rules:**
- Be witty, sarcastic, slightly unhinged, and observant.
- Roast their headline, their overused buzzwords, and the typical LinkedIn humble-bragging.
- Use Gen Z / internet slang where it fits.
- No formal language. No safe corporate tone.
- Sharp, clever, chaotic, but not cruel.
- For all generated text values: DO NOT USE ANY MARKDOWN FORMATTING inside the JSON values.
- Return ONLY the JSON object.
`;

  try {
    const response = await getAIResponse(roastPrompt);
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
      .from('linkedin_roasts')
      .upsert({
        profile_url: profileUrl,
        profile_data: profileData,
        roast_data: parsedResponse,
        updated_at: new Date()
      }, { onConflict: 'profile_url' });

    return parsedResponse;
  } catch (error) {
    console.error('Error generating LinkedIn roast:', error);
    throw error;
  }
}

router.post('/', limiter, async (c) => {
  try {
    const { profileUrl } = await c.req.json();

    if (!profileUrl || !profileUrl.trim()) {
      return c.json({
        success: false,
        message: 'LinkedIn profile URL is required'
      }, 400);
    }

    let cleanProfileUrl = profileUrl.trim().toLowerCase();
    
    // Normalize URL
    if (!cleanProfileUrl.includes('linkedin.com/in/')) {
       cleanProfileUrl = `https://www.linkedin.com/in/${cleanProfileUrl.replace('@', '')}`;
    }

    try {
      // Check for cached roast
      const { data: existingRoast, error: dbError } = await supabase
        .from('linkedin_roasts')
        .select('*')
        .eq('profile_url', cleanProfileUrl)
        .single();

      if (existingRoast && existingRoast.roast_data) {
        return c.json({
          success: true,
          redirect: true,
          data: existingRoast.roast_data,
          profile: existingRoast.profile_data,
          message: 'Retrieved from cache'
        }, 200);
      }

      // Scrape profile
      const scrapeResult = await scrapeLinkedInProfile(cleanProfileUrl);

      if (!scrapeResult.success) {
        return c.json({
          success: false,
          message: scrapeResult.message
        }, 404);
      }

      const profileData = scrapeResult.data;

      // Ensure profile_url is clean in the data
      profileData.profileUrl = cleanProfileUrl;

      // Upsert basic data to prevent multiple background tasks
      try {
        await supabase
          .from('linkedin_roasts')
          .upsert({
            profile_url: cleanProfileUrl,
            profile_data: profileData,
            updated_at: new Date()
          }, { onConflict: 'profile_url' });
      } catch (dbError) {
        console.error('Error updating basic LinkedIn data in Supabase:', dbError);
      }

      // Generate roast in background
      generateLinkedInRoast(cleanProfileUrl, profileData).catch(error => {
        console.error('Background LinkedIn roast generation failed:', error);
      });

      return c.json({
        success: true,
        redirect: false,
        profile: profileData,
        message: 'LinkedIn Profile data extracted, roast analysis generating in background',
      }, 200);

    } catch (apiError) {
      console.error('API Error:', apiError);
      return c.json({
        success: false,
        message: apiError.message || 'Failed to fetch LinkedIn data'
      }, 404);
    }
  } catch (error) {
    console.error('Error in LinkedIn roast generation:', error);
    return c.json({
      success: false,
      message: 'Failed to process LinkedIn roast request',
      error: error.message
    }, 500);
  }
});

router.get('/:username', async (c) => {
  const { username } = c.req.param();
  let cleanProfileUrl = username.toLowerCase();
  
  // Normalize URL
  if (!cleanProfileUrl.includes('linkedin.com/in/')) {
      cleanProfileUrl = `https://www.linkedin.com/in/${cleanProfileUrl.replace('@', '')}`;
  }

  try {
    const { data: roast, error } = await supabase
      .from('linkedin_roasts')
      .select('*')
      .eq('profile_url', cleanProfileUrl)
      .single();

    if (error || !roast || !roast.roast_data) {
      return c.json({ success: false, message: 'LinkedIn Roast not found' }, 404);
    }

    return c.json({
      success: true,
      data: roast.roast_data,
      profile: roast.profile_data
    });
  } catch (error) {
    console.error('Error fetching LinkedIn roast data:', error);
    return c.json({ success: false, message: 'Server error' }, 500);
  }
});

export default router;
