-- Add new columns for SEO filters
ALTER TABLE pet_breeds 
ADD COLUMN IF NOT EXISTS trainability TEXT CHECK (trainability IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS family_friendly BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS shedding TEXT CHECK (shedding IN ('none', 'low', 'medium', 'high'));

-- Update Dogs
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Pug';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'medium' WHERE breed_name = 'French Bulldog';
UPDATE pet_breeds SET trainability = 'high', family_friendly = true, shedding = 'high' WHERE breed_name = 'Golden Retriever';
UPDATE pet_breeds SET trainability = 'high', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Border Collie';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'low' WHERE breed_name = 'Greyhound';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = false, shedding = 'medium' WHERE breed_name = 'Chihuahua';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Mixed Breed (Shelter)';

-- Update Cats
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Domestic Shorthair';
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'medium' WHERE breed_name = 'British Shorthair';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'high' WHERE breed_name = 'Maine Coon';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = false, shedding = 'none' WHERE breed_name = 'Sphynx';
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Ragdoll';

-- Update Reptiles (Trainability low, Shedding none/low contextually)
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'none' WHERE breed_name = 'Leopard Gecko';
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'none' WHERE breed_name = 'Bearded Dragon';
UPDATE pet_breeds SET trainability = 'low', family_friendly = false, shedding = 'none' WHERE breed_name = 'Ball Python';
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'none' WHERE breed_name = 'Corn Snake';

-- Update Small Pets
UPDATE pet_breeds SET trainability = 'low', family_friendly = true, shedding = 'low' WHERE breed_name = 'Hamster';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Guinea Pig';
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Rabbit';

-- Update Birds
UPDATE pet_breeds SET trainability = 'medium', family_friendly = true, shedding = 'low' WHERE breed_name = 'Budgie (Parakeet)';
UPDATE pet_breeds SET trainability = 'high', family_friendly = true, shedding = 'medium' WHERE breed_name = 'Cockatiel';
