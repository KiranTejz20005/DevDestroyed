'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import config from '../../config.json';
import Footer from '@/components/Footer';
import { Toaster, toast } from "sonner";
import { Check, Share2, Sparkles } from 'lucide-react';
import LinkedInRoastDisplay from '@/components/LinkedInRoastDisplay';

const parseQuestions = (rawQuestions) => {
  try {
    return JSON.parse(rawQuestions);
  } catch (e) {

    const jsonMatch = rawQuestions.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (err) {
        console.error('Failed to parse extracted JSON:', err);
        return null;
      }
    }
  }
  return null;
};

export default function RoastPage() {
  const [roastData, setRoastData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showRoastResults, setShowRoastResults] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [platformType, setPlatformType] = useState('github');
  const [linkedinData, setLinkedinData] = useState(null);

  const [aiSummaries, setAiSummaries] = useState({
    detailedRoast: null,
    strengthAnalysis: null,
    weaknessAnalysis: null,
    loveLifeAnalysis: null,
    lifePurposeAnalysis: null
  });

  const [aiSummariesComplete, setAiSummariesComplete] = useState({
    detailedRoast: false,
    strengthAnalysis: false,
    weaknessAnalysis: false,
    loveLifeAnalysis: false,
    lifePurposeAnalysis: false
  });

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
    hidden: { 
      opacity: 0, 
      y: shouldReduceMotion ? 0 : 30, 
      scale: shouldReduceMotion ? 1 : 0.96 
    },
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
    hover: shouldReduceMotion ? {} : {
      y: -3,
      transition: { duration: 0.2 },
    },
  };

  const reactionMessages = [
    "lol", "omg", "wait what", "hold up", "no way", "really?", "oh my...", 
    "yikes", "hmm", "okay then", "well well well", "oof"
  ];

  useEffect(() => {
    let intervalId = null;

    const initialFetch = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const username = urlParams.get('user');

        if (!username) {
            setError('No username provided in URL');
            setLoading(false);
            return;
        }

        const handleSummaries = (summariesData) => {
            setUserData({
                username: summariesData.username,
                avatar: summariesData.avatar,
                languages: summariesData.languages,
            });

            setAiSummaries(prevSummaries => {
                const newSummaries = { ...prevSummaries };
                let hasChanged = false;
                Object.keys(newSummaries).forEach(key => {
                    if (summariesData.aiSummaries[key] && !prevSummaries[key]) {
                        newSummaries[key] = summariesData.aiSummaries[key];
                        hasChanged = true;
                    }
                });
                return hasChanged ? newSummaries : prevSummaries;
            });

            setAiSummariesComplete(prevComplete => {
                const newComplete = { ...prevComplete };
                let hasChanged = false;
                Object.keys(newComplete).forEach(key => {
                    const isComplete = !!summariesData.aiSummaries[key];
                    if (isComplete && !prevComplete[key]) {
                        newComplete[key] = true;
                        hasChanged = true;
                    }
                });
                return hasChanged ? newComplete : prevComplete;
            });

            return Object.values(summariesData.aiSummaries).every(summary => !!summary);
        };

        try {
            const platform = urlParams.get('type') || 'github';
            setPlatformType(platform);

            const endpoint = platform === 'linkedin' 
                ? `${config.url}/api/roast/linkedin/${encodeURIComponent(username)}`
                : `${config.url}/api/roast/${encodeURIComponent(username)}`;

            const response = await fetch(endpoint);
            const data = await response.json();

            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch roast data.');
            }

            if (data.type === 'questions') {
                const parsedQuestions = parseQuestions(data.data.questions);
                if (!parsedQuestions) throw new Error('Failed to parse roast questions.');
                
                setUserData({ username: data.data.username, avatar: data.data.avatar });
                setRoastData(parsedQuestions);
                setLoading(false);
                startChatSequence(parsedQuestions);
            } else if (platform === 'linkedin') {
                if (data.data) {
                    setLinkedinData(data);
                    setLoading(false);
                } else {
                    // Start polling for linkedin
                    intervalId = setInterval(async () => {
                        try {
                            const pollResponse = await fetch(endpoint);
                            const pollData = await pollResponse.json();
                            if (pollData.success && pollData.data) {
                                setLinkedinData(pollData);
                                setLoading(false);
                                clearInterval(intervalId);
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }, 2000);
                }
            } else if (data.type === 'summaries') {
                setShowRoastResults(true);
                setLoading(false);
                window.scrollTo(0, 0);

                const allComplete = handleSummaries(data.data);

                if (!allComplete) {
                    intervalId = setInterval(async () => {
                        try {
                            const pollResponse = await fetch(endpoint);
                            const pollData = await pollResponse.json();

                            if (pollData.success && pollData.type === 'summaries') {
                                if (handleSummaries(pollData.data)) {
                                    clearInterval(intervalId);
                                }
                            } else if (!pollData.success) {
                                clearInterval(intervalId);
                            }
                        } catch (pollErr) {
                            console.error('Polling error:', pollErr);
                            clearInterval(intervalId);
                        }
                    }, 1000);
                }
            }
        } catch (err) {
            console.error('Error fetching roast data:', err);
            setError(err.message || 'An unknown error occurred.');
            setLoading(false);
        }
    };

    initialFetch();

    return () => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    };
}, []);

  useEffect(() => {
    let roastToastId = null;

    if (showRoastResults) {
        const allComplete = Object.values(aiSummariesComplete).every(status => status);
        if (!allComplete) {
            roastToastId = toast.loading('Hold on tight! Your roast is being generated, this should take 5-10 seconds.', {
                duration: Infinity 
            });
        } else {
            toast.dismiss();
        }
    }

    return () => {
        if (roastToastId) {
            toast.dismiss(roastToastId);
        }
    };
  }, [showRoastResults, aiSummariesComplete]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (window.innerWidth >= 640) {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }
    };
    
    if (chatMessages.length > 0) {
      scrollToBottom();
    }
  }, [chatMessages]);

  useEffect(() => {
    if (showRoastResults) {
      window.scrollTo(0, 0);
    }
  }, [showRoastResults]);

  const typeMessage = (message, isUser = false) => {
    return new Promise((resolve) => {
      const messageId = Date.now() + Math.random();

      setChatMessages(prev => [...prev, { 
        id: messageId, 
        text: '', 
        isUser, 
        isTyping: !isUser 
      }]);
      
      if (isUser) {
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, text: message, isTyping: false } : msg
          )
        );
        resolve();
      } else {
        setIsTyping(true);
        let currentText = '';
        let charIndex = 0;
        
        const typeChar = () => {
          if (charIndex < message.length) {
            currentText += message[charIndex];
            setChatMessages(prev => 
              prev.map(msg => 
                msg.id === messageId ? { ...msg, text: currentText } : msg
              )
            );
            charIndex++;

            const delay = Math.random() * 20 + 20;
            setTimeout(typeChar, delay);
          } else {
            setChatMessages(prev => 
              prev.map(msg => 
                msg.id === messageId ? { ...msg, isTyping: false } : msg
              )
            );
            setIsTyping(false);
            resolve();
          }
        };

        setTimeout(typeChar, 300);
      }
    });
  };

  const startChatSequence = async (questionsData) => {
    await typeMessage("First analyzing your GitHub footprint...", false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await typeMessage("I found some interesting code patterns", false);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    await typeMessage(reactionMessages[Math.floor(Math.random() * reactionMessages.length)], false);
    await new Promise(resolve => setTimeout(resolve, 600));
    
    await typeMessage(reactionMessages[Math.floor(Math.random() * reactionMessages.length)], false);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (questionsData && questionsData.length > 0) {
      await typeMessage(questionsData[0].question, false);
      setShowButtons(true);
    }
  };

  const handleAnswer = async (answer) => {
    setShowButtons(false);

    await typeMessage(answer, true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentQ = roastData[currentQuestion];
    const response = answer === 'Yes' ? currentQ.yes_response : currentQ.no_response;

    await typeMessage(response, false);
    await new Promise(resolve => setTimeout(resolve, 800));

    const reaction = reactionMessages[Math.floor(Math.random() * reactionMessages.length)];
    await typeMessage(reaction, false);
    
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < roastData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await typeMessage(roastData[currentQuestion + 1].question, false);
      setShowButtons(true);
    } else {
      setIsComplete(true);
      const urlParams = new URLSearchParams(window.location.search);
      const username = urlParams.get('user');
      try {
        await fetch(`${config.url}/api/roast/${encodeURIComponent(username)}/seen`, { method: 'POST' });
      } catch (err) {
        console.error("Failed to mark questions as seen:", err);
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsShared(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsShared(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error("Failed to copy link");
    }
  };

  const RoastCard = ({ title, content, emoji, isLoading, className = "", index = 0 }) => (
    <motion.div 
      className={`bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 shadow-xs transition-all duration-300 ${className}`}
      variants={cardVariants}
      custom={index}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-5%" }}
    >
      <div className="flex items-center space-x-2.5 mb-3">
        <motion.span 
          className="text-2xl"
          animate={!isLoading && !shouldReduceMotion ? { scale: [1, 1.2, 1] } : undefined}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
        >{emoji}</motion.span>
        <h3 className="font-merri text-xl font-light text-black">{title}</h3>
        {isLoading && (
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Sparkles className="w-4 h-4 text-gray-400 ml-1" />
          </motion.div>
        )}
      </div>
      {isLoading ? (
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-4 bg-gray-200 rounded"
            animate={{ width: ['100%', '80%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded w-5/6"
            animate={{ width: ['83%', '60%', '83%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
          />
          <motion.div 
            className="h-4 bg-gray-200 rounded w-4/6"
            animate={{ width: ['67%', '45%', '67%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
          />
        </motion.div>
      ) : (
        <motion.p 
          className="font-pop text-black/80 leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {content}
        </motion.p>
      )}
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black mx-auto mb-4"></div>
          <p className="font-mono text-sm text-black/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="font-merri text-2xl font-light text-black mb-4">Something went wrong</h1>
          <p className="font-pop text-black/60 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-black text-white px-6 py-3 rounded-lg font-pop font-medium cursor-pointer transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-white to-gray-50 overflow-hidden">
      <Toaster theme="light" position="bottom-right" richColors />
      
      {platformType === 'linkedin' && linkedinData ? (
        <LinkedInRoastDisplay 
          roastData={linkedinData.data} 
          profileData={linkedinData.profile} 
          onHome={() => window.location.href = '/'} 
        />
      ) : (
        <>
          {!showRoastResults && (
            <div className="relative">
          <div className="min-h-screen p-4">
            <div className="max-w-2xl mx-auto pt-8">
              <div className="space-y-6">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex flex-col">
                      <div
                        className={`max-w-sm px-4 py-3 rounded-2xl ${
                          message.isUser
                            ? 'bg-black text-white font-pop ml-auto'
                            : 'bg-white/90 backdrop-blur-sm border border-gray-200 text-black font-pop shadow-sm'
                        }`}
                      >
                        {message.text}
                        {message.isTyping && (
                          <span className="inline-block w-1 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                        )}
                      </div>
                      
                      {showButtons && !message.isUser && chatMessages.indexOf(message) === chatMessages.length - 1 && (
                        <div className="flex justify-end mt-4 space-x-3">
                          <button
                            onClick={() => handleAnswer('Yes')}
                            className="bg-[#2c2c2c] text-white px-5 py-2.5 rounded-2xl hover:bg-[#151515] font-pop font-medium cursor-pointer transition-all duration-300 ease-in-out"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleAnswer('No')}
                            className="bg-gray-200 text-black px-5 py-2.5 rounded-2xl font-pop font-medium cursor-pointer hover:bg-gray-300 transition-all duration-300 ease-in-out"
                          >
                            No
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {isComplete && (
                <div className="text-center mt-12 mb-10">
                  <div className="text-black/60 font-mono text-sm">
                    That's all! Redirecting you now. 🎉
                  </div>
                </div>
              )}

              <div className="text-center opacity-0 mt-24 mb-16">
                a
              </div>
            </div>
          </div>
        </div>
      )}

      {showRoastResults && (
        <motion.div 
          className="min-h-screen py-8 px-4 sm:p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
        >
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-8"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              <motion.h1 
                className="font-merri text-4xl sm:text-5xl font-light text-black mb-2 tracking-tight"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                Your Roast
              </motion.h1>
              <motion.p 
                className="font-pop text-black/60 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.4 }}
              >
                Here&rsquo;s what we found lurking in your GitHub history
              </motion.p>
            </motion.div>

            {/* Navigation Bar */}
            <motion.div 
              className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4"
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <motion.div 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 text-black/70 hover:text-black transition-colors cursor-pointer group"
                whileHover={shouldReduceMotion ? undefined : { x: -2 }}
              >
                <svg 
                  className="w-4 h-4 transition-transform duration-250 group-hover:-translate-x-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-pop text-sm font-medium">Back to Home</span>
              </motion.div>

              <motion.div 
                onClick={handleShare}
                className="flex items-center space-x-2 text-black/70 hover:text-black transition-colors cursor-pointer group"
                whileHover={shouldReduceMotion ? undefined : { y: -1 }}
              >
                <div className="relative w-4 h-4">
                  <Share2 
                    className={`w-4 h-4 absolute top-0 left-0 transition-all duration-300 ${isShared ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
                  />
                  <Check 
                    className={`w-4 h-4 absolute top-0 left-0 transition-all duration-300 ${isShared ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
                  />
                </div>
                <span className="font-pop text-sm font-medium">
                  {isShared ? 'Copied!' : 'Share Roast'}
                </span>
              </motion.div>
            </motion.div>

            {/* User Profile Card */}
            <motion.div 
              className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.div 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center overflow-hidden"
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {userData?.avatar ? (
                    <img 
                      src={userData.avatar} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <motion.div 
                      className="w-full h-full bg-gray-200"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="font-merri text-2xl sm:text-3xl font-light text-black mb-2">
                    {userData?.username ? `u/${userData.username}` : (
                      <motion.div 
                        className="h-8 bg-gray-200 rounded w-32 mx-auto sm:mx-0"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </h2>

                  <div className="flex cursor-pointer flex-wrap justify-center sm:justify-start gap-2 mt-4">
                    {userData?.languages ? userData.languages.map((lang, index) => (
                      <motion.span 
                        key={index}
                        onClick={() => window.open(`https://github.com/topics/${userData?.languages[index].name.toLowerCase()}`, '_blank', 'noopener,noreferrer')} 
                        className="bg-black/5 text-black/70 hover:bg-black/6 transition-all duration-300 px-3 py-1 rounded-full text-sm font-pop cursor-pointer"
                        whileHover={shouldReduceMotion ? undefined : { scale: 1.05, y: -1 }}
                      >
                        {lang.name} ({lang.percentage}%)
                      </motion.span>
                    )) : (
                      Array.from({ length: 4 }).map((_, i) => (
                        <motion.div 
                          key={i} 
                          className="h-6 bg-gray-200 rounded-full w-20"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Main Roast Card */}
            <div className="mb-6">
              <RoastCard
                title="Roast"
                content={aiSummaries.detailedRoast}
                emoji="🔥"
                isLoading={!aiSummariesComplete.detailedRoast}
                index={3}
              />
            </div>

            {/* Analysis Cards Grid */}
            <div className="columns-1 lg:columns-2 gap-6 space-y-6">
              <div className="break-inside-avoid mb-6">
                <RoastCard
                  title="Strengths"
                  content={aiSummaries.strengthAnalysis}
                  emoji="💪"
                  isLoading={!aiSummariesComplete.strengthAnalysis}
                  index={4}
                />
              </div>

              <div className="break-inside-avoid mb-6">
                <RoastCard
                  title="Weaknesses"
                  content={aiSummaries.weaknessAnalysis}
                  emoji="🌙"
                  isLoading={!aiSummariesComplete.weaknessAnalysis}
                  index={5}
                />
              </div>

              <div className="break-inside-avoid mb-6">
                <RoastCard
                  title="Love Life"
                  content={aiSummaries.loveLifeAnalysis}
                  emoji="🦋"
                  isLoading={!aiSummariesComplete.loveLifeAnalysis}
                  index={6}
                />
              </div>

              <div className="break-inside-avoid mb-6">
                <RoastCard
                  title="Life Purpose"
                  content={aiSummaries.lifePurposeAnalysis}
                  emoji="🐺"
                  isLoading={!aiSummariesComplete.lifePurposeAnalysis}
                  index={7}
                />
              </div>
            </div>

          </div>
          <motion.div 
            className='opacity-[97.5%] mt-14'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceMotion ? 0 : 0.8, duration: 0.5 }}
          >
            <Footer />
          </motion.div>
        </motion.div>
      )}
      </>
      )}
    </div>
  );
}

