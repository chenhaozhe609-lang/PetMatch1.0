'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Heart, Brain, Search, ArrowRight, Home, Dog } from 'lucide-react';

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-main">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex justify-between items-center z-50 relative">
        <div className="flex items-center gap-3">
          <div className="bg-secondary text-white p-3 rounded-2xl shadow-sm">
            <Heart size={24} fill="currentColor" className="text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground tracking-tight font-heading">PetMatch</span>
        </div>
        <Link 
          href="/match"
          className="hidden md:inline-flex items-center text-muted hover:text-secondary font-bold transition-colors"
        >
          Start Quiz
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center px-6 pt-10 pb-20 relative overflow-hidden">
        
        {/* Soft Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#FDFCF8] to-[#F0F4F2] -z-10"></div>

        {/* Decorative Blob */}
        <div className="absolute top-10 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[100px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] -z-10"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto relative z-10"
        >
          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold text-foreground mb-6 tracking-tight leading-[1.1] font-heading"
          >
            Meet the pet who <br/>
            <span className="text-primary">truly gets you.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-muted mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Stop guessing. Let our AI & Psychology model find a companion tailored to your personality and lifestyle.
          </motion.p>

          <motion.div variants={itemVariants}>
            <Link 
              href="/match" 
              className="group inline-flex items-center justify-center gap-3 bg-secondary text-white text-lg font-bold py-5 px-12 rounded-full hover:bg-[#D9A588] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              Find My Soulmate
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 w-full"
        >
          {/* Card 1 */}
          <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-gray-50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-blue-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-6 mx-auto">
              <Brain size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">Personality First</h3>
            <p className="text-muted leading-relaxed">We use the Big Five model to match your vibe with your future pet's energy.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-gray-50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-green-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary mb-6 mx-auto">
              <Home size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">Reality Check</h3>
            <p className="text-muted leading-relaxed">We ensure your new friend fits your budget, living space, and daily schedule.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-gray-50 hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="bg-orange-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-secondary mb-6 mx-auto">
              <Dog size={32} />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">Breed Specifics</h3>
            <p className="text-muted leading-relaxed">Get detailed recommendations for specific breeds, not just generic categories.</p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-12 text-center">
        <p className="text-muted text-sm font-medium">
          Made with <Heart size={16} className="inline text-secondary mx-1 fill-current" /> for pets worldwide.
        </p>
      </footer>
    </div>
  );
}
