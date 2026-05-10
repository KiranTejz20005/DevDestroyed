import React, { useState } from "react";

export default function FAQ() {
    const [openFaqIndex, setOpenFaqIndex] = useState(null);

    const faqItems = [
        { 
          q: "How does this magic work?", 
          a: "Our AI (which has better naming conventions than you) scrapes your public GitHub data. It analyzes your repos, commit messages, and tech stacks to build a psychological profile of your developer self-esteem." 
        },
        { 
          q: "Is my data safe with you?", 
          a: "100%. We don't want your code. We've seen your variable names; we're good. We process the data to generate the roast and then it's gone faster than your motivation after a failed deployment." 
        },
        { 
          q: "Will this help me get a job?", 
          a: "Probably the opposite. If a recruiter sees your roast, they'll start wondering why you have 40 forked repos you've never touched. It's best kept as a secret between you and your insecurities." 
        },
        { 
          q: "Is this tool really free?", 
          a: "It costs $0 USD, but the emotional cost is immeasurable. Your ego might need a few weeks of 'Hello World' projects to recover." 
        },
        { 
          q: "How do I get a better roast?", 
          a: "Stop pushing 'Fixed typo' 50 times in a row. Try contributing to real projects instead of just updating your README. The AI respects quality, and right now, it's starving." 
        },
        { 
          q: "Can I roast private accounts?", 
          a: "Nope. We can't roast ghosts. If your profile is private, you're hiding from the truth. We need public repos to fuel the roast engine, so open up if you want the smoke." 
        },
        { 
          q: "Why is it so mean?", 
          a: "It's called tough love, babe. The AI is trained to be satirical toward your coding habits. If it hits too close to home, it's probably because it's true. Touch grass." 
        },
        { 
          q: "Can I roast my boss?", 
          a: "If you're looking for an efficient way to get promoted to 'Full-time Job Seeker', then absolutely. Just type their username and watch the bridges burn." 
        },
        { 
          q: "Is the AI always this savage?", 
          a: "Actually, it's holding back. If it revealed everything it found in your 2017 'Todo List' app, you'd probably delete your GitHub account entirely." 
        }
    ];

    return (
        <div className="mt-32 mb-32 max-w-4xl mx-auto px-6">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200 mb-6">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-widest font-space">FAQ</span>
                </div>
                <h2 className="font-space text-4xl font-bold text-gray-900 mb-4 tracking-tight">The Damage Control Desk</h2>
                <p className="font-outfit text-lg text-gray-500 max-w-2xl mx-auto">Questions from those still in the first stage of grief: Denial.</p>
            </div>
            
            <div className="space-y-4">
                {faqItems.map((item, i) => (
                    <div 
                        key={i} 
                        className={`group border rounded-3xl transition-all duration-300 ${
                            openFaqIndex === i 
                            ? 'bg-white border-gray-900 shadow-xl ring-1 ring-gray-900' 
                            : 'bg-white border-gray-100 hover:border-gray-300 shadow-sm'
                        }`}
                    >
                        <button
                            onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                            className="w-full flex items-center justify-between px-8 py-6 text-left focus:outline-none"
                        >
                            <span className={`font-space font-bold transition-colors duration-300 ${openFaqIndex === i ? 'text-gray-900' : 'text-gray-600'} text-xl`}>
                                {item.q}
                            </span>
                            <span className={`flex-shrink-0 ml-4 flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-500 ${
                                openFaqIndex === i 
                                ? 'bg-gray-900 border-gray-900 text-white rotate-[135deg]' 
                                : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600'
                            }`}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </button>
                        
                        <div 
                            className={`grid transition-all duration-500 ease-in-out ${
                                openFaqIndex === i ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0'
                            }`}
                        >
                            <div className="overflow-hidden">
                                <div className="px-8 pb-8 pt-0">
                                    <div className="h-px bg-gray-100 mb-6"></div>
                                    <p className="text-gray-500 font-outfit leading-relaxed text-lg max-w-3xl">
                                        {item.a}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
