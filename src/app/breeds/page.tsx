'use client';

import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Building2, Baby, Wallet, BadgeCheck, Filter } from 'lucide-react';
import { SEO_CATEGORIES } from '@/lib/seo-categories';
import { useEffect, useState } from 'react';
import { PetBreed } from '@/types/database';
import { cn } from '@/lib/utils';

// Helper to convert breed name to slug
const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

// Helper for category icons
const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'apartment-living': return <Building2 size={20} />;
    case 'first-time-owners': return <Sparkles size={20} />;
    case 'families-with-kids': return <Baby size={20} />;
    case 'budget-friendly': return <Wallet size={20} />;
    case 'hypoallergenic': return <BadgeCheck size={20} />;
    default: return <Sparkles size={20} />;
  }
};

export default function BreedsPage() {
  const [breeds, setBreeds] = useState<PetBreed[]>([]);
  const [filter, setFilter] = useState<'all' | 'Dog' | 'Cat'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBreeds() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pet_breeds')
        .select('id, breed_name, category, image_url')
        .order('breed_name');

      if (error) {
        console.error('Error fetching breeds:', error);
      } else {
        setBreeds(data as PetBreed[]);
      }
      setLoading(false);
    }

    fetchBreeds();
  }, []);

  const filteredBreeds = filter === 'all' 
    ? breeds 
    : breeds.filter(breed => breed.category === filter);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6 transition-colors font-medium">
             <ArrowLeft size={16} /> Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-heading mb-4">
            Explore Pet Breeds
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            Discover the personality, care needs, and unique traits of our furry friends.
          </p>
          
          {/* SEO Collections Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
             <span className="w-full block text-sm font-bold text-stone-400 uppercase tracking-wider mb-2">Popular Collections</span>
             {SEO_CATEGORIES.map((cat) => (
               <Link 
                 key={cat.slug} 
                 href={`/best-pets-for/${cat.slug}`}
                 className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 text-stone-600 hover:border-secondary hover:text-secondary hover:shadow-sm transition-all text-sm font-bold"
               >
                 {getCategoryIcon(cat.slug)}
                 {cat.title}
               </Link>
             ))}
          </div>

          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                "px-6 py-2 rounded-full font-bold transition-all",
                filter === 'all' ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilter('Dog')}
              className={cn(
                "px-6 py-2 rounded-full font-bold transition-all",
                filter === 'Dog' ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              Dogs
            </button>
            <button
              onClick={() => setFilter('Cat')}
              className={cn(
                "px-6 py-2 rounded-full font-bold transition-all",
                filter === 'Cat' ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              )}
            >
              Cats
            </button>
          </div>

          <p className="text-sm text-stone-400 mt-8 italic">
            * Detailed breed guides for other pet categories (Birds, Reptiles, Small Pets) are on the way!
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBreeds.map((breed) => (
              <Link 
                key={breed.id} 
                href={`/breed/${toSlug(breed.breed_name)}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 overflow-hidden border border-stone-100"
              >
                <div className="relative h-48 w-full bg-stone-100">
                  {breed.image_url ? (
                    <Image
                      src={breed.image_url}
                      alt={breed.breed_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-stone-400">
                      <span className="text-4xl">🐾</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                    {breed.category}
                  </div>
                </div>
                
                <div className="p-5">
                  <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {breed.breed_name}
                  </h2>
                  <div className="mt-2 flex items-center text-sm text-muted font-medium">
                    <span>View Guide</span>
                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
