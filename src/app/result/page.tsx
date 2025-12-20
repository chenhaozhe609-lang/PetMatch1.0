import ResultCard from '@/components/ResultCard';
import LoadingOverlay from '@/components/LoadingOverlay';
import { Metadata } from 'next';
import { getBreedById } from '@/lib/recommendationEngine';
import { Suspense } from 'react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { searchParams }: Props
): Promise<Metadata> {
  // In Next.js 15, searchParams is a Promise
  const params = await searchParams;
  const breedId = params.breed_id as string;
  
  if (breedId) {
    const breed = await getBreedById(breedId);
    if (breed) {
      return {
        title: `My Soulmate is a ${breed.name}! 🐶 | AI Pet Match`,
        description: `I took the AI Personality Test and got matched with a ${breed.name}. Find yours now!`,
      };
    }
  }

  return {
    title: "My Pet Soulmate Result | AI Pet Match",
    description: "Discover which pet breed perfectly matches your personality and lifestyle.",
  };
}

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <Suspense fallback={<LoadingOverlay />}>
          <ResultCard />
        </Suspense>
      </div>
    </main>
  );
}