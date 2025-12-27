import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import CostCalculator from '@/components/tools/CostCalculator';
import { PetSize } from '@/types/calculator';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';

export const revalidate = 3600; // Revalidate every hour

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Helper to convert slug to name for querying (approximate)
// Since we don't have a slug column, we rely on matching the format
function slugToName(slug: string) {
  return slug.replace(/-/g, ' ');
}

// Helper to fetch breed data
async function getBreed(slug: string) {
  const nameQuery = slugToName(slug);
  
  // Try case-insensitive match on breed_name
  const { data, error } = await supabase
    .from('pet_breeds')
    .select('*')
    .ilike('breed_name', nameQuery)
    .single();

  if (data) return data;

  // Fallback: Fetch all and find match
  const { data: allBreeds } = await supabase
    .from('pet_breeds')
    .select('*');
    
  if (allBreeds) {
    return allBreeds.find(b => b.breed_name.toLowerCase().replace(/\s+/g, '-') === slug);
  }

  return null;
}

function mapBreedToSize(breed: any): PetSize {
  if (breed.category === 'Cat') return 'cat';
  
  // Logic for dogs
  if (breed.min_space === 'tiny') return 'small_dog';
  if (breed.min_space === 'apartment') return 'medium_dog'; // Assumption: Apartment dogs are roughly medium sized
  if (breed.min_space === 'house') return 'large_dog';
  
  return 'medium_dog'; // Default fallback
}

export async function generateStaticParams() {
  const { data: breeds } = await supabase
    .from('pet_breeds')
    .select('breed_name');

  if (!breeds) return [];

  return breeds.map((breed) => ({
    slug: breed.breed_name.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const breed = await getBreed(slug);
  
  if (!breed) {
    return {
      title: 'Calculator Not Found | SoulmatePaw',
    };
  }

  const title = `True Cost of Owning a ${breed.breed_name} (2025 Budget Breakdown)`;
  const description = `Planning to get a ${breed.breed_name}? Use our AI calculator to estimate monthly food costs, vet bills, and one-time expenses. Avoid financial surprises.`;

  return {
    title,
    description,
    alternates: {
        canonical: `https://soulmatepaw.com/cost/${slug}`,
    },
    openGraph: {
      title,
      description,
      images: breed.image_url ? [{ url: breed.image_url }] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: breed.image_url ? [breed.image_url] : [],
    },
  };
}

export default async function CostPage({ params }: Props) {
  const { slug } = await params;
  const breed = await getBreed(slug);

  if (!breed) {
    notFound();
  }

  const mappedSize = mapBreedToSize(breed);

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/tools/cost-calculator" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-8 transition-colors font-medium">
          <ArrowLeft size={16} /> Back to general calculator
        </Link>
        
        <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-extrabold text-foreground font-heading mb-4">
              True Cost of Owning a <span className="text-primary">{breed.breed_name}</span>
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Don't get caught off guard. See the real 2025 numbers for food, vet, and supplies.
            </p>
        </div>

        <Suspense fallback={
          <div className="w-full h-[400px] bg-white rounded-3xl animate-pulse flex items-center justify-center text-stone-300">
            Loading Calculator...
          </div>
        }>
          <CostCalculator 
            initialBreed={{
              name: breed.breed_name,
              size: mappedSize
            }}
          />
        </Suspense>

        {/* SEO Content Injection */}
        <div className="mt-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-stone-100">
           <h2 className="text-2xl font-bold text-foreground font-heading mb-6">
             Why is a {breed.breed_name} expensive?
           </h2>
           <div className="space-y-4 text-muted leading-relaxed">
              <p>
                The average cost of owning a <strong>{breed.breed_name}</strong> is largely affected by its <strong>{mappedSize.replace('_', ' ')}</strong> size requirements.
                {mappedSize === 'large_dog' && " Large breeds typically consume more food and require higher doses of preventative medications, leading to higher monthly bills."}
                {mappedSize === 'small_dog' && " While small breeds eat less, they may require more frequent dental care or specialized grooming services."}
                {mappedSize === 'cat' && " Cats are generally more affordable than dogs, but quality litter and dietary needs can add up."}
              </p>
              <p>
                Beyond the basics, you should budget for <strong>{breed.energy_level} energy</strong> activities.
                {breed.energy_level === 'high' 
                  ? " High energy breeds often need extra toys, puzzles, or even doggy daycare to stay happy."
                  : " Lower energy breeds might save you money on activity-related costs, but don't skip the quality food!"}
              </p>
              <p>
                 This calculator uses 2025 market averages for {mappedSize.replace('_', ' ')} supplies and veterinary care. Your actual costs may vary based on your location and specific choices.
              </p>
           </div>
           
           <div className="mt-8 pt-8 border-t border-stone-100">
              <h3 className="text-xl font-bold text-foreground font-heading mb-4">
                Quick Stats for {breed.breed_name} Owners
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="bg-stone-50 p-4 rounded-xl text-center">
                    <span className="block text-sm text-stone-500 uppercase tracking-wider mb-1">Energy Level</span>
                    <span className="font-bold text-foreground capitalize">{breed.energy_level}</span>
                 </div>
                 <div className="bg-stone-50 p-4 rounded-xl text-center">
                    <span className="block text-sm text-stone-500 uppercase tracking-wider mb-1">Space Needs</span>
                    <span className="font-bold text-foreground capitalize">{breed.min_space}</span>
                 </div>
                 <div className="bg-stone-50 p-4 rounded-xl text-center">
                    <span className="block text-sm text-stone-500 uppercase tracking-wider mb-1">Budget Tier</span>
                    <span className="font-bold text-foreground capitalize">{breed.budget_tier}</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
