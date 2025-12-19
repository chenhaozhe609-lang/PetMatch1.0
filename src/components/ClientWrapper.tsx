'use client';

import React from 'react';
import PersonalityQuiz from './PersonalityQuiz';
import DecisionJourney from './DecisionJourney';
import PhysicalQuiz from './PhysicalQuiz';
import ResultCard from './ResultCard';
import { useQuiz } from '@/context/QuizContext';
import { Question } from '@/data/questions';

interface ClientWrapperProps {
  questions: Question[];
}

export default function ClientWrapper({ questions }: ClientWrapperProps) {
  const { isPersonalityQuizCompleted, selectedCategory, isPhysicalQuizCompleted } = useQuiz();

  // Phase 4: Final Result
  if (isPhysicalQuizCompleted) {
    return <ResultCard />;
  }

  // Phase 3: Physical Quiz (Only if Category is selected)
  if (selectedCategory) {
    return <PhysicalQuiz />;
  }

  // Phase 2: Decision Journey (After Personality Quiz)
  if (isPersonalityQuizCompleted) {
    return <DecisionJourney />;
  }

  // Phase 1: Personality Quiz
  return <PersonalityQuiz questions={questions} />;
}
