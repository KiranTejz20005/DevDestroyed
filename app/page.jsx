"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import UsernameForm from "@/components/UsernameForm";
import Footer from "@/components/Footer";
import Background from "@/components/Background";
import { Toaster, toast } from "sonner";
import config from '../config.json';
import RoastCarousel from "@/components/RoastCarousel";
import FAQ from "@/components/FAQ";
import LoadingOverlay from "@/components/LoadingOverlay";
import AnimatedCounter from "@/components/AnimatedCounter";
import ProcessTimeline from "@/components/ProcessTimeline";
import RandomRoastGenerator from "@/components/RandomRoastGenerator";

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

const ROAST_SIGNAL_PATTERNS = [
  {
    test: /fork|forks?/i,
    roastLevel: 'Fork Collector',
    tags: ['#ForkCollector', '#AbandonedRepos', '#GitBlameMe'],
    commentField: 'weakness'
  },
  {
    test: /stack overflow|copy|paste|tutorial|copy-paste/i,
    roastLevel: 'StackOverflow Addict',
    tags: ['#TutorialHell', '#CopypasteKing', '#NoRealCode'],
    commentField: 'weakness'
  },
  {
    test: /commit|push|message|history/i,
    roastLevel: 'Commit Chaos',
    tags: ['#LazyCommits', '#EmptyCommits', '#GitBlameMe'],
    commentField: 'strength'
  },
  {
    test: /deploy|production|hotfix|crash/i,
    roastLevel: 'Production Crasher',
    tags: ['#ProductionCrasher', '#YoloDeploys', '#Hotfix'],
    commentField: 'weakness'
  },
  {
    test: /readme|docs?|documentation/i,
    roastLevel: 'Documentation Evader',
    tags: ['#DocumentationIsHard', '#NoDocs', '#SpaghettiCode'],
    commentField: 'life_purpose'
  },
  {
    test: /ai|chatgpt|prompt|gpt/i,
    roastLevel: 'Prompt Engineer',
    tags: ['#PromptEngineer', '#ChatGPTDev', '#ZeroStars'],
    commentField: 'life_purpose'
  },
  {
    test: /todo|task|list/i,
    roastLevel: 'Todo Overlord',
    tags: ['#TodoHell', '#FeatureFreeze', '#ShipItMaybe'],
    commentField: 'strength'
  }
];

function formatRoastTime(updatedAt) {
  if (!updatedAt) {
    return 'generated time unavailable';
  }

  const roastDate = new Date(updatedAt);

  if (Number.isNaN(roastDate.getTime())) {
    return 'generated time unavailable';
  }

  return `generated ${roastDate.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function truncateText(text, maxLength = 120) {
  if (!text) {
    return '';
  }

  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}...` : text;
}

function getRoastSignal(roastText = '') {
  return ROAST_SIGNAL_PATTERNS.find((signal) => signal.test.test(roastText)) || {
    roastLevel: 'GitHub Menace',
    tags: ['#CodeNightmare', '#RepoGoblin', '#ShipItLater'],
    commentField: 'weakness'
  };
}

function buildRelatedComment(roastRecord, signal) {
  const fields = {
    strength: roastRecord.strength,
    weakness: roastRecord.weakness,
    love_life: roastRecord.love_life,
    life_purpose: roastRecord.life_purpose,
  };

  const selectedComment = fields[signal.commentField] || fields.weakness || fields.strength || fields.life_purpose || roastRecord.roast;
  return truncateText(selectedComment, 140);
}

