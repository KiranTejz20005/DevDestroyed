"use client";

import React, { useState, useEffect } from "react";
import UsernameForm from "@/components/UsernameForm";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { Toaster, toast } from "sonner";
import config from '../config.json';
import RoastCarousel from "@/components/RoastCarousel";
import FAQ from "@/components/FAQ";
import LoadingOverlay from "@/components/LoadingOverlay";

const SAMPLE_ROASTS = [
  {
    username: "Octocat_Pro",
    roastLevel: "Senior Dev",
    emoji: "🐙",
    roast: "You have 50 repos but 48 of them are just forks of 'awesome-javascript' that you've never looked at. Your most active repo is a 'Hello World' from 2019 that you somehow managed to get merge conflicts on. You call yourself a 'full stack developer' because you once installed a WordPress plugin.",
    tags: ['#ForkCollector', '#JuniorEnergy', '#MergeConflictKing'],
    reaction: "Bruh... the forks are for 'research' purposes. And WordPress is a valid CMS!! 🐙",
    reactionSentiment: "Defensive"
  },
  {
    username: "BugFixer_9000",
    roastLevel: "Kernel-Panic",
    emoji: "🐛",
    roast: "Your commit messages are just 'fixed bug' or 'update' repeated 20 times. You have a PR open since 2021 that's just adding a semicolon. Your contribution graph is as empty as your social life. Maybe try pushing some code instead of just pushing your luck?",
    tags: ['#LazyCommits', '#EmptyGraph', '#DocumentationIsHard'],
    reaction: "Hey! 'fixed bug' is descriptive enough. And I'm a minimalist, that's why my graph is white. 🥺",
    reactionSentiment: "Sad"
  },
   {
    username: "AI_Wannabe_Dev",
    roastLevel: "Prompt-Engineer",
    emoji: "🤖",
    roast: "You describe yourself as an 'AI Architect' but your only contribution is copying prompts from ChatGPT into a Python script you found on Stack Overflow. You have 0 stars and 100 followers, all of which are bots you probably wrote to feel popular.",
    tags: ['#CopypasteKing', '#BotFollowers', '#NoRealCode'],
    reaction: "Actually, prompt engineering is a legitimate skill. And my bots are my only true friends. 💅",
    reactionSentiment: "Defensive"
  }
];

