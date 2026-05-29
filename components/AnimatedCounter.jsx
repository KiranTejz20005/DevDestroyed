"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useReducedMotion, useInView } from "framer-motion";

export default function AnimatedCounter({ value, label, suffix = "", prefix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });
  const shouldReduceMotion = useReducedMotion();
  const hasAnimated = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (isInView && !hasAnimated.current && value > 0) {
      hasAnimated.current = true;
      
      if (shouldReduceMotion) {
        setCount(value);
        return;
      }

      const startTime = Date.now();
      const startValue = 0;

      const updateCount = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / (duration * 1000), 1);
        
        // Ease out quad
        const eased = progress * (2 - progress);
        const currentCount = Math.floor(startValue + (value - startValue) * eased);
        
        setCount(currentCount);

        if (progress < 1) {
          rafRef.current = requestAnimationFrame(updateCount);
        } else {
          setCount(value);
        }
      };

      rafRef.current = requestAnimationFrame(updateCount);
      
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }
      };
    }
  }, [isInView, value, duration, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="font-space text-4xl sm:text-5xl font-bold text-gray-900 mb-2 tracking-tight">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="font-outfit text-sm text-gray-400 uppercase tracking-wider font-medium">
        {label}
      </div>
    </motion.div>
  );
}
