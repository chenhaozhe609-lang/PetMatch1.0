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

const cats = [
  // 1. The "Dog-like" Cats (Clingy)
  {
    category: 'Cat',
    breed_name: 'Ragdoll',
    min_space: 'medium', // Big cat
    energy_level: 'low', // Laid back but clingy
    budget_tier: 'high',
    tags: ['clingy', 'high-grooming', 'floppy', 'gentle'],
    description: 'A large, floppy, affectionate cat that goes limp when held. They follow you everywhere like a puppy.',
    image_url: 'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Maine Coon',
    min_space: 'medium', // Huge cat
    energy_level: 'medium',
    budget_tier: 'high',
    tags: ['clingy', 'high-grooming', 'gentle-giant', 'vocal'],
    description: 'The gentle giant of the cat world. Friendly, intelligent, and known for their chirping vocalizations.',
    image_url: 'https://images.unsplash.com/photo-1582062162529-6599043af8ed?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Siamese',
    min_space: 'small',
    energy_level: 'high',
    budget_tier: 'medium',
    tags: ['clingy', 'vocal', 'smart', 'social'],
    description: 'Incredibly vocal and social. Siamese cats demand to be part of your every activity and will tell you about it.',
    image_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800'
  },

  // 2. The Independent/Chill Cats (Busy owner friendly)
  {
    category: 'Cat',
    breed_name: 'British Shorthair',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'medium',
    tags: ['independent', 'low-grooming', 'calm', 'quiet'],
    description: 'The teddy bear of cats. Dignified, calm, and affectionate without being demanding.',
    image_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Scottish Fold',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'high',
    tags: ['independent', 'quiet', 'sweet', 'owl-like'],
    description: 'Famous for their folded ears and owl-like appearance. Sweet-tempered and easygoing companions.',
    image_url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Russian Blue',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'high',
    tags: ['independent', 'hypoallergenic', 'shy', 'loyal'],
    description: 'A quiet, gentle, and intelligent cat. They are often shy with strangers but deeply loyal to their chosen human.',
    image_url: 'https://images.unsplash.com/photo-1511044568932-338cba0fb803?auto=format&fit=crop&w=800'
  },

  // 3. The Chaos Makers (High Energy)
  {
    category: 'Cat',
    breed_name: 'Bengal',
    min_space: 'medium', // Needs space to run
    energy_level: 'high',
    budget_tier: 'high',
    tags: ['active', 'wild', 'smart', 'vocal'],
    description: 'A wild-looking cat with high energy and intelligence. They need lots of play and stimulation.',
    image_url: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Abyssinian',
    min_space: 'small',
    energy_level: 'high',
    budget_tier: 'high',
    tags: ['active', 'curious', 'climber', 'social'],
    description: 'Busy, active, and playful. Abyssinians love to climb and explore every inch of their home.',
    image_url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Siberian',
    min_space: 'medium',
    energy_level: 'high',
    budget_tier: 'high',
    tags: ['active', 'hypoallergenic', 'fluffy', 'agile'],
    description: 'A powerful, agile jumper with a triple coat. Surprisingly hypoallergenic despite the fluff!',
    image_url: 'https://images.unsplash.com/photo-1616164283842-8c11456c6076?auto=format&fit=crop&w=800'
  },

  // 4. Special Needs
  {
    category: 'Cat',
    breed_name: 'Sphynx',
    min_space: 'small',
    energy_level: 'high',
    budget_tier: 'high',
    tags: ['hypoallergenic', 'clingy', 'warm', 'hairless'],
    description: 'Hairless, wrinkled, and incredibly affectionate. They are like little hot water bottles that purr.',
    image_url: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Persian',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'medium',
    tags: ['high-grooming', 'lazy', 'quiet', 'fluffy'],
    description: 'The glamour puss of the cat world. Sweet, gentle, and lazy, but requires daily grooming.',
    image_url: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Himalayan',
    min_space: 'small',
    energy_level: 'low',
    budget_tier: 'medium',
    tags: ['high-grooming', 'calm', 'sweet', 'point-color'],
    description: 'A cross between Persian and Siamese. The look of a Persian with the color points of a Siamese.',
    image_url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=800'
  },

  // 5. Budget Friendly / Common
  {
    category: 'Cat',
    breed_name: 'Domestic Shorthair (Rescue)',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'low',
    tags: ['low-grooming', 'hardy', 'unique', 'grateful'],
    description: 'The "Moggy" or mixed breed cat. They come in all colors and personalities and are generally healthy and hardy.',
    image_url: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'Domestic Longhair (Rescue)',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'low',
    tags: ['fluffy', 'unique', 'beautiful', 'grateful'],
    description: 'A mixed breed with a long, beautiful coat. Each one is unique!',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800'
  },
  {
    category: 'Cat',
    breed_name: 'American Shorthair',
    min_space: 'small',
    energy_level: 'medium',
    budget_tier: 'medium',
    tags: ['easy-going', 'low-grooming', 'friendly', 'classic'],
    description: 'The all-American working cat. Easy-going, friendly, and low maintenance.',
    image_url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800'
  }
];

async function seedCats() {
  console.log(`Starting seed for ${cats.length} cat breeds...`);
  
  // Optional: Clean up existing cats to avoid duplicates if running multiple times
  console.log('Cleaning up existing cats...');
  await supabase.from('pet_breeds').delete().eq('category', 'Cat');

  // Insert data
  const { data, error } = await supabase
    .from('pet_breeds')
    .insert(cats)
    .select();

  if (error) {
    console.error('Error inserting cats:', error);
  } else {
    console.log(`Successfully inserted ${data.length} cats!`);
  }
}

seedCats().catch(console.error);
