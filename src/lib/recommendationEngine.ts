// Local MVP Recommendation Engine

export interface PetBreed {
  id: string;
  name: string;
  category: string; // 'Dog', 'Cat', 'Bird', 'Reptile', 'Small Mammal'
  imageUrl?: string;
  description: string;
  tags: {
    space: 'tiny' | 'apartment' | 'house';
    budget: 'low' | 'medium' | 'high';
    time: 'low' | 'medium' | 'high';
  };
  whyItFits?: string; // Dynamic field populated at runtime
  isCompromise?: boolean; // Flag for fallback results
}

export interface UserConstraints {
  space: 'tiny' | 'apartment' | 'house';
  budget: 'low' | 'medium' | 'high';
  time: 'low' | 'medium' | 'high';
}

const PET_DATABASE: PetBreed[] = [
  // --- DOGS ---
  {
    id: 'dog_golden',
    name: 'Golden Retriever',
    category: 'Dog',
    description: 'The ultimate family companion. Friendly, energetic, and loves everyone.',
    tags: { space: 'house', budget: 'high', time: 'high' },
  },
  {
    id: 'dog_frenchie',
    name: 'French Bulldog',
    category: 'Dog',
    description: 'A charming couch potato who loves attention but needs minimal exercise.',
    tags: { space: 'apartment', budget: 'high', time: 'medium' },
  },
  {
    id: 'dog_greyhound',
    name: 'Greyhound',
    category: 'Dog',
    description: 'Surprisingly lazy! A 45mph couch potato that fits well in apartments.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'dog_chihuahua',
    name: 'Chihuahua',
    category: 'Dog',
    description: 'Tiny dog, big personality. Perfect for small living spaces.',
    tags: { space: 'tiny', budget: 'low', time: 'medium' },
  },

  // --- CATS ---
  {
    id: 'cat_siamese',
    name: 'Siamese Cat',
    category: 'Cat',
    description: 'Vocal, social, and intelligent. They want to be involved in everything you do.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'cat_ragdoll',
    name: 'Ragdoll',
    category: 'Cat',
    description: 'A large, floppy, affectionate cat that goes limp when held.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'cat_bsh',
    name: 'British Shorthair',
    category: 'Cat',
    description: 'The teddy bear of cats. Calm, independent, and low maintenance.',
    tags: { space: 'apartment', budget: 'medium', time: 'low' },
  },

  // --- SMALL MAMMALS ---
  {
    id: 'small_hamster',
    name: 'Syrian Hamster',
    category: 'Hamster', // Mapped from 'Hamster' outcome
    description: 'Solitary, nocturnal, and easy to care for. Great starter pet.',
    tags: { space: 'tiny', budget: 'low', time: 'low' },
  },
  {
    id: 'small_ferret',
    name: 'Ferret',
    category: 'Ferret',
    description: 'Playful chaos noodles. High energy and super inquisitive.',
    tags: { space: 'apartment', budget: 'medium', time: 'high' },
  },
  {
    id: 'small_rabbit',
    name: 'Holland Lop Rabbit',
    category: 'Rabbit',
    description: 'Gentle and affectionate, but needs space to hop and chew-proofed home.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },

  // --- REPTILES & OTHERS ---
  {
    id: 'rep_cornsnake',
    name: 'Corn Snake',
    category: 'Snake',
    description: 'Docile, colorful, and easy to handle. The perfect beginner snake.',
    tags: { space: 'tiny', budget: 'low', time: 'low' },
  },
  {
    id: 'rep_bearded',
    name: 'Bearded Dragon',
    category: 'Lizard',
    description: 'The dog of the reptile world. Friendly, chill, and loves bugs.',
    tags: { space: 'apartment', budget: 'medium', time: 'medium' },
  },
  {
    id: 'bird_budgie',
    name: 'Budgerigar (Budgie)',
    category: 'Bird',
    description: 'Chatty, colorful, and smart. Can learn to talk with patience.',
    tags: { space: 'apartment', budget: 'low', time: 'medium' },
  },
  {
    id: 'fish_goldfish',
    name: 'Fancy Goldfish',
    category: 'Goldfish',
    description: 'Beautiful swimmers, but they need bigger tanks than you think!',
    tags: { space: 'apartment', budget: 'medium', time: 'low' },
  },
  {
    id: 'spider_tarantula',
    name: 'Mexican Red Knee Tarantula',
    category: 'Spider',
    description: 'Slow moving, docile, and fascinating to watch. Very low maintenance.',
    tags: { space: 'tiny', budget: 'low', time: 'low' },
  },
];

// Fallback options per category if exact match fails
const FALLBACK_PETS: Record<string, string> = {
  'Dog': 'dog_chihuahua', // Easiest fit
  'Cat': 'cat_bsh',
  'Small Mammal': 'small_hamster',
  'Reptile': 'rep_cornsnake',
  'Bird': 'bird_budgie',
};

// Helper to convert ordinal values for comparison
const SCORES = {
  space: { tiny: 1, apartment: 2, house: 3 },
  budget: { low: 1, medium: 2, high: 3 },
  time: { low: 1, medium: 2, high: 3 },
};

export function findBestMatch(category: string, constraints: UserConstraints): PetBreed {
  console.log(`[Engine] Finding match for ${category}`, constraints);

  // 1. Filter by Category
  // Note: We use flexible matching because Decision Tree outcomes (e.g., 'Hamster', 'Lizard') 
  // might map directly to categories in our DB or be subtypes.
  let candidates = PET_DATABASE.filter(p => 
    p.category.toLowerCase() === category.toLowerCase() || 
    p.name.toLowerCase().includes(category.toLowerCase())
  );

  // If no direct category match (e.g. 'Small Mammal' vs specific 'Hamster'), try broader logic or default
  if (candidates.length === 0) {
    // Try to find ANY pet if category is generic, or just fallback
    console.warn(`[Engine] No direct category match for ${category}. Checking subsets...`);
  }

  // 2. Exact Filtering (Hard Constraints)
  // Logic: 
  // - Space: User Space >= Pet Space (e.g., House >= Apartment is OK)
  // - Budget: User Budget >= Pet Budget (e.g., High >= Low is OK)
  // - Time: User Time >= Pet Time (e.g., High >= Low is OK)
  
  const exactMatches = candidates.filter(pet => {
    const spaceOk = SCORES.space[constraints.space] >= SCORES.space[pet.tags.space];
    const budgetOk = SCORES.budget[constraints.budget] >= SCORES.budget[pet.tags.budget];
    const timeOk = SCORES.time[constraints.time] >= SCORES.time[pet.tags.time];
    return spaceOk && budgetOk && timeOk;
  });

  if (exactMatches.length > 0) {
    return exactMatches[0]; // Return best fit
  }

  // 3. Fallback / Compromise
  // If no exact match, return the "easiest" pet in that category (lowest requirements)
  // Sort candidates by total requirement score
  candidates.sort((a, b) => {
    const scoreA = SCORES.space[a.tags.space] + SCORES.budget[a.tags.budget] + SCORES.time[a.tags.time];
    const scoreB = SCORES.space[b.tags.space] + SCORES.budget[b.tags.budget] + SCORES.time[b.tags.time];
    return scoreA - scoreB;
  });

  if (candidates.length > 0) {
    return { ...candidates[0], isCompromise: true };
  }

  // Absolute fallback if category is empty in DB (shouldn't happen with good seed data)
  return PET_DATABASE[0]; 
}
