import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Background({ reduced = false }) {
  const shouldReduceMotion = useReducedMotion();

  const floatTransition = (duration, delay = 0) => ({
    duration,
    delay,
    repeat: Infinity,
    repeatType: 'mirror',
    ease: 'easeInOut',
  });

  const floatY = shouldReduceMotion || reduced ? 0 : [0, -10, 0];

  return (
    <>
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-[0.03]"></div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-gray-50/50 to-white"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none select-none">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/20 rounded-full blur-[100px]"
          animate={shouldReduceMotion || reduced ? { opacity: 0.2 } : { opacity: [0.18, 0.28, 0.18], scale: [1, 1.05, 1] }}
          transition={floatTransition(10)}
        />
        {/* <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }}></div> */}
        
        {/* Left Side - Distributed vertically */}
        <motion.div className="absolute top-[10%] left-[2%] md:left-[2%] text-5xl md:text-7xl opacity-20 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(7)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>💀</motion.div>
        {!reduced && <motion.div className="absolute top-[21%] left-[2%] md:left-[8%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(8, 0.4)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🤡</motion.div>}
        <motion.div className="absolute top-[40%] left-[-1%] md:left-[4%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9, 0.2)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🔥</motion.div>
        {!reduced && <motion.div className="absolute top-[55%] left-[3%] md:left-[10%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(8.5, 0.7)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🚩</motion.div>}
        <motion.div className="absolute top-[75%] left-[1%] md:left-[5%] text-4xl md:text-6xl opacity-15 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(10.5, 0.5)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>✨</motion.div>
        {!reduced && <motion.div className="absolute top-[85%] left-[2%] md:left-[8%] text-3xl md:text-5xl opacity-20 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(7.5, 0.8)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>😭</motion.div>}
        <motion.div className="absolute top-[4%] left-[8%] md:left-[14%] text-3xl md:text-6xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(8.8, 0.3)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>💅</motion.div>
        <motion.div className="absolute top-[31%] left-[5%] md:left-[13%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9.2, 0.6)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🤓</motion.div>

        {/* New Additions based on Red Circles */}
        {/* <div className="absolute top-[2%] left-[2%] md:left-[5%] text-4xl md:text-6xl opacity-15 animate-float-medium delay-500 hover:opacity-40 transition-opacity duration-300">👻</div> */}
        <motion.div className="absolute top-[5%] left-[25%] md:left-[30%] text-3xl md:text-5xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9.5, 0.4)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🧠</motion.div>
        {!reduced && <motion.div className="absolute top-[20%] left-[15%] md:left-[19%] text-4xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(7.8, 0.9)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🍆</motion.div>}
        <motion.div className="absolute top-[35%] right-[-2%] md:right-[1%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(8.4, 0.1)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🤖</motion.div>
        <motion.div className="absolute top-[65%] left-[11%] md:left-[11%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(10.2, 0.2)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🍑</motion.div>
        
        <motion.div className="absolute top-[5%] right-[25%] md:right-[22%] text-3xl md:text-5xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(8.9, 0.7)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>👽</motion.div>
        {/* <div className="absolute top-[2%] right-[5%] md:right-[10%] text-4xl md:text-6xl opacity-15 animate-float-fast delay-1000 hover:opacity-40 transition-opacity duration-300">👽</div> */}

        <motion.div className="absolute top-[7%] right-[-2%] md:right-[3%] text-6xl md:text-7xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(8.7, 0.15)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>😭</motion.div>
        {!reduced && <motion.div className="absolute top-[27%] right-[2%] md:right-[10%] text-4xl md:text-6xl opacity-20 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(9.7, 0.5)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🧢</motion.div>}
        <motion.div className="absolute top-[43%] right-[-1%] md:right-[5%] text-4xl md:text-7xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9.9, 0.35)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🗿</motion.div>
        {!reduced && <motion.div className="absolute top-[60%] right-[4%] md:right-[12%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(8.2, 0.65)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🤪</motion.div>}
        <motion.div className="absolute top-[75%] right-[1%] md:right-[6%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(10.4, 0.45)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🫠</motion.div>
        {!reduced && <motion.div className="absolute top-[90%] right-[3%] md:right-[8%] text-5xl md:text-7xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(11, 0.55)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🗑️</motion.div>}
        <motion.div className="absolute top-[15%] right-[8%] md:right-[15%] text-3xl md:text-6xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(8.6, 0.25)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>👀</motion.div>
        {!reduced && <motion.div className="absolute top-[33%] right-[5%] md:right-[20%] text-2xl md:text-5xl opacity-20 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(7.9, 0.75)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🤌</motion.div>}

        {/* Bottom Section - New emojis for extended page */}
        <motion.div className="absolute top-[95%] left-[3%] md:left-[6%] text-4xl md:text-6xl opacity-15 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(10.8, 0.2)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>💀</motion.div>
        {!reduced && <motion.div className="absolute top-[105%] left-[10%] md:left-[15%] text-3xl md:text-5xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(8.1, 0.6)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🎭</motion.div>}
        <motion.div className="absolute top-[115%] right-[2%] md:right-[5%] text-4xl md:text-6xl opacity-15 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9.4, 0.85)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>💔</motion.div>
        {!reduced && <motion.div className="absolute top-[100%] right-[12%] md:right-[18%] text-3xl md:text-5xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(10.1, 0.3)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🧊</motion.div>}
        <motion.div className="absolute top-[110%] left-[1%] md:left-[4%] text-5xl md:text-7xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(8.3, 0.4)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🔥</motion.div>
        {!reduced && <motion.div className="absolute top-[120%] left-[8%] md:left-[12%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(7.6, 0.95)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>😵</motion.div>}
        <motion.div className="absolute top-[125%] right-[3%] md:right-[7%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9.8, 0.5)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>☠️</motion.div>
        {!reduced && <motion.div className="absolute top-[108%] left-[20%] md:left-[25%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(8.7, 0.15)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>🤡</motion.div>}
        <motion.div className="absolute top-[118%] right-[15%] md:right-[20%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(10.5, 0.7)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🪦</motion.div>
        {!reduced && <motion.div className="absolute top-[130%] left-[5%] md:left-[8%] text-3xl md:text-5xl opacity-15 hover:opacity-40 transition-opacity duration-300 hidden md:block" animate={shouldReduceMotion ? undefined : { y: floatY }} transition={floatTransition(8.9, 0.35)} whileHover={shouldReduceMotion ? undefined : { scale: 1.06 }}>💅</motion.div>}
        <motion.div className="absolute top-[135%] right-[1%] md:right-[4%] text-4xl md:text-6xl opacity-10 hover:opacity-40 transition-opacity duration-300" animate={shouldReduceMotion || reduced ? undefined : { y: floatY }} transition={floatTransition(9.1, 0.65)} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}>🗿</motion.div>
      </div>
    </>
  );
}
