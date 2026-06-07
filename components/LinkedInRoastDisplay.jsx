import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function LinkedInRoastDisplay({ roastData, profileData, onHome }) {
  const shouldReduceMotion = useReducedMotion();

  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.12,
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30, scale: shouldReduceMotion ? 1 : 0.96 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : 0.3 + i * 0.15,
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hover: shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.2 } },
  };

  if (!roastData || !profileData) {
    return <div className="text-center py-10">Data missing...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-20 pt-8">
      <motion.div 
        className="text-center mb-8"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <h1 className="font-merri text-4xl sm:text-5xl font-light text-[#0077b5] mb-2 tracking-tight">
          LinkedIn Roast
        </h1>
        <p className="font-pop text-black/60 text-lg">
          Destroying professional personas, one buzzword at a time.
        </p>
      </motion.div>

      {/* Navigation Bar */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
        variants={fadeUpVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <button 
          onClick={onHome}
          className="flex items-center space-x-2 text-black/70 hover:text-[#0077b5] transition-colors group cursor-pointer"
        >
          <svg className="w-4 h-4 transition-transform duration-250 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-pop text-sm font-medium">Back to Home</span>
        </button>
      </motion.div>

      {/* User Profile Card */}
      <motion.div 
        className="bg-white/90 border-2 border-[#0077b5]/20 rounded-2xl p-6 sm:p-8 shadow-md mb-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-sm flex-shrink-0">
          {profileData.avatar_url ? (
            <img src={profileData.avatar_url} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-2xl">
              {profileData.name?.[0] || '?'}
            </div>
          )}
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="font-merri text-2xl sm:text-3xl font-bold text-black mb-1">{profileData.name}</h2>
          <p className="font-pop text-gray-600 font-medium mb-3">{profileData.headline || 'No Headline (Boring)'}</p>
          <div className="bg-red-50 text-red-600 rounded-lg p-3 border border-red-100 text-sm italic">
            "{roastData.profile_summary}"
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {roastData.roasts?.map((item, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            custom={3 + index}
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#0077b5]"></div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 uppercase tracking-wide text-sm">{item.category}</h3>
            <p className="text-gray-500 italic mb-4 pb-4 border-b border-gray-100 text-sm">Target: {item.target}</p>
            <p className="font-pop text-gray-800 leading-relaxed">{item.roast}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="mt-10 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border border-red-100 shadow-md text-center"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={7}
      >
        <div className="text-6xl font-bold text-red-500 mb-4">{roastData.overall_score}/10</div>
        <h3 className="font-bold text-xl text-gray-900 mb-4 uppercase tracking-wider">Final Verdict</h3>
        <p className="font-pop text-gray-800 font-medium leading-relaxed">{roastData.brutal_summary}</p>
      </motion.div>
    </div>
  );
}
