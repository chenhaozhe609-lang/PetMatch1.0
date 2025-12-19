'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PhysicalConstraints } from '@/utils/matchingLogic';

interface FlowStep {
  nodeId: string;
  choice: string;
}

interface UserSessionContextType {
  // Phase 1: Personality Quiz
  personalityAnswers: Record<string, any>;
  setPersonalityAnswer: (questionId: string, answer: any) => void;
  isPersonalityQuizCompleted: boolean;
  completePersonalityQuiz: () => void;

  // Phase 2: Flowchart
  currentFlowId: string;
  flowHistory: FlowStep[];
  selectedCategory: string | null; // Result from Decision Tree (e.g. 'Dog')
  handleFlowChoice: (nextNodeId: string, choiceLabel: string) => void;
  setSelectedCategory: (category: string) => void;

  // Phase 3: Physical Quiz
  isPhysicalQuizCompleted: boolean;
  completePhysicalQuiz: () => void;
  physicalConstraints: PhysicalConstraints;
  
  // Phase 4: Final Result
  finalResult: string | null; // Specific Breed Name
  setFinalResult: (result: string) => void; // Used for breed matching
  
  // Phase 4: Persistence & Feedback
  sessionId: string | null;
  saveSessionToDb: () => Promise<void>;
  submitFeedback: (score: number) => Promise<void>;
  
  // General
  resetSession: () => void;
}

const UserSessionContext = createContext<UserSessionContextType | undefined>(undefined);

export const UserSessionProvider = ({ children }: { children: ReactNode }) => {
  // Phase 1 State
  const [personalityAnswers, setPersonalityAnswers] = useState<Record<string, any>>({});
  const [isPersonalityQuizCompleted, setIsPersonalityQuizCompleted] = useState(false);

  // Phase 2 State
  const [currentFlowId, setCurrentFlowId] = useState<string>('root');
  const [flowHistory, setFlowHistory] = useState<FlowStep[]>([]);
  const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);

  // Phase 3 State
  const [isPhysicalQuizCompleted, setIsPhysicalQuizCompleted] = useState(false);

  // Computed: Extract Physical Constraints from answers
  const physicalConstraints: PhysicalConstraints = useMemo(() => {
    return {
      space: (personalityAnswers['q_space']?.value || 'apartment') as any,
      budget: (personalityAnswers['q_budget']?.value || 'medium') as any,
      time: (personalityAnswers['q_time']?.value || 'medium') as any,
    };
  }, [personalityAnswers]);

  // Phase 4 State
  const [finalResult, setFinalResultState] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Phase 1 Logic
  const setPersonalityAnswer = (questionId: string, answer: any) => {
    setPersonalityAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const completePersonalityQuiz = () => {
    setIsPersonalityQuizCompleted(true);
  };

  // Phase 2 Logic
  const handleFlowChoice = (nextNodeId: string, choiceLabel: string) => {
    // Record history
    setFlowHistory((prev) => [
      ...prev,
      { nodeId: currentFlowId, choice: choiceLabel }
    ]);
    
    // Move to next node
    setCurrentFlowId(nextNodeId);
  };

  const setSelectedCategory = (category: string) => {
    setSelectedCategoryState(category);
  };

  // Phase 3 Logic
  const completePhysicalQuiz = () => {
    setIsPhysicalQuizCompleted(true);
  };

  // Phase 4 Logic
  const setFinalResult = (result: string) => {
    setFinalResultState(result);
  };

  // Phase 4 Logic: Save Data
  const saveSessionToDb = async () => {
    try {
      if (sessionId) return; // Already saved

      const { data, error } = await supabase
        .from('user_sessions')
        .insert({
          trait_answers: personalityAnswers,
          path_taken: flowHistory,
          recommended_pet: selectedCategory, // Saving category as base recommendation context
          // user_feedback_score is null initially
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error saving session:', error);
      } else if (data) {
        console.log('Session saved with ID:', data.id);
        setSessionId(data.id);
      }
    } catch (err) {
      console.error('Unexpected error saving session:', err);
    }
  };

  // Phase 4 Logic: Feedback
  const submitFeedback = async (score: number) => {
    if (!sessionId) {
      console.warn('Cannot submit feedback: No session ID found.');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ user_feedback_score: score })
        .eq('id', sessionId);

      if (error) {
        console.error('Error submitting feedback:', error);
      } else {
        console.log('Feedback submitted successfully:', score);
      }
    } catch (err) {
      console.error('Unexpected error submitting feedback:', err);
    }
  };

  const resetSession = () => {
    setPersonalityAnswers({});
    setIsPersonalityQuizCompleted(false);
    setCurrentFlowId('root');
    setFlowHistory([]);
    setSelectedCategoryState(null);
    setIsPhysicalQuizCompleted(false);
    setFinalResultState(null);
    setSessionId(null);
  };

  return (
    <UserSessionContext.Provider
      value={{
        personalityAnswers,
        setPersonalityAnswer,
        isPersonalityQuizCompleted,
        completePersonalityQuiz,
        
        currentFlowId,
        flowHistory,
        selectedCategory,
        handleFlowChoice,
        setSelectedCategory,
        
        isPhysicalQuizCompleted,
        completePhysicalQuiz,
        physicalConstraints,
        
        finalResult,
        setFinalResult,
        
        sessionId,
        saveSessionToDb,
        submitFeedback,
        resetSession,
      }}
    >
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSession = () => {
  const context = useContext(UserSessionContext);
  if (context === undefined) {
    throw new Error('useUserSession must be used within a UserSessionProvider');
  }
  return context;
};
