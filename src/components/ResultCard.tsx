'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuiz } from '@/context/QuizContext';
import { ShoppingBag, ThumbsUp, ThumbsDown, RotateCcw, Loader2, Share2, Zap, Home, DollarSign, Sparkles } from 'lucide-react';
import { findBestMatch, PetBreed } from '@/lib/recommendationEngine';
import { useRouter } from 'next/navigation';

const MOCK_PRODUCTS = [
  { name: 'Cozy Calming Bed', price: '$45', image: '🛏️' },
  { name: 'Interactive Treat Toy', price: '$22', image: '🎾' },
];

export default function ResultCard() {
  const { selectedCategory, physicalConstraints, submitFeedback, resetSession, personalityScores } = useQuiz();
  const [feedbackScore, setFeedbackScore] = useState<number | null>(null);
  const [matchedBreed, setMatchedBreed] = useState<PetBreed | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isSaved = useRef(false);

  useEffect(() => {
    // If no category selected (user refreshed or direct access), go home
    if (!selectedCategory) {
      router.push('/');
      return;
    }

    async function fetchMatches() {
      if (selectedCategory && physicalConstraints) {
        setLoading(true);
        // Simulate async delay for dramatic effect
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const match = findBestMatch(selectedCategory, physicalConstraints);
        setMatchedBreed(match);
        setLoading(false);
        
        // Save to Database via API
        if (!isSaved.current) {
          isSaved.current = true;
          try {
            await fetch('/api/save-journey', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                personalityScores,
                constraints: physicalConstraints,
                decisionPath: selectedCategory,
                recommendedResult: match,
              }),
            });
          } catch (error) {
            console.error('Error saving journey:', error);
          }
        }
      }
    }
    fetchMatches();
  }, [selectedCategory, physicalConstraints, personalityScores, router]);

  if (!selectedCategory) return null;

  if (loading || !matchedBreed) {
    return (
      <div className="min-h-[600px] flex flex-col justify-center items-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-foreground font-heading">Finalizing your match...</h2>
      </div>
    );
  }

  const bestMatch = matchedBreed;

  // Generate Dynamic "Why" Text
  const whyItFits = bestMatch.whyItFits || 
    `Since you live in an ${physicalConstraints?.space} and have ${physicalConstraints?.time} time, the ${bestMatch.name} is your ideal match!`;

  const handleFeedback = (score: number) => {
    setFeedbackScore(score);
    submitFeedback(score);
  };

  const handleStartOver = () => {
    resetSession();
    router.push('/');
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 relative">
      {/* Background Blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-heading mb-2">
          It's a Match! 🎉
        </h1>
        <p className="text-xl text-muted font-light">
          Say hello to your new soulmate.
        </p>
      </motion.div>

      {/* Main Soulmate Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Image Area */}
          <div className="bg-stone-50 p-8 flex items-center justify-center relative overflow-hidden group min-h-[320px]">
            <div className="absolute inset-0 bg-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            {/* Placeholder for Pet Image */}
            <div className="flex flex-col items-center justify-center text-stone-300">
               {bestMatch.imageUrl ? (
                 <img src={bestMatch.imageUrl} alt={bestMatch.name} className="w-64 h-64 object-cover rounded-full shadow-lg" />
               ) : (
                 <>
                   <div className="w-40 h-40 rounded-full border-4 border-dashed border-stone-200 flex items-center justify-center mb-4">
                     <span className="text-4xl">🐾</span>
                   </div>
                   <p className="text-sm font-bold uppercase tracking-widest">Image Coming Soon</p>
                 </>
               )}
            </div>
          </div>

          {/* Right: Details Area */}
          <div className="p-8 md:p-12 flex flex-col justify-center text-left">
             <div className="mb-6">
                {bestMatch.isCompromise && (
                  <span className="inline-block bg-yellow-100 text-yellow-800 font-bold px-4 py-1 rounded-full text-xs mb-3">
                    Best Compromise
                  </span>
                )}
                <span className="inline-block bg-primary/10 text-primary font-bold px-4 py-1 rounded-full text-sm mb-3 ml-2">
                  {bestMatch.category}
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-foreground font-heading leading-tight mb-2">
                  {bestMatch.name}
                </h2>
                <p className="text-xl text-secondary font-medium italic">
                  "{bestMatch.description}"
                </p>
             </div>

             {/* The "Why" Section */}
             <div className="bg-stone-50 rounded-2xl p-6 mb-8 border border-stone-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-yellow-500 flex-shrink-0 mt-1" size={20} />
                  <p className="text-muted leading-relaxed">
                    {whyItFits}
                  </p>
                </div>
             </div>

             {/* Compatibility Icons */}
             <div className="flex gap-6 mb-8">
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                   <Home size={20} />
                 </div>
                 <span className="text-xs font-bold text-muted uppercase tracking-wider">{bestMatch.tags.space}</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-xl flex items-center justify-center">
                   <Zap size={20} />
                 </div>
                 <span className="text-xs font-bold text-muted uppercase tracking-wider">{bestMatch.tags.time} Time</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center">
                   <DollarSign size={20} />
                 </div>
                 <span className="text-xs font-bold text-muted uppercase tracking-wider">{bestMatch.tags.budget} Cost</span>
               </div>
             </div>

             <div className="flex gap-4">
               <button className="flex-1 bg-secondary text-white font-bold py-4 rounded-xl shadow-lg hover:bg-[#D9A588] transition-colors flex items-center justify-center gap-2">
                 <Share2 size={20} /> Share My Match
               </button>
             </div>
          </div>
        </div>

        {/* Beta Notice */}
        <div className="bg-primary/5 p-4 text-center border-t border-primary/10">
          <p className="text-sm text-primary font-medium">
            ℹ️ Breed database is in beta. More furry friends coming soon!
          </p>
        </div>
      </motion.div>

      {/* Starter Kit Section (Ads) */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-center"
      >
        <h3 className="text-2xl font-bold text-foreground font-heading mb-8">
          Recommended Essentials
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {MOCK_PRODUCTS.map((product, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl shadow-md border border-stone-50 flex items-center gap-6 hover:shadow-lg transition-shadow text-left cursor-pointer group">
              <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                {product.image}
              </div>
              <div>
                <h4 className="text-lg font-bold text-foreground">{product.name}</h4>
                <p className="text-muted text-sm mb-2">Perfect for {bestMatch.name}s</p>
                <span className="text-primary font-bold">{product.price}</span>
              </div>
              <div className="ml-auto bg-stone-100 p-2 rounded-full text-stone-400 group-hover:bg-primary group-hover:text-white transition-colors">
                <ShoppingBag size={20} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Footer Actions */}
      <div className="mt-16 text-center pb-10">
        <button 
          onClick={handleStartOver}
          className="text-muted hover:text-foreground font-bold flex items-center justify-center gap-2 mx-auto transition-colors"
        >
          <RotateCcw size={16} /> Start Over
        </button>

        {/* Feedback Section */}
        <div className="mt-8 pt-8 border-t border-stone-200 max-w-md mx-auto">
          <p className="text-sm text-muted mb-4">Was this match accurate?</p>
          {feedbackScore === null ? (
            <div className="flex justify-center gap-4">
              <button onClick={() => handleFeedback(1)} className="p-3 rounded-full bg-white shadow-sm border border-stone-200 hover:border-red-300 hover:text-red-500 transition-colors">
                <ThumbsDown size={20} />
              </button>
              <button onClick={() => handleFeedback(5)} className="p-3 rounded-full bg-white shadow-sm border border-stone-200 hover:border-green-300 hover:text-green-500 transition-colors">
                <ThumbsUp size={20} />
              </button>
            </div>
          ) : (
            <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded-full">Thanks for your feedback!</span>
          )}
        </div>
      </div>
    </div>
  );
}
