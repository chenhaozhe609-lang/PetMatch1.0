-- Full Decision Tree Logic Seed Script (English)
-- Based on the complex flowchart provided
-- Warning: This clears and rebuilds the decision_nodes table.

TRUNCATE TABLE decision_nodes CASCADE;

-- 1. ROOT NODE
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

-- 2. BRANCH A: DOG (Immediate Result)
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_dog', 'A True Companion!', 'result', 'Dog');

-- 3. BRANCH B: HAIR TOLERANCE
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_hair', 
  'Do you mind dealing with shedding/hair?', 
  'question',
  '[
    {"label": "I don''t mind (The fluffier the better)", "next_node_id": "q_smell"}, 
    {"label": "Yes, I mind (Very much)", "next_node_id": "q_legs"}
  ]'::jsonb
);

-- ---------------------------------------------------------
-- SUB-BRANCH B1: DON'T MIND HAIR (The Fluffy Route)
-- ---------------------------------------------------------

-- 3.1 Smell Tolerance
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_smell', 
  'What is your tolerance for smells?', 
  'question',
  '[
    {"label": "High Tolerance", "next_node_id": "result_ferret"}, 
    {"label": "Can''t stand it", "next_node_id": "q_bite_scratch"},
    {"label": "A little is cool", "next_node_id": "result_snake"} 
  ]'::jsonb
  -- Note: The snake link is technically from "Cool" in the image, but putting it here for logic flow or separate it later.
  -- Correction based on image: The "Snake" path comes from "0 Legs" -> "Cool". 
  -- In "Don't Mind Hair" path, it goes: Smell -> High (Ferret) OR Low (Bite/Scratch).
);

-- Result: Ferret
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_ferret', 'Fun and Slinky', 'result', 'Ferret');

-- 3.2 Bite vs Scratch
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_bite_scratch', 
  'Being scratched or bitten: Which would you prefer?', 
  'question',
  '[
    {"label": "Neither / I''m not afraid", "next_node_id": "result_cat"}, 
    {"label": "Bitten?", "next_node_id": "result_rabbit"}
  ]'::jsonb
);

-- Results: Cat & Rabbit
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_cat', 'The Aloof Master', 'result', 'Cat'),
('result_rabbit', 'Hoppy Friend', 'result', 'Rabbit');


-- ---------------------------------------------------------
-- SUB-BRANCH B2: MIND HAIR (The Clean/Scaly Route)
-- ---------------------------------------------------------

-- 4. Leg Count
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_legs', 
  'How many legs do you prefer?', 
  'question',
  '[
    {"label": "0 Legs", "next_node_id": "q_dead_mice"}, 
    {"label": "2 Legs", "next_node_id": "result_bird"},
    {"label": "4 Legs", "next_node_id": "q_warm_cold"},
    {"label": "8 Legs (More is better)", "next_node_id": "result_spider"}
  ]'::jsonb
);

-- Results: Bird & Spider
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_bird', 'Sky Sprite', 'result', 'Bird'),
('result_spider', 'Eight-Legged Friend', 'result', 'Spider');

-- 4.1 Zero Legs Logic
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_dead_mice', 
  'Do you mind buying dead mice every month?', 
  'question',
  '[
    {"label": "Yes, I mind", "next_node_id": "result_goldfish"}, 
    {"label": "No / It''s kinda cool", "next_node_id": "result_snake"}
  ]'::jsonb
);

-- Results: Goldfish & Snake
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_goldfish', 'Simple & Quiet', 'result', 'Goldfish'),
('result_snake', 'Sssssslithery Friend', 'result', 'Snake');

-- 4.2 Four Legs Logic
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_warm_cold', 
  'Do you prefer warm-blooded or cold-blooded?', 
  'question',
  '[
    {"label": "Cold as Ice (Cold-blooded)", "next_node_id": "q_patience"}, 
    {"label": "Warm & Cuddly (Warm-blooded)", "next_node_id": "q_tail"}
  ]'::jsonb
);

-- 4.2.1 Cold Blooded Path
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_patience', 
  'Are you in a rush to get a pet?', 
  'question',
  '[
    {"label": "No rush", "next_node_id": "result_turtle"}, 
    {"label": "Yes, urgent!", "next_node_id": "result_lizard"}
  ]'::jsonb
);

-- Results: Turtle & Lizard
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_turtle', 'Slow & Steady', 'result', 'Turtle'),
('result_lizard', 'Mini Dinosaur', 'result', 'Lizard');

-- 4.2.2 Warm Blooded Path
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_tail', 
  'What is your tail preference?', 
  'question',
  '[
    {"label": "No Tail", "next_node_id": "q_spikes"}, 
    {"label": "Long Tail (Furry)", "next_node_id": "result_gerbil"},
    {"label": "Super Long Cool Tail", "next_node_id": "result_rat"}
  ]'::jsonb
);

-- Results: Gerbil & Rat
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_gerbil', 'Desert Runner', 'result', 'Gerbil'),
('result_rat', 'Smartest Rodent', 'result', 'Rat');

-- 4.2.2.1 No Tail Logic
INSERT INTO decision_nodes (id, text, type, options) VALUES 
(
  'q_spikes', 
  'Want some spikes with that?', 
  'question',
  '[
    {"label": "Sure!", "next_node_id": "result_hedgehog"}, 
    {"label": "No way", "next_node_id": "result_hamster"}
  ]'::jsonb
);

-- Results: Hedgehog & Hamster
INSERT INTO decision_nodes (id, text, type, final_result_pet_name) VALUES 
('result_hedgehog', 'Spiky Ball', 'result', 'Hedgehog'),
('result_hamster', 'Pocket Fluff', 'result', 'Hamster');
