import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://soulmatepaw.com';

  // 1. Define Static Routes (New V3.0 Architecture)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/match`, // Corrected from /quiz to /match based on project structure
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/cost-calculator`, // [V3.0 New]
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9, // High priority for monetization
    },
    {
      url: `${baseUrl}/tools/name-generator`, // [V3.0 New]
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/animunity`, // [V3.0 New Community]
      lastModified: new Date(),
      changeFrequency: 'daily', // Frequent updates expected
      priority: 0.8,
    },
    {
      url: `${baseUrl}/breeds`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 2. Fetch Dynamic Routes from Supabase
  // Fetch breed_name to generate slugs as slug column does not exist
  const { data: breeds } = await supabase
    .from('pet_breeds')
    .select('breed_name');

  const dynamicRoutes: MetadataRoute.Sitemap = (breeds || []).map((breed) => ({
    url: `${baseUrl}/breed/${breed.breed_name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(), // Fallback as updated_at is not available in current schema
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // 3. Merge and Return
  return [...staticRoutes, ...dynamicRoutes];
}
