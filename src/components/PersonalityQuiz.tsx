'use client';

import React, { useState } from 'react';
import { Question } from '@/data/questions';
import { useQuiz } from '@/context/QuizContext';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';

interface PersonalityQuizProps {
  questions: Question[];
}

export default function PersonalityQuiz({ questions }: PersonalityQuizProps) {
  const { setPersonalityAnswer, completePersonalityQuiz } = useQuiz();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleOptionSelect = (text: string, value: number | string) => {
    // In QuizContext, setPersonalityAnswer expects (id, trait, value)
    // We assume 'value' in questions is the score (number)
    setPersonalityAnswer(currentQuestion.id, currentQuestion.trait, Number(value));
    setDirection(1);

    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    } else {
      completePersonalityQuiz();
      // Use client-side routing instead of conditional rendering if desired, 
      // but for now, ClientWrapper handles the view switching based on state.
      // However, per instructions, we can add router.push if we were using separate routes.
      // Since ClientWrapper is currently handling the flow on a single page (/match), 
      // the state update (completePersonalityQuiz) will trigger the view change automatically.
      // If we WANT separate routes, we should use router.push. 
      // Let's assume the user wants to keep the Single Page Application (SPA) feel within /match for now 
      // as configured in ClientWrapper.tsx.
      // But wait, the user instructions explicitly asked for router.push('/decision-tree').
      // This implies we should create these pages.
      router.push('/decision-tree');
    }
  };

  if (!questions || questions.length === 0) {
    return <div className="text-center p-8 text-muted font-medium">Loading questions...</div>;
  }

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

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-4">
      {/* Progress Indicator */}
      <div className="w-full max-w-2xl mb-8 flex flex-col gap-2">
        <div className="flex justify-between text-sm font-bold text-muted px-1">
          <span>Personality Assessment</span>
          <span>Question {currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <div className="relative w-full h-3 bg-stone-200 rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-primary"
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
              <span className="inline-block bg-primary/10 text-primary text-xs px-3 py-1 rounded-full uppercase font-bold tracking-wider mb-3">
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
                    backgroundColor: '#8DA399', 
                    color: '#ffffff',
                    scale: 1.02,
                    transition: { duration: 0.2, ease: "easeInOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleOptionSelect(option.text, option.value)}
                  className="w-full p-6 text-lg font-bold rounded-2xl shadow-sm hover:shadow-md text-left flex justify-between items-center group"
                >
                  <span>{option.text}</span>
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
