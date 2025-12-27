import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, CheckCircle, Info } from 'lucide-react';
import { 
  SEO_CATEGORIES, 
  getCategoryBySlug, 
  applyCategoryFilters, 
  getWhyItFits 
} from '@/lib/seo-categories';
import { PetBreed } from '@/types/database';

// 1. Generate Static Params for SSG
export async function generateStaticParams() {
  return SEO_CATEGORIES.map((cat) => ({
    category: cat.slug,
  }));
}

// 2. Metadata
type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategoryBySlug(resolvedParams.category);
  if (!category) return {};

  return {
    title: `Best Pets for ${category.title} | SoulmatePaw`,
    description: `Looking for the best pet for ${category.title}? Check out our AI-curated list of top breeds and more.`,
  };
}

// 3. Page Component
export default async function SeoCategoryPage({ params }: Props) {
  const resolvedParams = await params;
  const categoryInfo = getCategoryBySlug(resolvedParams.category);

  if (!categoryInfo) {
    notFound();
  }

  // Fetch breeds based on category
  let query = supabase
    .from('pet_breeds')
    // Removing references to non-existent columns (trainability, family_friendly, shedding) to fix build error
    .select('id, breed_name, category, image_url, min_space, budget_tier, description');

  query = applyCategoryFilters(query, resolvedParams.category);
  
  const { data: breeds, error } = await query;

  if (error) {
    console.error('Error fetching breeds:', error);
    return <div>Error loading breeds.</div>;
  }

  const typedBreeds = breeds as unknown as PetBreed[];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-stone-100 py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <Link href="/breeds" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-8 transition-colors font-medium">
             <ArrowLeft size={16} /> Back to All Breeds
          </Link>
          <span className="block text-primary font-bold uppercase tracking-wider text-sm mb-4">
             Curated Collection
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground font-heading mb-6">
            The Ultimate Guide to Pets for <span className="text-secondary">{categoryInfo.title}</span>
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            {categoryInfo.description}. We've analyzed our database to find the perfect companions that match these specific needs.
          </p>
        </div>
      </div>

      {/* List Section */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-8">
        {typedBreeds?.length === 0 ? (
           <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
             <Info className="mx-auto text-stone-300 mb-4" size={48} />
             <p className="text-xl text-muted">No specific breeds found for this criteria yet. Check back soon!</p>
           </div>
        ) : (
          typedBreeds?.map((breed) => (
            <div 
              key={breed.id} 
              className="group bg-white rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-xl transition-all border border-stone-100 flex flex-col md:flex-row gap-8 items-center md:items-start"
            >
              {/* Image */}
              <div className="relative w-full md:w-64 h-64 flex-shrink-0 rounded-2xl overflow-hidden bg-stone-100">
                {breed.image_url ? (
                  <Image
                    src={breed.image_url}
                    alt={breed.breed_name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-stone-300 text-4xl">🐾</div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-foreground shadow-sm">
                  {breed.category}
                </div>
              </div>

              {/* Content */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-3xl font-bold text-foreground font-heading mb-3 group-hover:text-primary transition-colors">
                  {breed.breed_name}
                </h2>
                
                {/* Why it fits */}
                <div className="bg-green-50 text-green-700 px-4 py-3 rounded-xl mb-6 inline-flex items-start gap-2 text-left">
                  <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
                  <span className="font-medium">
                    <span className="font-bold block text-xs uppercase tracking-wider opacity-70 mb-1">Why it fits</span>
                    {getWhyItFits(breed, resolvedParams.category)}
                  </span>
                </div>

                <p className="text-muted leading-relaxed mb-8 line-clamp-3">
                  {breed.description}
                </p>

                <Link 
                  href={`/breed/${breed.breed_name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="inline-flex items-center gap-2 bg-foreground text-white px-8 py-3 rounded-full font-bold hover:bg-primary transition-colors"
                >
                  Read Full Guide <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
