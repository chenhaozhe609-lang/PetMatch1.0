import { SupabaseClient } from '@supabase/supabase-js';
import { PetBreed } from '@/types/database';

export const SEO_CATEGORIES = [
  { slug: 'apartment-living', title: 'Apartment Living', description: 'Best pets for small spaces' },
  { slug: 'first-time-owners', title: 'First Time Owners', description: 'Easy to train and care for' },
  { slug: 'families-with-kids', title: 'Families with Kids', description: 'Gentle and patient companions' },
  { slug: 'budget-friendly', title: 'Budget Friendly', description: 'Low cost of ownership' },
  { slug: 'hypoallergenic', title: 'Hypoallergenic', description: 'Low shedding for allergy sufferers' },
] as const;

export type SeoCategorySlug = typeof SEO_CATEGORIES[number]['slug'];

export function getCategoryBySlug(slug: string) {
  return SEO_CATEGORIES.find(c => c.slug === slug);
}

export function applyCategoryFilters(query: any, slug: string) {
  switch (slug) {
    case 'apartment-living':
      return query.in('min_space', ['tiny', 'apartment']);
    case 'first-time-owners':
      return query.in('trainability', ['high', 'medium']);
    case 'families-with-kids':
      return query.eq('family_friendly', true);
    case 'budget-friendly':
      return query.eq('budget_tier', 'low');
    case 'hypoallergenic':
      return query.in('shedding', ['none', 'low']);
    default:
      return query;
  }
}

export function getWhyItFits(breed: PetBreed, slug: string): string {
  switch (slug) {
    case 'apartment-living':
      return `Great for apartments because it only requires ${breed.min_space} space.`;
    case 'first-time-owners':
      return `Excellent for beginners due to its ${breed.trainability || 'good'} trainability.`;
    case 'families-with-kids':
      return `A wonderful choice for families as they are known to be friendly with children.`;
    case 'budget-friendly':
      return `Wallet-friendly with a ${breed.budget_tier} budget tier.`;
    case 'hypoallergenic':
      return `Perfect for allergy sufferers with ${breed.shedding || 'low'} shedding.`;
    default:
      return 'A great companion.';
  }
}
