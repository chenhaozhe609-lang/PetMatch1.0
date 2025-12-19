'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PhysicalConstraints } from '@/utils/matchingLogic';

interface QuizState {
  personalityScores: { [trait: string]: number }; // From Step 1
  selectedCategory: string | null;                // From Step 2 (Decision Tree)
  physicalConstraints: {                          // From Step 3
    space: 'tiny' | 'apartment' | 'house';
    budget: 'low' | 'medium' | 'high';
    time: 'low' | 'medium' | 'high';
  } | null;
}

interface QuizContextType extends QuizState {
  // Phase 1: Personality Quiz
  setPersonalityAnswer: (questionId: string, trait: string, value: number) => void;
  isPersonalityQuizCompleted: boolean;
  completePersonalityQuiz: () => void;

  // Phase 2: Decision Journey
  setSelectedCategory: (category: string) => void;
  
  // Phase 3: Physical Quiz
  setPhysicalAnswer: (questionId: string, value: string) => void;
  isPhysicalQuizCompleted: boolean;
  completePhysicalQuiz: () => void;
  
  // General
  resetSession: () => void;
  saveSessionToDb: () => Promise<void>;
  submitFeedback: (score: number) => Promise<void>;
  sessionId: string | null;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  // State
  const [personalityScores, setPersonalityScores] = useState<{ [trait: string]: number }>({});
  const [isPersonalityQuizCompleted, setIsPersonalityQuizCompleted] = useState(false);
  
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
  
  const [physicalAnswers, setPhysicalAnswers] = useState<Record<string, string>>({});
  const [isPhysicalQuizCompleted, setIsPhysicalQuizCompleted] = useState(false);
  
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Computed Physical Constraints
  const physicalConstraints = useMemo(() => {
    if (!physicalAnswers['q_space'] || !physicalAnswers['q_budget'] || !physicalAnswers['q_time']) {
      return null;
    }
    return {
      space: (physicalAnswers['q_space'] || 'apartment') as 'tiny' | 'apartment' | 'house',
      budget: (physicalAnswers['q_budget'] || 'medium') as 'low' | 'medium' | 'high',
      time: (physicalAnswers['q_time'] || 'medium') as 'low' | 'medium' | 'high',
    };
  }, [physicalAnswers]);

  // Actions
  const setPersonalityAnswer = (questionId: string, trait: string, value: number) => {
    setPersonalityScores((prev) => ({
      ...prev,
      [trait]: value, // Simplified: Just overwriting for now, could be average if multiple questions per trait
    }));
  };

  const completePersonalityQuiz = () => setIsPersonalityQuizCompleted(true);

  const setSelectedCategory = (category: string) => setSelectedCategoryState(category);

  const setPhysicalAnswer = (questionId: string, value: string) => {
    setPhysicalAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const completePhysicalQuiz = () => setIsPhysicalQuizCompleted(true);

  const resetSession = () => {
    setPersonalityScores({});
    setIsPersonalityQuizCompleted(false);
    setSelectedCategoryState(null);
    setPhysicalAnswers({});
    setIsPhysicalQuizCompleted(false);
    setSessionId(null);
  };

  // DB Logic (Ported from UserSessionContext)
  const saveSessionToDb = async () => {
    try {
      if (sessionId) return;

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          trait_answers: personalityScores,
          path_taken: selectedCategory ? [{ category: selectedCategory }] : [], // Simplified path
          recommended_pet: selectedCategory, 
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving session:', error);
      } else if (data) {
        setSessionId(data.id);
      }
    } catch (err) {
      console.error('Unexpected error saving session:', err);
    }
  };

  const submitFeedback = async (score: number) => {
    if (!sessionId) return;
    try {
      await supabase
        .from('user_sessions')
        .update({ user_feedback_score: score })
        .eq('id', sessionId);
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        personalityScores,
        selectedCategory,
        physicalConstraints,
        
        setPersonalityAnswer,
        isPersonalityQuizCompleted,
        completePersonalityQuiz,
        
        setSelectedCategory,
        
        setPhysicalAnswer,
        isPhysicalQuizCompleted,
        completePhysicalQuiz,
        
        resetSession,
        saveSessionToDb,
        submitFeedback,
        sessionId
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