function PageContent() {
  const [isSliding, setIsSliding] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [targetUser, setTargetUser] = useState("");
  const [hasApiError, setHasApiError] = useState(false);
  const [carouselRoasts, setCarouselRoasts] = useState(SAMPLE_ROASTS);

  useEffect(() => {
    const fetchRealRoasts = async () => {
      try {
        const res = await fetch(`${config.url}/api/roast/history/recent`);
        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const reactions = [
            { text: "I should have made my profile private...", sentiment: "Sad" },
            { text: "This is painfully accurate.", sentiment: "Sad" },
            { text: "Jokes on you, I don't even know how to code.", sentiment: "Defensive" },
            { text: "I'm deleting my GitHub right now.", sentiment: "Sad" },
            { text: "Who gave this AI so much attitude?!", sentiment: "Angry" },
            { text: "At least I have a life outside of coding...", sentiment: "Defensive" },
            { text: "I feel personally attacked.", sentiment: "Sad" },
            { text: "My imposter syndrome just leveled up.", sentiment: "Sad" }
          ];

          const roastLevels = [
            "Senior Copy-Paster",
            "10x Bug Creator",
            "StackOverflow Addict",
            "Localhost Legend",
            "Merge Conflict King",
            "Console.log Architect",
            "Documentation Evader",
            "Ctrl+C Ctrl+V Master"
          ];

          const tagSets = [
            ['#ForkCollector', '#SpaghettiCode', '#NoTests'],
            ['#TutorialHell', '#GitBlameMe', '#EmptyCommits'],
            ['#PromptEngineer', '#ChatGPTDev', '#ZeroStars'],
            ['#10xDeveloper', '#Actually1x', '#NeedsCoffee'],
            ['#ProductionCrasher', '#YoloDeploys', '#Hotfix'],
            ['#DivSoup', '#CSSNightmare', '#CenteredDiv'],
            ['#DependabotOnly', '#AbandonedRepos', '#NodeModules']
          ];

          const mappedRoasts = json.data.slice(0, 5).map((r, index) => {
            const randomReaction = reactions[index % reactions.length];
            const randomLevel = roastLevels[index % roastLevels.length];
            const randomTags = tagSets[index % tagSets.length];
            return {
              username: r.username,
              avatar: r.avatar,
              roastLevel: randomLevel,
              emoji: "🔥", // Fallback
              roast: r.roast.substring(0, 250) + (r.roast.length > 250 ? '...' : ''),
              tags: randomTags,
              reaction: randomReaction.text,
              reactionSentiment: randomReaction.sentiment
            };
          });
          setCarouselRoasts(mappedRoasts);
        }
      } catch (e) {
        console.error("Could not fetch real roasts for carousel", e);
      }
    };
    fetchRealRoasts();
  }, []);

  useEffect(() => {
    const handleRoastComplete = (e) => {
      if (e.detail?.username) {
        setTargetUser(e.detail.username);
      }
      setShouldRedirect(true);
    };

    const handleRoastError = () => {
      setHasApiError(true);

      setShowLoadingPage(false);
      setIsSliding(false);
    };

    const handleResetHomepage = () => {
      setIsSliding(false);
      setShowLoadingPage(false);
      setShouldRedirect(false);
      setHasApiError(false);
      setTargetUser("");
    };

    window.addEventListener('roastComplete', handleRoastComplete);
    window.addEventListener('roastError', handleRoastError);
    window.addEventListener('resetHomepage', handleResetHomepage);

    const urlParams = new URLSearchParams(window.location.search);
    const regenerateUsername = urlParams.get('regenerate');
    
    if (regenerateUsername) {
      window.history.replaceState({}, document.title, '/');
      
      handleFormSubmit();

      setTimeout(async () => {
        try {
          const response = await fetch(`${config.url}/api/responses`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              username: regenerateUsername
            }),
          });

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const apiResponse = await response.json();
          
          if (apiResponse.success) {
            const finalUsername = apiResponse.username || regenerateUsername;
            setTargetUser(finalUsername);
            setShouldRedirect(true);
          } else {
            handleRoastError();
          }
        } catch (error) {
          console.error('Error during regenerate:', error);
          handleRoastError();
        }
      }, 1000);
    }

    return () => {
      window.removeEventListener('roastComplete', handleRoastComplete);
      window.removeEventListener('roastError', handleRoastError);
      window.removeEventListener('resetHomepage', handleResetHomepage);
    };
  }, []);

  const handleFormSubmit = () => {
    setIsSliding(true);
    setTimeout(() => {
      setShowLoadingPage(true);
    }, 800);
  };

  useEffect(() => {
    if (hasApiError) {
      setTimeout(() => {
        setShowLoadingPage(false);
        setIsSliding(false);
        setHasApiError(false);
        setShouldRedirect(false);
      }, 4000);
    }
  }, [hasApiError]);



  return (
    <div className="relative min-h-screen overflow-hidden">
      <Toaster theme="light" position="bottom-right" richColors />
      
      {!showLoadingPage && (
        <div className="fixed top-4 left-4 right-4 z-50">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              {/* <ThemeToggle /> */}
            </div>
            {/* <a 
              href="https://bags.fm/jhGYMNKRjZQ9jvH3sqMXuJLkh7YqhTm46VY61KVBAGS" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-[#00b824] gap-1.5 px-3 py-1.5 font-bold rounded-lg p-4 pr-5 transition-all ease-out active:scale-[0.98]"
              style={{ 
                backgroundColor: 'rgba(0, 182, 36, 0.2)', 
                border: '1px solid rgba(0, 182, 36, 0.35)' 
              }}
            >
              <img src="https://bags.fm/assets/images/bags-icon.png" className="w-4 h-4" alt="" />
              $DEVDESTROYED
            </a> */}
          </div>
        </div>
      )}

      <div
        className={`relative min-h-screen flex flex-col transition-transform duration-500 ease-in-out ${
          isSliding ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <Background />
        <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10">
          
          <div className="max-w-5xl mb-16 mt-24 sm:mt-20 w-full text-center">
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-7">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest font-space">Introducing DevDestroyed v1.0</span>
            </div>
            
            <h1 className="font-space text-4xl sm:text-7xl md:text-7xl max-w-[45rem] mx-auto font-bold tracking-tighter text-gray-900 mb-8 leading-[0.9]">
              Turning GitHub Profiles Into Comedy Material.
            </h1>

            <p className="font-space text-lg sm:text-xl text-gray-500 mb-9 max-w-2xl mx-auto leading-relaxed">
              Enter your username and witness the art of digital destruction. Our sophisticated A.I roasts you by your repositories and commit history.
            </p>

            <UsernameForm onSubmitComplete={handleFormSubmit} />

            <div className="mt-8 mb-4">
              <a href="/hall-of-shame" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:border-orange-300 font-bold font-mono transition-all duration-200 hover:-translate-y-1 shadow-sm">
                🔥 View Hall of Shame
              </a>
            </div>

            <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-6xl mx-auto sm:px-4 px-1">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  ),
                  title: "Code Analysis",
                  desc: "We analyze your repository naming, language choices, and commit habits to find your deepest insecurities.",
                  color: "text-blue-600",
                  bg: "bg-blue-50"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4-3-6-.523 2-.928 4-3 6 0 1.38.5 2 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><path d="M15.5 14.5A2.5 2.5 0 0 0 18 12c0-1.38-.5-2-1-3-1.072-2.143-2.072-4-3-6-.523 2-.928 4-3 6 0 1.38.5 2 1 3a2.5 2.5 0 0 0 2.5 2.5z"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
                  ),
                  title: "Brutally Honest",
                  desc: "No sugar-coating. Get ready for a reality check powered by advanced AI models.",
                  color: "text-orange-600",
                  bg: "bg-orange-50"
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5c0-5.523 4.477-10 10-10z"/><path d="M8.5 8.5a2.5 2.5 0 0 0-2.5 2.5"/><path d="M15.5 8.5a2.5 2.5 0 0 1 2.5 2.5"/></svg>
                  ),
                  title: "Developer Persona",
                  desc: "Discover what your code says about your true persona and professional behavior.",
                  color: "text-purple-600",
                  bg: "bg-purple-50"
                }
              ].map((feature, idx) => (
                <div key={idx} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 font-outfit">{feature.title}</h3>
                  <p className="text-base text-gray-500 font-space leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* <div className="mt-32 border-t border-gray-100 pt-16">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { label: "Profiles Roasted", value: "10k+" },
                  { label: "Egos Destroyed", value: "99%" },
                  // { label: "AI Models", value: "GPT-4" },
                  { label: "Accuracy", value: "100%" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="font-outfit text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-outfit text-sm text-gray-400 mt-12 tracking-wide">
              Crafted with precision. Delivered without mercy.
            </p>

            {/* What You'll Get Section */}
            <div className="mt-20 sm:mt-32 max-w-4xl mx-auto">
              <h2 className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                What Awaits You
              </h2>
              <p className="font-outfit text-lg text-gray-500 mb-12">
                Brace yourself for a multi-dimensional personality autopsy
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    emoji: "🔥",
                    title: "The Ultimate Roast",
                    desc: "A savage breakdown of your GitHub persona. No contributors, no apologies.",
                    gradient: "from-red-50 to-orange-50"
                  },
                  {
                    emoji: "💪",
                    title: "Hidden Strengths",
                    desc: "We'll admit when you're not completely hopeless. Rare, but it happens.",
                    gradient: "from-green-50 to-emerald-50"
                  },
                  {
                    emoji: "💔",
                    title: "Weakness Exposed",
                    desc: "Every flaw, insecurity, and cringe moment laid bare for all to see.",
                    gradient: "from-purple-50 to-pink-50"
                  },
                  {
                    emoji: "💘",
                    title: "Love Life Analysis",
                    desc: "Spoiler: Your GitHub history explains why you're still single. git push --force won't help.",
                    gradient: "from-pink-50 to-rose-50"
                  }
                ].map((item, idx) => (
                  <div key={idx} className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border border-gray-100 hover:scale-[1.02] transition-transform ease-out duration-300 cursor-default`}>
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h3 className="font-space text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="font-outfit max-w-[19rem] mx-auto text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works Section */}
            <div className="mt-32 max-w-5xl mx-auto px-4">
               <div className="text-center mb-16">
                  <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm mb-6">
                     <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-space">The Disassembly Line</span>
                  </div>
                  <h2 className="font-space text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                    From Data to Destruction
                  </h2>
                  <p className="font-outfit text-lg text-gray-500 max-w-2xl mx-auto">
                    A three-step process designed to dismantle your self-esteem efficiently.
                  </p>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {[
                    { 
                      step: "01", 
                      emoji: "🕵️‍♂️",
                      title: "Scraping Your Repos", 
                      desc: "We scrape every public repo, commit message, and embarrassing tutorial you've ever fork'd. We see it all.",
                      color: "text-blue-600",
                      bg: "bg-blue-50 border-blue-100"
                    },
                    { 
                      step: "02", 
                      emoji: "🧠",
                      title: "Psychoanalysis", 
                      desc: "Our AI judges your naming conventions, your tech stack, and your desperate need for stars. It builds a psychological profile of a dev.",
                      color: "text-purple-600",
                      bg: "bg-purple-50 border-purple-100" 
                    },
                    { 
                      step: "03", 
                      emoji: "🔥",
                      title: "Emotional Damage", 
                      desc: "We generate a customized roast that targets your specific insecurities. It's not cyberbullying if it's true (legal told us to say this).",
                      color: "text-orange-600",
                      bg: "bg-orange-50 border-orange-100"
                    }
                  ].map((item, i) => (
                    <div key={i} className={`relative flex flex-col items-start text-left group bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden`}>
                      <div className={`absolute top-0 right-0 p-8 opacity-10 font-space font-bold text-6xl text-gray-900 select-none group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500`}>
                        {item.step}
                      </div>
                      
                      <div className={`w-14 h-14 ${item.bg} border ${item.color} rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                        {item.emoji}
                      </div>

                      <h3 className="font-space font-bold text-xl text-gray-900 mb-3 relative z-10">{item.title}</h3>
                      <p className="text-gray-500 font-outfit text-base leading-relaxed relative z-10">{item.desc}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Sample Roast Section - Vercel Style */}
            <div className="mt-32 max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                   <h2 className="font-space text-3xl font-bold text-gray-900 mb-2">The Hall of Shame</h2>
                   <p className="font-outfit text-gray-500">Witness the casualties of truth. You're next.</p>
              </div>

              <RoastCarousel roasts={carouselRoasts} />
            </div>

            {/* FAQ Section - Onavix Inspired Clean Card */}
            <FAQ />


          </div>
        </div>

        <Footer />
      </div>

      <LoadingOverlay 
        show={showLoadingPage} 
        shouldRedirect={shouldRedirect}
        username={targetUser}
        hasApiError={hasApiError}
      />
    </div>
  );
}

export default function Page() {
  return (
    <PageContent />
  );
}
