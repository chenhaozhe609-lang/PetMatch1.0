-- Re-create decision_nodes table with TEXT ID and JSONB Options
-- Drop existing table to handle schema change cleanly
DROP TABLE IF EXISTS decision_nodes CASCADE;

CREATE TABLE decision_nodes (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('question', 'result')),
  options JSONB, -- Stores array of {label, next_node_id}
  final_result_pet_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE decision_nodes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public nodes are viewable by everyone" ON decision_nodes
  FOR SELECT USING (true);

-- Insert Root Node
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'root', 
  'Are you looking for a true companion, or just something to care for?', 
  'question',
  '[
    {"label": "A True Companion", "next_node_id": "result_dog"}, 
    {"label": "Just a Pet", "next_node_id": "q_hair"}
  ]'::jsonb
);

-- Insert Branch 1 (Dog - Result)
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_dog', 'A True Companion!', 'result', 'Dog');

-- Insert Branch 2 Questions
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_hair', 
  'Do you mind dealing with shedding/hair?', 
  'question',
  '[
    {"label": "Yes, I mind", "next_node_id": "q_legs"}, 
    {"label": "No, I love fluff", "next_node_id": "q_smell"}
  ]'::jsonb
),
(
  'q_legs', 
  'How many legs do you prefer?', 
  'question',
  '[
    {"label": "2 Legs", "next_node_id": "result_bird"}, 
    {"label": "8 Legs (The more the better)", "next_node_id": "result_spider"}
  ]'::jsonb
),
(
  'q_smell', 
  'What is your tolerance for smells?', 
  'question',
  '[
     {"label": "Some smell is okay", "next_node_id": "result_cat"},
     {"label": "Zero tolerance", "next_node_id": "result_bird"}
  ]'::jsonb
);

-- Insert Result Nodes
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_bird', 'Sky Sprite', 'result', 'Bird'),
('result_spider', 'More legs are better', 'result', 'Spider'),
('result_cat', 'The Aloof Master', 'result', 'Cat');
