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
      url: `${baseUrl}/match`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/cost-calculator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools/name-generator`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // 2. Fetch Dynamic Routes from Supabase for Cost Calculator only
  const { data: breeds } = await supabase
    .from('pet_breeds')
    .select('breed_name');

  // Helper to generate slug
  const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  // Cost Calculator Pages (Programmatic SEO)
  const costRoutes: MetadataRoute.Sitemap = (breeds || []).map((breed) => ({
    url: `${baseUrl}/cost/${toSlug(breed.breed_name)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8, // Higher priority as these are high-value tool pages
  }));

  // 3. Merge and Return
  return [...staticRoutes, ...costRoutes];
}
