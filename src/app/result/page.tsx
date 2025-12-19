import { QuizProvider } from '@/context/QuizContext';
import ResultCard from '@/components/ResultCard';

export default function ResultPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <ResultCard />
      </div>
    </main>
  );
}