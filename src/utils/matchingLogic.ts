import { supabase } from '@/lib/supabaseClient';
import { PetBreed } from '@/types/database';

export interface PhysicalConstraints {
  space: 'tiny' | 'apartment' | 'house'; // tiny < apartment < house
  budget: 'low' | 'medium' | 'high'; // low < medium < high
  time: 'low' | 'medium' | 'high'; // low < medium < high
}

/**
 * Finds the best matching breed based on category and physical constraints.
 * 
 * Logic:
 * 1. Filter by Category.
 * 2. Filter by Constraints (Hard filters).
 *    - Space: User's space must be >= Breed's min_space.
 *    - Budget: User's budget must be >= Breed's budget_tier.
 *    - Time: User's time must be >= Breed's time_commitment.
 * 3. If matches found -> Return them.
 * 4. If NO matches -> Fallback to the "easiest" breed in that category (Lowest Energy/Budget/Time)
 *    and mark as compromise.
 */
export async function findBestMatch(
  category: string,
  constraints: PhysicalConstraints
): Promise<PetBreed[]> {
  console.log(`Finding match for Category: ${category}, Constraints:`, constraints);

  // 1. Fetch all breeds for this category
  const { data: breeds, error } = await supabase
    .from('pet_breeds')
    .select('*')
    .eq('category', category);

  if (error || !breeds) {
    console.error('Error fetching breeds:', error);
    return [];
  }

  const allBreeds = breeds as PetBreed[];

  // 2. Apply Filters
  // We need to define ordinal values for comparison
  const spaceValue = { tiny: 1, apartment: 2, house: 3 };
  const tierValue = { low: 1, medium: 2, high: 3 };

  const validBreeds = allBreeds.filter((breed) => {
    // Space Check: User space (e.g. Apartment=2) must be >= Breed space (e.g. Tiny=1).
    const spaceOk = spaceValue[constraints.space] >= spaceValue[breed.min_space];

    // Budget Check: User budget (e.g. Medium=2) must be >= Breed budget (e.g. Low=1).
    const budgetOk = tierValue[constraints.budget] >= tierValue[breed.budget_tier];

    // Time Check: User time (e.g. Low=1) must be >= Breed time (e.g. High=3).
    const timeOk = tierValue[constraints.time] >= tierValue[breed.time_commitment];

    return spaceOk && budgetOk && timeOk;
  });

  // 3. Return Matches if any
  if (validBreeds.length > 0) {
    console.log(`Found ${validBreeds.length} exact matches.`);
    return validBreeds;
  }

  // 4. Smart Fallback (No exact matches)
  console.log('No exact matches found. Finding compromise...');
  
  // Strategy: Find the breed with the LOWEST requirements (sum of ordinal values)
  // We prioritize Space first as it's the hardest constraint to change.
  const sortedBreeds = allBreeds.sort((a, b) => {
    const scoreA = spaceValue[a.min_space] * 10 + tierValue[a.time_commitment] * 2 + tierValue[a.budget_tier];
    const scoreB = spaceValue[b.min_space] * 10 + tierValue[b.time_commitment] * 2 + tierValue[b.budget_tier];
    return scoreA - scoreB;
  });

  const bestCompromise = sortedBreeds[0];
  
  if (bestCompromise) {
    return [{ ...bestCompromise, is_compromise: true }];
  }

  return [];
}
