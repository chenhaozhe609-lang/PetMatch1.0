-- Create pet_breeds table
CREATE TABLE IF NOT EXISTS pet_breeds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL, -- 'Dog', 'Cat', 'Bird', 'Reptile', 'Small Pet'
  breed_name TEXT NOT NULL,
  min_space TEXT NOT NULL CHECK (min_space IN ('tiny', 'apartment', 'house')),
  energy TEXT NOT NULL CHECK (energy IN ('low', 'medium', 'high')),
  budget_tier TEXT NOT NULL CHECK (budget_tier IN ('low', 'medium', 'high')),
  time_commitment TEXT NOT NULL CHECK (time_commitment IN ('low', 'medium', 'high')),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pet_breeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public breeds are viewable by everyone" ON pet_breeds FOR SELECT USING (true);

-- Seed Data
INSERT INTO pet_breeds (category, breed_name, min_space, energy, budget_tier, time_commitment, image_url)
VALUES
  -- DOGS
  ('Dog', 'Pug', 'apartment', 'low', 'medium', 'medium', 'https://placeholder.com/pug.jpg'),
  ('Dog', 'French Bulldog', 'apartment', 'low', 'high', 'medium', 'https://placeholder.com/frenchie.jpg'),
  ('Dog', 'Golden Retriever', 'house', 'high', 'medium', 'high', 'https://placeholder.com/golden.jpg'),
  ('Dog', 'Border Collie', 'house', 'high', 'medium', 'high', 'https://placeholder.com/collie.jpg'),
  ('Dog', 'Greyhound', 'apartment', 'medium', 'medium', 'medium', 'https://placeholder.com/greyhound.jpg'),
  ('Dog', 'Chihuahua', 'tiny', 'medium', 'low', 'medium', 'https://placeholder.com/chihuahua.jpg'),
  ('Dog', 'Mixed Breed (Shelter)', 'apartment', 'medium', 'low', 'medium', 'https://placeholder.com/mutt.jpg'),
  
  -- CATS
  ('Cat', 'Domestic Shorthair', 'apartment', 'medium', 'low', 'low', 'https://placeholder.com/shorthair.jpg'),
  ('Cat', 'British Shorthair', 'apartment', 'low', 'medium', 'low', 'https://placeholder.com/british.jpg'),
  ('Cat', 'Maine Coon', 'house', 'medium', 'high', 'medium', 'https://placeholder.com/mainecoon.jpg'),
  ('Cat', 'Sphynx', 'apartment', 'high', 'high', 'high', 'https://placeholder.com/sphynx.jpg'),
  ('Cat', 'Ragdoll', 'apartment', 'low', 'medium', 'medium', 'https://placeholder.com/ragdoll.jpg'),
  
  -- REPTILES
  ('Reptile', 'Leopard Gecko', 'tiny', 'low', 'low', 'low', 'https://placeholder.com/leo.jpg'),
  ('Reptile', 'Bearded Dragon', 'apartment', 'medium', 'medium', 'medium', 'https://placeholder.com/beardie.jpg'),
  ('Reptile', 'Ball Python', 'apartment', 'low', 'medium', 'low', 'https://placeholder.com/ballpython.jpg'),
  ('Reptile', 'Corn Snake', 'apartment', 'low', 'low', 'low', 'https://placeholder.com/cornsnake.jpg'),
  
  -- SMALL PETS
  ('Small Pet', 'Hamster', 'tiny', 'high', 'low', 'low', 'https://placeholder.com/hamster.jpg'),
  ('Small Pet', 'Guinea Pig', 'apartment', 'medium', 'medium', 'medium', 'https://placeholder.com/guinea.jpg'),
  ('Small Pet', 'Rabbit', 'apartment', 'medium', 'medium', 'high', 'https://placeholder.com/rabbit.jpg'),
  
  -- BIRDS
  ('Bird', 'Budgie (Parakeet)', 'apartment', 'high', 'low', 'medium', 'https://placeholder.com/budgie.jpg'),
  ('Bird', 'Cockatiel', 'apartment', 'medium', 'medium', 'medium', 'https://placeholder.com/cockatiel.jpg');
