import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Background from "@/components/Background";

export default function LoadingOverlay({ show, onComplete, hasApiError, shouldRedirect, username, platform = 'github' }) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [trainingCount, setTrainingCount] = useState(0);
  const [finalizationProgress, setFinalizationProgress] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const shouldRedirectRef = React.useRef(shouldRedirect);
  
  useEffect(() => {
    shouldRedirectRef.current = shouldRedirect;
    if (shouldRedirect) {
      console.log("LoadingOverlay: shouldRedirect is now TRUE for user:", username);
    }
  }, [shouldRedirect, username]);

  useEffect(() => {
    if (show) {
      startLoadingSequence();
    } else {
        setLoadingStep(0);
        setTrainingCount(0);
        setFinalizationProgress(0);
        setIsInitialized(false);
        setIsTrainingComplete(false);
        setIsStuck(false);
    }
  }, [show]);

  const startLoadingSequence = () => {
    setTimeout(() => {
      setIsInitialized(true);
      setLoadingStep(1);
      startTraining();
    }, 2300);
  };

  const startTraining = () => {
    const targetCount = 79032;
    const duration = 12000;
    const startTime = Date.now();

    const updateCount = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentCount = Math.floor(targetCount * progress);
      
      setTrainingCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(updateCount); 
      } else {
        setTrainingCount(targetCount);
        setIsTrainingComplete(true);
        setTimeout(() => {
          setLoadingStep(2);
          startFinalization();
        }, 1300);
      }
    };
    
    requestAnimationFrame(updateCount);
  };

  const startFinalization = () => {
    const duration = 15600; // 30% slower
    const startTime = Date.now();
    let isFinishing = false;
    let finishStartTime = 0;
    
    const updateProgress = () => {
      const responseReceived = shouldRedirectRef.current;

      if (responseReceived && !isFinishing) {
        console.log("LoadingOverlay: Response received, finishing animation...");
        isFinishing = true;
        finishStartTime = Date.now();
        setIsStuck(false);
      }
      
      let progress;
      
      if (isFinishing) {
        const finishElapsed = Date.now() - finishStartTime;
        const finishDuration = 1040;

        const t = Math.min(finishElapsed / finishDuration, 1);
        const easeOutQuad = t * (2 - t);

         progress = 0.9 + (0.1 * easeOutQuad);
      } else {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        if (progress >= 0.9) {
          progress = 0.9;
        }
      }

      setFinalizationProgress(Math.floor(progress * 100));
      if (progress >= 0.9 && !isFinishing) setIsStuck(true);
      
      if (progress < 1) {
         requestAnimationFrame(updateProgress);
      } else {
          console.log("LoadingOverlay: Animation complete!");
          if (onComplete) onComplete();
      }
    };
    
    requestAnimationFrame(updateProgress);
  };

  useEffect(() => {
    if (shouldRedirect && finalizationProgress >= 100 && username) {
       setTimeout(() => {
         window.location.href = `/roast?user=${encodeURIComponent(username)}&type=${platform}`;
       }, 1000);
    }
  }, [shouldRedirect, finalizationProgress, username]);


  return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-white to-gray-50 flex items-center justify-center overflow-hidden z-[100]"
        initial={false}
        animate={{ x: show ? 0 : "100%" }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Background reduced={true} />
        <motion.div
          className="text-center max-w-3xl unselectable w-full px-4 sm:px-8"
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="mb-12" initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.35 }}>
            <motion.h2 className="font-space text-3xl sm:text-4xl font-bold text-gray-900 mb-3 tracking-tight uppercase" animate={show && !shouldReduceMotion ? { letterSpacing: "0.02em" } : undefined}>
              System Processing
            </motion.h2>
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Initiating behavioral analysis protocols...</p>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-xl border border-gray-300 rounded-xl p-8 shadow-2xl shadow-black/5 max-w-2xl mx-auto relative overflow-hidden"
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.02)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-0 pointer-events-none bg-[length:100%_4px,6px_100%]"></div>
            
            <div className="space-y-8 font-mono text-sm relative z-10">

              <div className="text-left group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <motion.div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      loadingStep >= 0 && isInitialized 
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                        : "bg-gray-300"
                    }`} animate={isInitialized && !shouldReduceMotion ? { scale: [1, 1.1, 1] } : undefined} transition={{ duration: 1.4, repeat: isInitialized && !shouldReduceMotion ? Infinity : 0, ease: 'easeInOut' }} />
                    <span className={`font-bold tracking-tight ${loadingStep >= 0 ? "text-gray-900" : "text-gray-400"}`}>
                       DATA_EXTRACTION
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    loadingStep >= 0 && isInitialized 
                      ? "bg-green-100 text-green-700" 
                      : "bg-gray-100 text-gray-400"
                  }`}>
                    {loadingStep >= 0 && isInitialized ? "[COMPLETE]" : "[WAITING]"}
                  </span>
                </div>
                <div className="pl-5 text-xs text-gray-500">
                  Extracting behavioral data from GitHub footprint...
                </div>
              </div>

              {/* Step 2 */}
              <div className={`text-left group transition-all duration-700 ease-out ${
                loadingStep >= 1 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-50 translate-y-2"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <motion.div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isTrainingComplete 
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                        : "bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                    }`} animate={isTrainingComplete && !shouldReduceMotion ? { scale: [1, 1.1, 1] } : undefined} transition={{ duration: 1.4, repeat: isTrainingComplete && !shouldReduceMotion ? Infinity : 0, ease: 'easeInOut' }} />
                    <span className={`font-bold tracking-tight ${loadingStep >= 1 ? "text-gray-900" : "text-gray-400"}`}>
                       PATTERN_RECOGNITION
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isTrainingComplete 
                      ? "bg-green-100 text-green-700" 
                      : loadingStep >= 1 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isTrainingComplete ? "[COMPLETE]" : loadingStep >= 1 ? "[PROCESSING]" : "[WAITING]"}
                  </span>
                </div>
                
                <div className="pl-5 mb-2 text-xs text-gray-500">
                  Analyzing {trainingCount.toLocaleString()} behavioral vectors...
                </div>

                {loadingStep === 1 && (
                    <div className="pl-5 mt-2">

                        <PatternVisualizer count={trainingCount} total={79032} />
                  </div>
                )}
              </div>

              {/* Step 3 */}
              <div className={`text-left group transition-all duration-700 ease-out ${
                loadingStep >= 2 
                  ? "opacity-100" 
                  : "opacity-0"
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <motion.div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      finalizationProgress >= 100 
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" 
                        : "bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    }`} animate={finalizationProgress >= 100 && !shouldReduceMotion ? { scale: [1, 1.1, 1] } : undefined} transition={{ duration: 1.4, repeat: finalizationProgress >= 100 && !shouldReduceMotion ? Infinity : 0, ease: 'easeInOut' }} />
                    <span className={`font-bold tracking-tight ${loadingStep >= 2 ? "text-gray-900" : "text-gray-400"}`}>
                       ROAST_GENERATION
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    finalizationProgress >= 100 
                      ? "bg-green-100 text-green-700" 
                      : loadingStep >= 2 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-400"
                  }`}>
                    {finalizationProgress >= 100 ? "[READY]" : loadingStep >= 2 ? `${finalizationProgress}%` : "[WAITING]"}
                  </span>
                </div>

                <div className="pl-5 mt-3">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <motion.div 
                        className="h-full bg-blue-600 transition-all duration-200 ease-out relative"
                        style={{ width: `${finalizationProgress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_1s_infinite]"></div>
                      </motion.div>
                  </div>
                </div>
              </div>

              {!isInitialized && (
                <motion.div className="mt-8 flex justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}>
                  <div className="relative">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-black"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-black animate-ping opacity-20"></div>
                  </div>
                </motion.div>
              )}

            </div>
          </motion.div>

          <div className="mt-8 text-xs text-gray-400 font-mono tracking-wide uppercase">
            System resources allocated...
          </div>
        </motion.div>
      </motion.div>
  );
}

// Memoized Visualizer to avoid unnecessary DOM thrashing if props strictly equal (not likely here as count changes)
// But isolating it is good practice
const PatternVisualizer = React.memo(({ count, total }) => {
    return (
        <div className="flex space-x-0.5 h-4 items-end">
            {[...Array(40)].map((_, i) => (
            <div
                key={i}
                className={`w-1.5 rounded-sm transition-all duration-100 ${
                i < (count / total) * 40
                    ? "bg-orange-500"
                    : "bg-gray-100"
                }`}
                style={{
                height: '60%',
                opacity: i < (count / total) * 40 ? 1 : 0.3
                }}
            />
            ))}
        </div>
    );
});
