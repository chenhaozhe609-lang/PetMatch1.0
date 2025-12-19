-- Create user_journeys table
CREATE TABLE IF NOT EXISTS user_journeys (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  personality_scores jsonb,
  constraints jsonb,
  decision_path text,
  recommended_result jsonb
);
