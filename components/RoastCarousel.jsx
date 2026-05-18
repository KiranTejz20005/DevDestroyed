import React, { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function RoastCarousel({ roasts }) {
  const [activeRoastIndex, setActiveRoastIndex] = useState(0);
  const [shuffledRoasts, setShuffledRoasts] = useState([]);
  const [slideDirection, setSlideDirection] = useState('right');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (roasts && roasts.length > 0) {
        setShuffledRoasts([...roasts].sort(() => Math.random() - 0.5));
    }
  }, [roasts]);


  

  useEffect(() => {
      if (shuffledRoasts.length === 0 || isTransitioning) return;
      
      const timer = setTimeout(() => {
          changeSlide('next');
      }, 9700);
      
      return () => clearTimeout(timer);
  }, [shuffledRoasts.length, activeRoastIndex, isTransitioning]);

  const changeSlide = (direction) => {
    if (isTransitioning) return;
    
    setSlideDirection(direction);
    setIsTransitioning(true);

    setTimeout(() => {
      if (direction === 'next') {
        setActiveRoastIndex(curr => (curr + 1) % shuffledRoasts.length);
      } else {
        setActiveRoastIndex(curr => (curr - 1 + shuffledRoasts.length) % shuffledRoasts.length);
      }
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, shouldReduceMotion ? 0 : 40); 
    }, shouldReduceMotion ? 0 : 260);
  };
  
  if (shuffledRoasts.length === 0) return null;

  return (
    <div className="relative group min-h-[460px] sm:min-h-[420px]">
        <motion.div
          className="absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-2xl blur opacity-20 transition duration-500"
          animate={shouldReduceMotion ? { opacity: 0.2 } : { opacity: [0.16, 0.28, 0.16], scale: [1, 1.01, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        {/* Active Slide Content */}
        <div className="relative">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm transition-all duration-500 min-h-[340px] flex flex-col justify-between overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeRoastIndex}
                className="transition-all duration-300 ease-in-out"
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : slideDirection === 'next' ? 24 : -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: shouldReduceMotion ? 0 : slideDirection === 'next' ? -24 : 24 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-gray-50 to-white border border-gray-100 rounded-full flex items-center justify-center text-xl shadow-sm shrink-0 overflow-hidden">
                        {shuffledRoasts[activeRoastIndex].avatar ? (
                          <img 
                            src={shuffledRoasts[activeRoastIndex].avatar} 
                            alt={shuffledRoasts[activeRoastIndex].username} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          shuffledRoasts[activeRoastIndex].emoji
                        )}
                    </div>
                    <div className="text-left">
                        <div className="font-space font-bold text-gray-900 text-lg">{shuffledRoasts[activeRoastIndex].username}</div>
                        <div className="font-mono text-xs text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <span className="hidden mt-1 sm:inline">Roast Level:</span> 
                        <span className="text-red-500 mt-1 font-bold bg-red-50 px-2 py-0.5 rounded-full">{shuffledRoasts[activeRoastIndex].roastLevel}</span>
                        </div>
                    </div>
                </div>
                </div>
                
                <p className="font-pop text-gray-600 leading-relaxed text-lg mb-8">
                "{shuffledRoasts[activeRoastIndex].roast}"
                </p>

                <div className="flex flex-wrap gap-2">
                {shuffledRoasts[activeRoastIndex].tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-50 border border-gray-100 rounded-full text-xs font-mono text-gray-500">
                    {tag}
                    </span>
                ))}
                </div>
                </motion.div>
              </AnimatePresence>
        </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
              key={`reaction-${activeRoastIndex}`}
              className={`
            mt-4 sm:mt-0 sm:absolute sm:-right-8 sm:-bottom-6 sm:max-w-md 
            bg-gray-50 rounded-2xl border border-gray-200 p-6 
            relative z-20 shadow-lg sm:rotate-1 sm:transform
            transition-all duration-500 ease-in-out
            `}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
            <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 font-space font-bold text-gray-900 text-sm">{shuffledRoasts[activeRoastIndex].username}</div>
                <span className="text-xs text-gray-400">just now</span>
            </div>
            <p className="font-outfit text-gray-700 text-sm italic">
                <span className="text-red-500 font-bold mr-1 not-italic">{shuffledRoasts[activeRoastIndex].reactionSentiment === 'Angry' ? 'WTF??' : shuffledRoasts[activeRoastIndex].reactionSentiment === 'Sad' ? 'Ouch.' : shuffledRoasts[activeRoastIndex].reactionSentiment === 'Defensive' ? 'Excuse me?' : 'Uhm...'}</span>
                {shuffledRoasts[activeRoastIndex].reaction}
            </p>
              </motion.div>
            </AnimatePresence>

        <div className="mt-8 flex items-center justify-between px-1 sm:px-4">
            <div className="flex items-center gap-4">
                <button 
                onClick={() => changeSlide('prev')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                disabled={isTransitioning}
                >
                <ChevronLeft size={20} />
                </button>
                
                <div className="h-1 w-32 sm:w-48 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    key={activeRoastIndex + (isTransitioning ? '-t' : '')}
                    className="h-full bg-gray-900 rounded-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isTransitioning ? 0 : 1 }}
                    transition={{ duration: shouldReduceMotion ? 0 : 10, ease: 'linear' }}
                  />
                </div>

                <button 
                onClick={() => changeSlide('next')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                disabled={isTransitioning}
                >
                <ChevronRight size={20} />
                </button>
            </div>
            <div className="font-mono text-xs text-gray-400">
            {activeRoastIndex + 1} / {shuffledRoasts.length}
            </div>
        </div>

        </div>
    </div>
  );
}
