import { ReactNode } from "react";

export interface TraitQuestion {
  id: number;
  question_text: string;
  category: string;
  options_json: string[] | Record<string, any>;
}

export interface DecisionNodeOption {
  label: string;
  next_node_id: string;
}

export interface DecisionNode {
  id: string; // Changed to string
  text: string;
  type: 'question' | 'result';
  options: DecisionNodeOption[] | null; // Changed to match JSONB structure
  final_result_pet_name: string | null;
}

export interface UserSession {
  id: string;
  created_at: string;
  trait_answers: Record<string, any> | null;
  path_taken: any[] | null;
  recommended_pet: string | null;
  user_feedback_score: number | null;
}

export interface PetBreed {
  description: ReactNode;
  id: string;
  category: string;
  breed_name: string;
  min_space: 'tiny' | 'apartment' | 'house';
  energy: 'low' | 'medium' | 'high';
  budget_tier: 'low' | 'medium' | 'high';
  time_commitment: 'low' | 'medium' | 'high';
  image_url: string | null;
  // New SEO Columns
  trainability?: 'low' | 'medium' | 'high';
  family_friendly?: boolean;
  shedding?: 'none' | 'low' | 'medium' | 'high';
  
  is_compromise?: boolean; // Client-side flag
}

export interface Database {
  public: {
    Tables: {
      pet_breeds: {
        Row: PetBreed;
        Insert: Omit<PetBreed, 'id' | 'is_compromise'>;
        Update: Partial<Omit<PetBreed, 'id' | 'is_compromise'>>;
      };
      traits_questions: {
        Row: TraitQuestion;
        Insert: Omit<TraitQuestion, 'id'>;
        Update: Partial<Omit<TraitQuestion, 'id'>>;
      };
      decision_nodes: {
        Row: DecisionNode;
        Insert: Omit<DecisionNode, 'id'>; // ID is usually manual for nodes now
        Update: Partial<Omit<DecisionNode, 'id'>>;
      };
      user_sessions: {
        Row: UserSession;
        Insert: Omit<UserSession, 'id' | 'created_at'>;
        Update: Partial<Omit<UserSession, 'id' | 'created_at'>>;
      };
    };
  };
}
