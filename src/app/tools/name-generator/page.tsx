'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dog, Cat, Sparkles, Copy, Check, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

interface GeneratedName {
  name: string;
  meaning: string;
}

const STYLES = [
  { id: 'cute', label: 'Cute & Sweet', emoji: '🍬' },
  { id: 'cool', label: 'Cool & Edgy', emoji: '😎' },
  { id: 'funny', label: 'Funny / Punny', emoji: '🤪' },
  { id: 'royal', label: 'Royal & Noble', emoji: '👑' },
  { id: 'mythical', label: 'Mythical', emoji: '🦄' },
  { id: 'food', label: 'Foodie', emoji: '🍕' },
  { id: 'nature', label: 'Nature', emoji: '🌿' },
];

export default function NameGeneratorPage() {
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog');
  const [gender, setGender] = useState<'boy' | 'girl' | 'unisex'>('unisex');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<GeneratedName[]>([]);
  const [error, setError] = useState('');

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId);
      }
      if (prev.length >= 3) return prev; // Limit to 3 styles
      return [...prev, styleId];
    });
  };

  const handleGenerate = async () => {
    if (selectedStyles.length === 0) {
      setError('Please select at least one vibe!');
      return;
    }
    setError('');
    setIsLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/generate-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petType,
          gender,
          style: selectedStyles.join(', '),
          description,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate names');

      const data = await response.json();
      setResults(data.names);
    } catch (err) {
      console.error(err);
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-600 mb-6 transition-colors font-medium">
             <ArrowLeft size={16} /> Back to Home
          </Link>
          <div className="flex justify-center mb-4">
             <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-2xl">
               <Sparkles className="text-secondary w-8 h-8" />
             </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4 text-stone-900">
            AI Pet Name Generator
          </h1>
          <p className="text-xl text-stone-500 font-light">
            Find the perfect name for your furry soulmate.
          </p>
        </div>

        {/* Results Section */}
        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-900 font-heading mb-2">
                  ✨ Perfect Matches Found!
                </h2>
                <p className="text-stone-500">Click the copy icon to save your favorites.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((result, index) => (
                  <NameCard key={index} result={result} index={index} />
                ))}
              </div>

              {/* Amazon CTA: Make it Official */}
              <AmazonTagCTA petType={petType} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Generator Form */}
        <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 p-6 md:p-10 mb-12">
          
          {/* 1. Pet Type */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">
              I have a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPetType('dog')}
                className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  petType === 'dog'
                    ? 'border-secondary bg-secondary/5 text-secondary'
                    : 'border-stone-100 hover:border-stone-200 text-stone-400'
                }`}
              >
                <Dog size={32} />
                <span className="font-bold text-lg">Dog</span>
              </button>
              <button
                onClick={() => setPetType('cat')}
                className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center gap-3 ${
                  petType === 'cat'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-stone-100 hover:border-stone-200 text-stone-400'
                }`}
              >
                <Cat size={32} />
                <span className="font-bold text-lg">Cat</span>
              </button>
            </div>
          </div>

          {/* 2. Gender */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">
              Gender
            </label>
            <div className="flex bg-stone-100 p-1 rounded-xl">
              {(['boy', 'girl', 'unisex'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
                    gender === g
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  {g === 'unisex' ? 'Surprise Me' : g}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Vibe/Style */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">
              Vibe (Pick up to 3)
            </label>
            <div className="flex flex-wrap gap-3">
              {STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => toggleStyle(style.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all duration-200 ${
                    selectedStyles.includes(style.id)
                      ? 'border-stone-800 bg-stone-800 text-white'
                      : 'border-stone-200 bg-white text-stone-500 hover:border-stone-300'
                  }`}
                >
                  <span className="mr-2">{style.emoji}</span>
                  {style.label}
                </button>
              ))}
            </div>
            {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}
          </div>

          {/* 4. Description (Optional) */}
          <div className="mb-10">
            <label className="block text-sm font-bold text-stone-400 uppercase tracking-wider mb-4">
              Describe your pet (Optional)
            </label>
            <textarea
              className="w-full p-4 rounded-2xl border-2 border-stone-100 focus:border-stone-800 focus:ring-0 transition-colors resize-none"
              rows={3}
              placeholder="e.g. Has white socks, loves to sleep, very energetic..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full bg-[#8DA399] text-white text-xl font-bold py-5 rounded-2xl shadow-lg hover:bg-[#7A9187] disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <Sparkles className="animate-spin" /> Thinking...
              </>
            ) : (
              <>
                Generate Names <Sparkles size={20} />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function NameCard({ result, index }: { result: GeneratedName; index: number }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow relative group"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-2xl font-bold text-stone-800 mb-1 font-heading">
            {result.name}
          </h3>
          <p className="text-stone-500 text-sm leading-relaxed">
            {result.meaning}
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="p-2 text-stone-300 hover:text-secondary transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
    </motion.div>
  );
}

function AmazonTagCTA({ petType }: { petType: 'dog' | 'cat' }) {
  const getSearchTerm = () => {
    if (petType === 'dog') return 'custom+dog+tags+engraved';
    if (petType === 'cat') return 'custom+cat+collar+with+name';
    return 'custom+pet+id+tags';
  };

  const searchTerm = getSearchTerm();
  const amazonLink = `https://www.amazon.com/s?k=${searchTerm}&tag=soulmatepaw01-20`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8 flex justify-center"
    >
      <a 
        href={amazonLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-full py-3 px-6 hover:shadow-md transition-all hover:bg-amber-100 max-w-lg w-full sm:w-auto"
      >
        <div className="bg-amber-100 p-2 rounded-full text-amber-600 group-hover:scale-110 transition-transform flex-shrink-0">
          <Tag size={20} />
        </div>
        <div className="flex-1 text-left">
           <h4 className="font-bold text-amber-900 text-sm md:text-base leading-tight">Love one of these names? Make it official!</h4>
           <p className="text-amber-700 text-xs md:text-sm">Get a custom engraved tag for your new friend.</p>
        </div>
        <div className="text-amber-600 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform whitespace-nowrap">
           Customize <span className="hidden sm:inline">on Amazon</span> ➔
        </div>
      </a>
    </motion.div>
  );
}
