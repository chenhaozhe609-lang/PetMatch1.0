import { QuizProvider } from '@/context/QuizContext';
import DecisionJourney from '@/components/DecisionJourney';

export default function DecisionTreePage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Explore Your Options
          </h1>
          <p className="text-lg text-gray-600">
            Let's narrow down what you're looking for.
          </p>
        </header>
        <DecisionJourney />
      </div>
    </main>
  );
}