import { Pet, UserConstraints } from '@/types/pet';
import { pets } from '@/data/pets';

export function getRecommendedBreeds(
  selectedCategory: string,
  constraints: UserConstraints
): Pet[] {
  // 1. Initial filter by Category
  let candidates = pets.filter((pet) => pet.category === selectedCategory);

  // If category doesn't match any pets (e.g. "Lizard" vs "Reptile"), try to match loosely or map it
  if (candidates.length === 0) {
    // Map common user terms to data categories
    if (selectedCategory === 'Lizard') candidates = pets.filter(p => p.category === 'Reptile');
    else if (selectedCategory === 'Bunny') candidates = pets.filter(p => p.category === 'Small Pet');
  }

  if (candidates.length === 0) return []; // Should not happen if data covers categories

  // 2. Apply Filters based on Category
  let filtered = [...candidates];

  // --- DOG Logic ---
  if (selectedCategory === 'Dog') {
    // Filter by Space: Apartment -> Remove Large
    if (constraints.space === 'apartment') {
      filtered = filtered.filter((p) => p.size !== 'large');
    }

    // Filter by Time: Low -> Remove High Energy
    if (constraints.time === 'low') {
      filtered = filtered.filter((p) => p.energy !== 'high');
    }

    // Filter by Budget: Low -> Highlight Mixed Breed (we'll prioritize them or filter out expensive/high maintenance)
    // For this logic, let's keep it simple: if budget is low, maybe remove high maintenance?
    // The prompt says "highlight 'Mixed Breed / Rescue' or low-maintenance breeds".
    // We can filter out high maintenance if budget is low.
    if (constraints.budget === 'low') {
      filtered = filtered.filter((p) => p.maintenance !== 'high');
    }
  }

  // --- CAT Logic ---
  else if (selectedCategory === 'Cat') {
    // Filter by Time: Low -> Remove Long Coat (grooming needs)
    if (constraints.time === 'low') {
      filtered = filtered.filter((p) => p.coat !== 'long');
    }

    // Filter by Tolerance (DealBreaker): Fur -> Only Hairless or Low Shedding
    // Note: Our data uses 'hairless', 'short', 'long'. 'Short' still has fur.
    // If dealBreaker is 'fur', we strictly want hairless or maybe specific hypoallergenic (not in basic data yet).
    // Let's assume 'hairless' is the safe bet for 'fur' dealbreaker.
    if (constraints.dealBreaker === 'fur') {
      filtered = filtered.filter((p) => p.coat === 'hairless');
    }
  }

  // --- REPTILE / SMALL PET Logic ---
  else if (selectedCategory === 'Reptile' || selectedCategory === 'Small Pet') {
    // Filter by DealBreaker: Bugs/Mice -> Remove Carnivores/Insectivores
    if (constraints.dealBreaker === 'bugs/mice') {
      filtered = filtered.filter((p) => p.diet !== 'carnivore' && p.diet !== 'insectivore');
    }
  }

  // 3. Fallback Logic (Crucial)
  if (filtered.length === 0) {
    // Return "Least Worst" match
    return getFallbackPet(candidates, selectedCategory, constraints);
  }

  return filtered;
}

function getFallbackPet(candidates: Pet[], category: string, constraints: UserConstraints): Pet[] {
  let fallback: Pet | undefined;

  if (category === 'Dog') {
    // Fallback: Smallest dog available (Space is usually the hardest constraint)
    // or Mixed Breed (generally adaptable)
    fallback = candidates.find(p => p.size === 'small') || candidates.find(p => p.id === 'dog_mixed');
  } else if (category === 'Cat') {
    // Fallback: Domestic Shorthair (standard, easiest)
    fallback = candidates.find(p => p.id === 'cat_shorthair');
  } else if (category === 'Reptile') {
    // Fallback: If bugs were the issue, try to find an omnivore/herbivore if possible, 
    // otherwise just the easiest one (Leopard Gecko or Bearded Dragon usually)
    // But if bugs are a hard NO, Crested Gecko is the best bet.
    fallback = candidates.find(p => p.name === 'Crested Gecko'); 
    // If we don't have one, just return the first one
    if (!fallback) fallback = candidates[0];
  } else {
    // Default
    fallback = candidates[0];
  }

  if (fallback) {
    return [{ ...fallback, isCompromise: true }];
  }

  return [];
}
