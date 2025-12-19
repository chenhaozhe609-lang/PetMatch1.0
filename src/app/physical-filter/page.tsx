import { QuizProvider } from '@/context/QuizContext';
import PhysicalQuiz from '@/components/PhysicalQuiz';

export default function PhysicalFilterPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <PhysicalQuiz />
      </div>
    </main>
  );
}