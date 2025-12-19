'use client';

import React, { useState } from 'react';
import { physicalQuestions } from '@/data/questions';
import { useQuiz } from '@/context/QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PhysicalQuiz() {
  const { setPhysicalAnswer, completePhysicalQuiz, selectedCategory } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const currentQuestion = physicalQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / physicalQuestions.length) * 100;

  const handleOptionSelect = (text: string, value: number | string) => {
    // In QuizContext, setPhysicalAnswer expects (id, value)
    setPhysicalAnswer(currentQuestion.id, String(value));
    setDirection(1);

    if (currentQuestionIndex < physicalQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    } else {
      // Show Searching State
      setIsSearching(true);
      setTimeout(() => {
        completePhysicalQuiz();
        router.push('/result');
      }, 1500); // 1.5s delay for "Searching" animation
    }
  };

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

  if (isSearching) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] shadow-xl border border-stone-50 p-12 text-center max-w-lg w-full"
        >
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Analyzing Compatibility...
          </h2>
          <p className="text-muted">
            Finding the perfect {selectedCategory} match for your lifestyle.
          </p>
        </motion.div>
      </div>
    );
  }

  // Icons/Emojis mapping helper (could be more robust, but hardcoded for now)
  const getIconForOption = (val: string | number) => {
    // Budget
    if (val === 'low') return '💰';
    if (val === 'medium') return '💰💰';
    if (val === 'high') return '💰💰💰';
    // Space
    if (val === 'apartment') return '🏢';
    if (val === 'house_small') return '🏡';
    if (val === 'house_large') return '🏰';
    // Time
    // Using strict equality check for values from questions.ts
    // Note: In questions.ts, time values are also 'low', 'medium', 'high'
    // This overlaps with budget, but contextually fine for emoji
    return '✨'; 
  };

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-4">
      {/* Header & Progress */}
      <div className="w-full max-w-2xl mb-8 flex flex-col gap-2">
         <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-foreground font-heading">One Last Step</h2>
            <p className="text-muted text-sm">Let's ensure your {selectedCategory} fits your daily life.</p>
         </div>
        
        <div className="flex justify-between text-sm font-bold text-muted px-1">
          <span>Lifestyle Check</span>
          <span>{currentQuestionIndex + 1} / {physicalQuestions.length}</span>
        </div>
        <div className="relative w-full h-3 bg-stone-200 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl border border-stone-50 p-8 md:p-12 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full"
          >
            <div className="mb-8 text-center">
              <span className="inline-block bg-secondary/10 text-secondary text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider mb-3">
                {currentQuestion.trait}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-snug font-heading">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  initial={{ backgroundColor: '#fafaf9', color: '#4A4A4A' }}
                  whileHover={{ 
                    backgroundColor: '#E6B89C', 
                    color: '#ffffff',
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeInOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(option.text, option.value)}
                  className="w-full p-6 text-lg font-bold rounded-2xl shadow-sm hover:shadow-md text-left flex items-center gap-4 group"
                >
                  <span className="text-2xl">{getIconForOption(option.value)}</span>
                  <span className="flex-grow">{option.text}</span>
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
