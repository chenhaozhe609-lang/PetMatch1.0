-- Seed data for traits_questions table

INSERT INTO traits_questions (question_text, category, options_json)
VALUES 
(
  'How would you describe your daily activity level?',
  'activity',
  '["Couch potato", "Moderate walker", "Active runner", "Athlete"]'::jsonb
),
(
  'How much time can you dedicate to grooming a pet?',
  'grooming',
  '["None / Very little", "Once a week", "Daily brushing", "Professional grooming required"]'::jsonb
),
(
  'What is your tolerance for mess in the house?',
  'cleanliness',
  '["Zero tolerance", "Occasional hair is fine", "I don''t mind a bit of mess", "Chaos is my middle name"]'::jsonb
),
(
  'How much space do you have at home?',
  'space',
  '["Small apartment", "Apartment with balcony", "House with small yard", "Large house with big yard"]'::jsonb
),
(
  'Do you have other pets or children?',
  'social',
  '["Just me", "Children only", "Other pets only", "Both children and pets"]'::jsonb
);
