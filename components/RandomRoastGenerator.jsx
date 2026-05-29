"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";

const randomRoasts = [
  {
    roast: 'Your GitHub profile is like a graveyard of abandoned ideas. "My-First-API" from 2018? Let it go, man.',
    tags: ["#AbandonedProjects", "#DigitalGraveyard"]
  },
  {
    roast: 'You have 47 repos but 44 are forks of the same "awesome-list" repo. We get it, you like lists more than code.',
    tags: ["#ForkAddict", "#ListCollector"]
  },
  {
    roast: 'Your commit messages read like a cry for help: "fixed", "update", "changes", "stuff". Your code deserves better eulogies.',
    tags: ["#LazyCommits", "#MinimalEffort"]
  },
  {
    roast: 'That "README.md" you wrote with just the project name? Chef\'s kiss. Pure art. Or pure laziness. Hard to tell.',
    tags: ["#NoDocs", "#ReadmeWho"]
  },
  {
    roast: 'Your contribution graph looks like a barren desert with one random green dot from 2019. What happened that day? Did you accidentally commit?',
    tags: ["#EmptyGraph", "#OneHitWonder"]
  },
  {
    roast: 'You describe yourself as a "Full Stack Developer" but your repos suggest you\'re a full stack of unfinished tutorials.',
    tags: ["#TutorialDev", "#StackOverflowEngineer"]
  }
];

export default function RandomRoastGenerator() {
  const [currentRoast, setCurrentRoast] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [roastCount, setRoastCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const generateRandomRoast = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * randomRoasts.length);
      setCurrentRoast(randomRoasts[randomIndex]);
      setRoastCount(prev => prev + 1);
      setIsGenerating(false);
    }, shouldReduceMotion ? 0 : 400);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-200 p-8 shadow-sm">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-50 border border-red-100 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-red-500 mr-2" />
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest font-space">Random Roast</span>
        </div>
        <h3 className="font-space text-2xl font-bold text-gray-900 mb-2">
          Need a quick burn?
        </h3>
        <p className="font-outfit text-gray-500 text-sm max-w-md mx-auto">
          Not ready for the full treatment? Get a sample of the pain that awaits.
        </p>
      </div>

      <div className="min-h-[160px] flex items-center justify-center mb-6">
        <AnimatePresence mode="wait">
          {currentRoast ? (
            <motion.div
              key={roastCount}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20, scale: shouldReduceMotion ? 1 : 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -20, scale: shouldReduceMotion ? 1 : 0.95 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="text-center"
            >
              <p className="font-pop text-gray-700 text-lg leading-relaxed italic mb-6">
                &ldquo;{currentRoast.roast}&rdquo;
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {currentRoast.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-mono text-gray-500">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-400 font-outfit"
            >
              <div className="text-6xl mb-4">🔥</div>
              <p>Click the button to get a random preview roast</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <motion.button
          onClick={generateRandomRoast}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl font-space font-medium text-sm hover:bg-black transition-all duration-200 disabled:opacity-50 shadow-md"
          whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        >
          <motion.div
            animate={isGenerating ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.8, repeat: isGenerating ? Infinity : 0, ease: "linear" }}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.div>
          {isGenerating ? "Brewing..." : "Roast Me Randomly"}
        </motion.button>
      </div>
    </div>
  );
}
