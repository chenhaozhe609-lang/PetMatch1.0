import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY).');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const dogs = [
  // 1. Apartment Friendly & Lazy
  {
    category: 'Dog',
    breed_name: 'Pug',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'medium',
    tags: ['apartment-friendly', 'lazy', 'affectionate', 'funny'],
    description: 'The comedian of the dog world. Pugs live to love and be loved, making them perfect companions for relaxed lifestyles.',
    image_url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'French Bulldog',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'high',
    tags: ['apartment-friendly', 'lazy', 'quiet', 'companion'],
    description: 'Adaptable, playful, and completely irresistible. Frenchies are excellent city dogs who love chilling on the couch.',
    image_url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'English Bulldog',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'high',
    tags: ['apartment-friendly', 'lazy', 'calm', 'gentle'],
    description: 'A dignified couch potato with a heart of gold. Bulldogs are wonderful, low-endurance companions for families.',
    image_url: 'https://images.unsplash.com/photo-1517423568366-697553f70333?auto=format&fit=crop&w=800'
  },
  
  // 2. Apartment Friendly but Active
  {
    category: 'Dog',
    breed_name: 'Corgi',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'high',
    tags: ['apartment-friendly', 'active', 'smart', 'herding'],
    description: 'Big dog personality in a small package. Corgis are smart, affectionate, and surprisingly active herders.',
    image_url: 'https://images.unsplash.com/photo-1612536053381-696179b53685?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Shiba Inu',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'high',
    tags: ['independent', 'clean', 'quiet', 'loyal'],
    description: 'Spirited and independent with a cat-like nature. Shibas are loyal to their family but reserved with strangers.',
    image_url: 'https://images.unsplash.com/photo-1563889958749-6a9b291e2b3a?auto=format&fit=crop&w=800'
  },

  // 3. House Required & Family Friendly
  {
    category: 'Dog',
    breed_name: 'Golden Retriever',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['family-friendly', 'friendly', 'good-with-kids', 'eager-to-please'],
    description: 'The ultimate family companion. They have hearts of gold and energy to match. Perfect for active households.',
    image_url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Labrador Retriever',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['family-friendly', 'active', 'water-lover', 'food-motivated'],
    description: 'Friendly, outgoing, and high-spirited companions who have more than enough affection to go around.',
    image_url: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=800'
  },

  // 4. House Required & Active/Smart
  {
    category: 'Dog',
    breed_name: 'Border Collie',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['smart', 'intense', 'herding', 'active'],
    description: 'A remarkably bright workaholic. Border Collies need a job to do and are perfect for very active owners.',
    image_url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'German Shepherd',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['guard-dog', 'smart', 'loyal', 'confident'],
    description: 'Confident, courageous, and smart. German Shepherds are loyal guardians who form deep bonds with their humans.',
    image_url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800'
  },

  // 5. Hypoallergenic (Low shedding)
  {
    category: 'Dog',
    breed_name: 'Poodle (Toy)',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'medium',
    tags: ['hypoallergenic', 'smart', 'elegant', 'family-friendly'],
    description: 'Wicked smart and proud. Beneath the curly coat is an elegant athlete and companion for all reasons and seasons.',
    image_url: 'https://images.unsplash.com/photo-1605248152567-402919d5336e?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Schnauzer (Mini)',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'medium',
    tags: ['hypoallergenic', 'terrier', 'alert', 'spirited'],
    description: 'A bright, friendly, and trainable companion, small enough for an apartment but tough enough for farm life.',
    image_url: 'https://images.unsplash.com/photo-1508208344652-32a82643a75a?auto=format&fit=crop&w=800'
  },

  // 6. Budget Friendly
  {
    category: 'Dog',
    breed_name: 'Mixed Breed / Rescue',
    min_space: 'medium',
    energy_level: 'medium',
    budget_tier: 'low',
    tags: ['unique', 'healthy', 'budget-friendly', 'grateful'],
    description: 'One of a kind! Mixed breeds often have fewer health issues and a lot of love to give. Adopt, don\'t shop!',
    image_url: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800'
  },

  // 7. Specific Personalities
  {
    category: 'Dog',
    breed_name: 'Siberian Husky',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['dramatic', 'vocal', 'energetic', 'pack-oriented'],
    description: 'Loyal, outgoing, and mischievous. Huskies are beautiful, vocal dogs that need plenty of exercise and interaction.',
    image_url: 'https://images.unsplash.com/photo-1563804803930-a23d120a101d?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Beagle',
    min_space: 'medium',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['scent-driven', 'vocal', 'merry', 'curious'],
    description: 'Curious, clever, and energetic hounds who require plenty of playtime. Their nose guides their life!',
    image_url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Chihuahua',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'low',
    tags: ['clingy', 'small', 'sassy', 'loyal'],
    description: 'A tiny dog with a huge personality. A charming and sassy companion who prefers to be with their person at all times.',
    image_url: 'https://images.unsplash.com/photo-1564850779774-8b63e52236a2?auto=format&fit=crop&w=800'
  },

  // Additional breeds to reach 20
  {
    category: 'Dog',
    breed_name: 'Boxer',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['playful', 'patient', 'active', 'family-friendly'],
    description: 'Fun-loving, bright, and active. Boxers are known for their patience with children and protective nature.',
    image_url: 'https://images.unsplash.com/photo-1543071220-6ee5bf718681?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Dachshund',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'medium',
    tags: ['stubborn', 'clever', 'courageous', 'devoted'],
    description: 'The famous wiener dog! Spunky, curious, and friendly, they make lively companions for small spaces.',
    image_url: 'https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Shih Tzu',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'medium',
    tags: ['affectionate', 'hypoallergenic', 'outgoing', 'lap-dog'],
    description: 'Affectionate, playful, and outgoing. Bred solely to be companions, they are happy house dogs who love people.',
    image_url: 'https://images.unsplash.com/photo-1560743173-567a3b5658b1?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Great Dane',
    min_space: 'large',
    energy_level: 'medium',
    budget_tier: 'high',
    tags: ['gentle-giant', 'friendly', 'patient', 'dependable'],
    description: 'The "Apollo of Dogs." Despite their imposing size, Great Danes are sweet, patient, and often surprisingly lazy.',
    image_url: 'https://images.unsplash.com/photo-1562306226-c4d36d4981d3?auto=format&fit=crop&w=800'
  },
  {
    category: 'Dog',
    breed_name: 'Australian Shepherd',
    min_space: 'large',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['smart', 'work-oriented', 'exuberant', 'agile'],
    description: 'Lean, tough, and ranch-ready. Aussies have an irresistible impulse to herd anything that moves and need high activity.',
    image_url: 'https://images.unsplash.com/photo-1590419690008-905815c4759a?auto=format&fit=crop&w=800'
  }
];

async function seedDogs() {
  console.log(`Starting seed for ${dogs.length} dog breeds...`);
  
  // Optional: Clean up existing dogs to avoid duplicates if running multiple times
  console.log('Cleaning up existing dogs...');
  await supabase.from('pet_breeds').delete().eq('category', 'Dog');

  // Insert data
  const { data, error } = await supabase
    .from('pet_breeds')
    .insert(dogs)
    .select();

  if (error) {
    console.error('Error inserting dogs:', error);
  } else {
    console.log(`Successfully inserted ${data.length} dogs!`);
  }
}

seedDogs().catch(console.error);
