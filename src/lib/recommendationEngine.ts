import { supabase } from './supabaseClient';

// --- Types ---

export interface PetBreed {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  description: string;
  // Physical Traits
  min_space: 'small' | 'medium' | 'large';
  budget_tier: 'low' | 'medium' | 'high';
  energy_level: 'low' | 'medium' | 'high';
  // Personality Traits (0.0 - 1.0)
  personality: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  // Dynamic Results
  matchScore?: number;
  matchDetails?: {
    physicalScore: number;
    personalityScore: number;
    reason: string;
  };
  // For UI compatibility with old structure
  tags?: {
    space: 'tiny' | 'apartment' | 'house';
    budget: 'low' | 'medium' | 'high';
    time: 'low' | 'medium' | 'high';
  };
  whyItFits?: string;
}

export interface UserConstraints {
  space: 'tiny' | 'apartment' | 'house';
  budget: 'low' | 'medium' | 'high';
  time: 'low' | 'medium' | 'high';
}

// --- Configuration ---

const WEIGHTS = {
  PHYSICAL: 0.4,    // 40% importance on physical logistics
  PERSONALITY: 0.6  // 60% importance on soulmate connection
};

const PHYSICAL_SCORES = {
  space: { tiny: 1, apartment: 2, house: 3 },
  budget: { low: 1, medium: 2, high: 3 },
  time: { low: 1, medium: 2, high: 3 },
};

// --- Helper Functions ---

/**
 * Calculates how well the pet fits the user's logistical constraints.
 * Return: 0.0 - 1.0
 */
function calculatePhysicalScore(pet: PetBreed, user: UserConstraints): number {
  let score = 0;
  const maxScore = 3; // 3 Criteria: Space, Budget, Time

  // 1. Space Compatibility (Hard-ish Constraint)
  // Pet needs X, User has Y. if Y >= X, full points.
  const petSpaceVal = PHYSICAL_SCORES.space[pet.min_space === 'small' ? 'tiny' : (pet.min_space === 'medium' ? 'apartment' : 'house')];
  const userSpaceVal = PHYSICAL_SCORES.space[user.space];

  if (userSpaceVal >= petSpaceVal) score += 1;
  else score += 0.2; // Penalize heavily if space is too small, but don't zero-out (maybe they have a big yard?)

  // 2. Budget Compatibility
  const petBudgetVal = PHYSICAL_SCORES.budget[pet.budget_tier];
  const userBudgetVal = PHYSICAL_SCORES.budget[user.budget];

  if (userBudgetVal >= petBudgetVal) score += 1;
  else if (userBudgetVal === petBudgetVal - 1) score += 0.5; // Slight stretch
  else score += 0; // Too expensive

  // 3. Time/Energy Compatibility
  // Complex: High energy pet needs High time. Low energy pet is fine with High time.
  const petEnergyVal = PHYSICAL_SCORES.time[pet.energy_level];
  const userTimeVal = PHYSICAL_SCORES.time[user.time];

  if (userTimeVal >= petEnergyVal) score += 1;
  else if (userTimeVal === petEnergyVal - 1) score += 0.4; // Managing, but hard
  else score += 0.1; // Neglect risk

  return score / maxScore;
}

/**
 * Calculates "Soulmate" vector similarity.
 * Return: 0.0 - 1.0
 */
function calculatePersonalityScore(pet: PetBreed, userTraits: Record<string, number>): number {
  const traits = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'] as const;

  let sumSquaredDiff = 0;

  traits.forEach(trait => {
    // Normalization: User inputs might use capitalized keys if coming from raw state, handle both.
    const userVal = userTraits[trait] ?? userTraits[trait.charAt(0).toUpperCase() + trait.slice(1)] ?? 0.5;
    const petVal = pet.personality[trait];

    const diff = userVal - petVal;
    sumSquaredDiff += diff * diff;
  });

  const distance = Math.sqrt(sumSquaredDiff);
  const maxDistance = Math.sqrt(traits.length); // sqrt(5) ≈ 2.23 (if extreme opposites)

  // Invert distance: 0 distance = 1.0 score
  return Math.max(0, 1 - (distance / maxDistance));
}

// --- Main Engine ---