function PageContent() {
  const [isSliding, setIsSliding] = useState(false);
  const [showLoadingPage, setShowLoadingPage] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [targetUser, setTargetUser] = useState("");
  const [hasApiError, setHasApiError] = useState(false);
  const [carouselRoasts, setCarouselRoasts] = useState(SAMPLE_ROASTS);
  const shouldReduceMotion = useReducedMotion();

  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const cardFade = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 18, scale: shouldReduceMotion ? 1 : 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const [realStats, setRealStats] = useState({ roastCount: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/roast/history/recent');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data)) {
            setRealStats({ roastCount: json.data.length });
          }
        }
      } catch (e) {
        // Keep default values when backend is unavailable
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRealRoasts = async () => {
      try {
        const res = await fetch(`${config.url}/api/roast/history/recent`);
        if (!res.ok) {
          return;
        }

        const json = await res.json();
        if (json.success && json.data && json.data.length > 0) {
          const mappedRoasts = json.data.slice(0, 5).map((r, index) => {
            const signal = getRoastSignal(r.roast);
            return {
              username: r.username,
              avatar: r.avatar,
              roastLevel: signal.roastLevel,
              emoji: "🔥", // Fallback
              roast: r.roast.substring(0, 250) + (r.roast.length > 250 ? '...' : ''),
              tags: signal.tags,
              reaction: buildRelatedComment(r, signal),
              reactionSentiment: signal.commentField === 'love_life' ? 'Defensive' : signal.commentField === 'life_purpose' ? 'Reflective' : 'Sad',
              generatedAt: formatRoastTime(r.updated_at)
            };
          });
          setCarouselRoasts(mappedRoasts);
        }
      } catch (e) {
        // Keep the sample carousel when the backend is unavailable.
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

      <motion.div
        className={`relative min-h-screen flex flex-col transition-transform duration-500 ease-in-out ${
          isSliding ? "-translate-x-full" : "translate-x-0"
        }`}
        initial={false}
        animate={{ x: isSliding ? "-100%" : "0%" }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Background />
        <motion.div
          className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative z-10"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          
          <div className="max-w-5xl mb-16 mt-24 sm:mt-20 w-full text-center">
            <motion.div variants={fadeUp} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mb-7">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-widest font-space">Introducing DevDestroyed v1.0</span>
            </motion.div>
            
            <motion.h1 variants={fadeUp} className="font-space text-4xl sm:text-7xl md:text-7xl max-w-[45rem] mx-auto font-bold tracking-tighter text-gray-900 mb-8 leading-[0.9]">
              Turning GitHub Profiles Into Comedy Material.
            </motion.h1>

            <motion.p variants={fadeUp} className="font-space text-lg sm:text-xl text-gray-500 mb-9 max-w-2xl mx-auto leading-relaxed">
              Enter your username and witness the art of digital destruction. Our sophisticated A.I roasts you by your repositories and commit history.
            </motion.p>

            <motion.div variants={fadeUp}>
              <UsernameForm onSubmitComplete={handleFormSubmit} />
            </motion.div>

            <motion.div variants={fadeUp} className="mt-8 mb-4">
              <a href="/hall-of-shame" className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl border-2 border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:border-orange-300 font-bold font-mono transition-all duration-200 hover:-translate-y-1 shadow-sm">
                🔥 View Hall of Shame
              </a>
            </motion.div>

            <motion.div variants={staggerContainer} className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-6xl mx-auto sm:px-4 px-1" initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }}>
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
                <motion.div key={idx} variants={cardFade} className="group p-8 rounded-3xl bg-white border border-gray-100 shadow-sm shadow-gray-200/50 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 hover:-translate-y-1" whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}>
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 font-outfit">{feature.title}</h3>
                  <p className="text-base text-gray-500 font-space leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Counter Section */}
            <motion.div 
              className="mt-32 border-t border-gray-100 pt-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <AnimatedCounter value={realStats.roastCount} label="Profiles Roasted" duration={2.5} />
                <AnimatedCounter value={realStats.roastCount} label="Egos Destroyed" duration={2} />
                <AnimatedCounter value={realStats.roastCount} label="Roasts Generated" duration={3} />
                <AnimatedCounter value={realStats.roastCount > 0 ? realStats.roastCount : 0} label="Truths Delivered" duration={2} />
              </div>
              
              <motion.p 
                className="font-outfit text-sm text-gray-400 mt-12 tracking-wide text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Crafted with precision. Delivered without mercy.
              </motion.p>
            </motion.div>

            {/* What You'll Get Section */}
            <motion.div className="mt-20 sm:mt-32 max-w-4xl mx-auto" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-15%" }}>
              <motion.h2 variants={fadeUp} className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-1 tracking-tight">
                What Awaits You
              </motion.h2>
              <motion.p variants={fadeUp} className="font-outfit text-lg text-gray-500 mb-12">
                Brace yourself for a multi-dimensional personality autopsy
              </motion.p>

              <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={staggerContainer}>
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
                  <motion.div key={idx} variants={cardFade} className={`relative p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border border-gray-100 hover:scale-[1.02] transition-transform ease-out duration-300 cursor-default`} whileHover={shouldReduceMotion ? undefined : { y: -4 }}>
                    <div className="text-4xl mb-3">{item.emoji}</div>
                    <h3 className="font-space text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="font-outfit max-w-[19rem] mx-auto text-sm text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* How It Works Section - Enhanced with Timeline */}
            <motion.div className="mt-32 max-w-5xl mx-auto px-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }}>
              <div className="text-center mb-16">
                <motion.div variants={fadeUp} className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-50 border border-red-100 shadow-sm mb-6">
                     <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-space">The Disassembly Line</span>
                </motion.div>
                <motion.h2 variants={fadeUp} className="font-space text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                    From Data to Destruction
                </motion.h2>
                <motion.p variants={fadeUp} className="font-outfit text-lg text-gray-500 max-w-2xl mx-auto">
                    A four-step process designed to dismantle your self-esteem efficiently.
                </motion.p>
              </div>
              
              <motion.div variants={cardFade}>
                <ProcessTimeline />
              </motion.div>
            </motion.div>

            {/* Sample Roast Section - Vercel Style */}
            <motion.div className="mt-32 max-w-4xl mx-auto px-4" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-10%" }}>
              <div className="text-center mb-12">
                   <motion.h2 variants={fadeUp} className="font-space text-3xl font-bold text-gray-900 mb-2">The Hall of Shame</motion.h2>
                   <motion.p variants={fadeUp} className="font-outfit text-gray-500">Witness the casualties of truth. You're next.</motion.p>
              </div>

              <motion.div variants={cardFade}>
                <RoastCarousel roasts={carouselRoasts} />
              </motion.div>
            </motion.div>

            {/* Random Roast Generator */}
            <motion.div 
              className="mt-32 max-w-4xl mx-auto px-4"
              variants={cardFade}
            >
              <RandomRoastGenerator />
            </motion.div>

            {/* FAQ Section */}
            <motion.div variants={cardFade}>
              <FAQ />
            </motion.div>


          </div>
        </motion.div>

        <Footer />
      </motion.div>

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
