"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const timelineSteps = [
  {
    step: "01",
    emoji: "🕵️",
    title: "Scrape Repos",
    desc: "We crawl every public repo, commit, and issue. Your 2017 'hello-world' fork? Yeah, we found it.",
    color: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-600"
  },
  {
    step: "02",
    emoji: "🧠",
    title: "Profile Analysis",
    desc: "AI analyzes your commit messages, language choices, and star-to-fork ratio. It's not looking good.",
    color: "from-purple-500 to-purple-600",
    lightBg: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-600"
  },
  {
    step: "03",
    emoji: "📊",
    title: "Pattern Matching",
    desc: "Cross-referencing your code habits against known developer archetypes. The results are... predictable.",
    color: "from-orange-500 to-orange-600",
    lightBg: "bg-orange-50",
    borderColor: "border-orange-200",
    textColor: "text-orange-600"
  },
  {
    step: "04",
    emoji: "🔥",
    title: "Roast Generation",
    desc: "Our savage AI compiles everything into a customized roast designed to maximize emotional damage.",
    color: "from-red-500 to-red-600",
    lightBg: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-600"
  }
];

function TimelineNode({ item, index, scrollYProgress }) {
  const shouldReduceMotion = useReducedMotion();
  const nodeRef = useRef(null);

  const isLeft = index % 2 === 0;

  return (
    <motion.div
      ref={nodeRef}
      className={`flex items-center gap-6 md:gap-12 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}
      initial={{ opacity: 0, x: shouldReduceMotion ? 0 : (isLeft ? -40 : 40), y: shouldReduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1], delay: shouldReduceMotion ? 0 : index * 0.15 }}
    >
      {/* Content Card */}
      <motion.div
        className={`flex-1 bg-white rounded-2xl border ${item.borderColor} p-6 shadow-sm hover:shadow-lg transition-all duration-300`}
        whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl ${item.lightBg} flex items-center justify-center text-2xl flex-shrink-0`}>
            {item.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold ${item.textColor} font-mono`}>{item.step}</span>
              <div className={`h-px flex-1 bg-gradient-to-r ${item.color} opacity-30`} />
            </div>
            <h3 className="font-space font-bold text-gray-900 text-lg mb-1">{item.title}</h3>
            <p className="text-gray-500 font-outfit text-sm leading-relaxed">{item.desc}</p>
          </div>
        </div>
      </motion.div>

      {/* Timeline Node */}
      <div className="hidden md:flex flex-col items-center flex-shrink-0 relative">
        <motion.div
          className={`w-8 h-8 rounded-full bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center text-white text-sm font-bold relative z-10`}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.15 }}
          transition={{ duration: 0.2 }}
        >
          {index + 1}
        </motion.div>
      </div>

      {/* Spacer for alignment */}
      <div className="hidden md:block flex-1" />
    </motion.div>
  );
}

export default function ProcessTimeline() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="relative py-8">
      {/* Center line (desktop only) */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-purple-200 via-orange-200 to-red-200 -translate-x-1/2 rounded-full" />

      <div className="relative space-y-8 md:space-y-12">
        {timelineSteps.map((item, index) => (
          <TimelineNode key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}