export async function findBestMatch(
  category: string,
  constraints: UserConstraints,
  personalityScores: Record<string, number> = {}
): Promise<PetBreed> {
  console.log(`[Engine] New Weighted Matching for ${category}...`);

  // 1. Fetch Candidates (Generic)
  // We fetch ALL animals in the category. Filtering happens via scoring, not SQL WHERE clauses.
  // This allows "near-misses" to still be considered if their personality score is huge.
  const { data, error } = await supabase
    .from('pet_breeds')
    .select('*')
    .eq('category', category);

  let candidates: any[] = [];

  if (!error && data && data.length > 0) {
    candidates = data;
  } else {
    // Fallback if DB is empty/error (Graceful degradation)
    console.warn('[Engine] DB fetch failed or empty. Using Local Fallback.');
    candidates = FALLBACK_DB.filter(p => p.category === category);
  }

  // 2. Score Every Candidate
  const scoredCandidates = candidates.map(row => {
    // Map Row to Entity
    const pet: PetBreed = {
      id: row.id,
      name: row.breed_name || row.name,
      category: row.category,
      imageUrl: row.image_url || row.imageUrl,
      description: row.description,
      min_space: row.min_space,
      budget_tier: row.budget_tier,
      energy_level: row.energy_level,
      personality: {
        openness: row.trait_openness ?? 0.5,
        conscientiousness: row.trait_conscientiousness ?? 0.5,
        extraversion: row.trait_extraversion ?? 0.5,
        agreeableness: row.trait_agreeableness ?? 0.5,
        neuroticism: row.trait_neuroticism ?? 0.5,
      }
    };

    // Calculate Components
    const physScore = calculatePhysicalScore(pet, constraints);
    const persScore = calculatePersonalityScore(pet, personalityScores);

    // Weighted Average
    const totalScore = (physScore * WEIGHTS.PHYSICAL) + (persScore * WEIGHTS.PERSONALITY);

    // Generate Reason String
    const reason = generateReason(physScore, persScore, pet.name);

    return {
      ...pet,
      matchScore: Math.round(totalScore * 100),
      matchDetails: {
        physicalScore: Math.round(physScore * 100),
        personalityScore: Math.round(persScore * 100),
        reason
      }
    };
  });

  // 3. Sort & Return Best
  scoredCandidates.sort((a, b) => b.matchScore! - a.matchScore!);

  const bestMatch = scoredCandidates[0];

  // Map to format UI expects (tags handling etc)
  return {
    ...bestMatch,
    tags: {
      space: bestMatch.min_space === 'small' ? 'tiny' : (bestMatch.min_space === 'medium' ? 'apartment' : 'house'),
      budget: bestMatch.budget_tier,
      time: bestMatch.energy_level
    },
    whyItFits: bestMatch.matchDetails?.reason
  };
}

function generateReason(phys: number, pers: number, name: string): string {
  if (phys > 0.8 && pers > 0.8) return `A perfect match! You have the right lifestyle and your personalities click perfectly.`;
  if (pers > 0.9) return `You and ${name} are soulmates! Your personalities are incredibly similar.`;
  if (phys > 0.9) return `Logistically, ${name} is the smart choice for your home and budget.`;
  return `A balanced choice that fits your life well.`;
}

export async function getBreedById(id: string): Promise<PetBreed | null> {
  const { data } = await supabase.from('pet_breeds').select('*').eq('id', id).single();
  if (data) {
    return {
      id: data.id,
      name: data.breed_name,
      category: data.category,
      imageUrl: data.image_url,
      description: data.description,
      min_space: data.min_space,
      budget_tier: data.budget_tier,
      energy_level: data.energy_level,
      personality: {
        openness: data.trait_openness ?? 0.5,
        conscientiousness: data.trait_conscientiousness ?? 0.5,
        extraversion: data.trait_extraversion ?? 0.5,
        agreeableness: data.trait_agreeableness ?? 0.5,
        neuroticism: data.trait_neuroticism ?? 0.5,
      },
      tags: { // UI Compatibility
        space: data.min_space === 'small' ? 'tiny' : (data.min_space === 'medium' ? 'apartment' : 'house'),
        budget: data.budget_tier,
        time: data.energy_level
      }
    };
  }
  return null;
}

// --- Legacy Fallback Data (Minimal) ---
const FALLBACK_DB = [
  {
    id: 'dog_golden', name: 'Golden Retriever', category: 'Dog',
    min_space: 'large', budget_tier: 'high', energy_level: 'high', description: 'Friendly and loyal.',
    trait_openness: 0.8, trait_conscientiousness: 0.6, trait_extraversion: 0.9, trait_agreeableness: 0.9, trait_neuroticism: 0.2
  },
  {
    id: 'cat_bsh', name: 'British Shorthair', category: 'Cat',
    min_space: 'small', budget_tier: 'medium', energy_level: 'low', description: 'Calm and independent.',
    trait_openness: 0.3, trait_conscientiousness: 0.7, trait_extraversion: 0.3, trait_agreeableness: 0.6, trait_neuroticism: 0.2
  }
];
