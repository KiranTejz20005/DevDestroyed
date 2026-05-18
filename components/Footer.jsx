"use client";

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function Footer() {
  const [currentTime, setCurrentTime] = useState('');
  const [emojiIndex, setEmojiIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  
  const emojis = ['🦄', '🚀', '💀', '🔥', '⚡', '🎯', '💻', '🌟', '⭐', '✨', '🎪', '🎭', '🎨', '🎲'];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentTime(`${timeString.replace(',', '')}`);
    };

    const rotateEmoji = () => {
      setEmojiIndex((prevIndex) => (prevIndex + 1) % emojis.length);
    };

    updateTime();

    const timeInterval = setInterval(updateTime, 1000);
    const emojiInterval = setInterval(rotateEmoji, 1000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(emojiInterval);
    };
  }, []);

  return (
    <motion.div
      className="relative w-full px-4 pb-8 mt-auto"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hidden sm:flex justify-between items-center">
        <motion.div className="bg-[#202020] text-white text-sm font-mono px-4 py-2 rounded-lg" whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center space-x-2">
            <span className="text-base">{emojis[emojiIndex]}</span>
            <span className="text-xs tracking-wider font-medium">
              2026 | A PROJECT BY{' '}
              <span className="transition-colors hover:text-blue-300 duration-200">
                KIRAN TEJA
              </span>
            </span>
          </div>
        </motion.div>
        
        <motion.div className="bg-[#202020] text-white text-sm font-mono px-4 py-2 rounded-lg shadow-lg" whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center space-x-2">
            ⏲️
            <motion.span
              key={currentTime}
              initial={{ opacity: 0.6, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
              className="text-xs ml-2 tracking-wider font-medium"
            >
              {currentTime}
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="sm:hidden flex flex-col items-center space-y-3 text-center pt-4">
        <motion.div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg" whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }} transition={{ duration: 0.2 }}>
          <span className="text-base">{emojis[emojiIndex]}</span>
          <span className="text-xs text-black/80 font-mono tracking-wider font-semibold">
            2026 | A PROJECT BY{' '}
            <span className="text-blue-600">
              KIRAN TEJA
            </span>
          </span>
        </motion.div>
        <motion.div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg" whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }} transition={{ duration: 0.2 }}>
          ⏲️
          <motion.span
            key={currentTime}
            initial={{ opacity: 0.6, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            className="text-xs text-black/80 ml-2 font-mono tracking-wider font-semibold"
          >
            {currentTime}
          </motion.span>
        </motion.div>
      </div>
    </motion.div>
  );
}