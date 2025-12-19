'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { decisionTree } from '@/data/decisionLogic';
import { useQuiz } from '@/context/QuizContext';
import { PawPrint, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DecisionJourney() {
  const { setSelectedCategory, resetSession } = useQuiz();
  const [currentNodeId, setCurrentNodeId] = useState('root');
  const [history, setHistory] = useState<string[]>([]);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for back
  const [matchedOutcome, setMatchedOutcome] = useState<string | null>(null);
  const router = useRouter();

  const currentNode = decisionTree[currentNodeId];

  // Animation Variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  const handleOptionClick = (nextId?: string, outcome?: string) => {
    setDirection(1);
    
    if (outcome) {
      // Leaf Node Reached
      setMatchedOutcome(outcome);
    } else if (nextId) {
      // Navigate to next node
      setHistory((prev) => [...prev, currentNodeId]);
      setCurrentNodeId(nextId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      setDirection(-1);
      const prevId = history[history.length - 1];
      setHistory((prev) => prev.slice(0, -1));
      setCurrentNodeId(prevId);
      setMatchedOutcome(null); // Clear outcome if going back
    }
  };

  const handleContinue = () => {
    if (matchedOutcome) {
      setSelectedCategory(matchedOutcome);
      router.push('/physical-filter');
    }
  };

  // ------------------------------------------------------------------
  // RENDER: Celebration Card (End State)
  // ------------------------------------------------------------------
  if (matchedOutcome) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="w-full max-w-xl bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden text-center p-10 relative"
        >
          {/* Decorative Background */}
          <div className="absolute top-0 left-0 w-full h-32 bg-secondary/10 -z-10 rounded-b-[50%]"></div>
          
          <div className="bg-white inline-flex p-6 rounded-full shadow-sm mb-6 relative">
            <Sparkles className="absolute -top-2 -right-2 text-yellow-400 animate-pulse" size={24} />
            <span className="text-6xl">🎉</span>
          </div>

          <h2 className="text-4xl font-extrabold text-foreground mb-4 font-heading">
            It's a Match!
          </h2>
          <p className="text-xl text-muted mb-8 font-light">
            Based on your choices, your soulmate is a...
          </p>

          <div className="text-5xl md:text-6xl font-black text-primary mb-10 tracking-tight">
            {matchedOutcome}
          </div>

          <div className="flex flex-col gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinue}
              className="w-full py-5 bg-secondary text-white text-xl font-bold rounded-2xl shadow-lg hover:shadow-xl hover:bg-[#D9A588] transition-all flex items-center justify-center gap-2"
            >
              Customize My {matchedOutcome} <ArrowRight size={20} />
            </motion.button>

            <button
              onClick={handleBack}
              className="text-muted hover:text-foreground font-medium text-sm py-2 transition-colors flex items-center justify-center gap-1"
            >
              <RotateCcw size={14} /> Change my answers
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // RENDER: Question Card (Journey State)
  // ------------------------------------------------------------------
  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-4">
      {/* Progress Indicator (Decorative Paw) */}
      <div className="w-full max-w-xl mb-8 flex justify-center">
        <div className="relative w-24 h-2 bg-stone-200 rounded-full overflow-hidden">
           <motion.div 
             className="absolute top-0 left-0 h-full bg-primary"
             initial={{ width: '10%' }}
             animate={{ width: `${((history.length + 1) / 3) * 100}%` }} // Rough progress estimation
             transition={{ duration: 0.5 }}
           />
        </div>
        <motion.div 
           className="ml-2 text-primary"
           animate={{ rotate: [0, 10, -10, 0] }}
           transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
        >
          <PawPrint size={20} fill="currentColor" />
        </motion.div>
      </div>

      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-xl border border-stone-50 p-8 md:p-12 relative overflow-hidden">
        {/* Back Button */}
        {history.length > 0 && (
          <button 
            onClick={handleBack}
            className="absolute top-8 left-8 text-stone-400 hover:text-stone-600 transition-colors"
          >
            ← Back
          </button>
        )}

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentNodeId}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-10 text-center font-heading leading-snug">
              {currentNode.question}
            </h2>

            <div className="space-y-4">
              {currentNode.options.map((option: { nextId: string | undefined; outcome: string | undefined; label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; }, idx: React.Key | null | undefined) => (
                <motion.button
                  key={idx}
                  initial={{ backgroundColor: '#fafaf9', color: '#4A4A4A' }}
                  whileHover={{ 
                    backgroundColor: '#8DA399', 
                    color: '#ffffff',
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeInOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionClick(option.nextId, option.outcome)}
                  className="w-full p-6 text-lg font-bold rounded-2xl shadow-sm hover:shadow-md text-left flex justify-between items-center group"
                >
                  <span>{option.label}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
