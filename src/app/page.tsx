'use client';

import { motion, Variants } from 'framer-motion';
import { Heart, Brain, ArrowRight, Home, Dog, Cat, Sparkles, CheckCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const { setSelectedCategory, resetSession } = useQuiz();
  const router = useRouter();

  const handleStartQuiz = (category?: string) => {
    resetSession();
    if (category) {
      setSelectedCategory(category);
    }
    router.push('/match');
  };

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
        <button 
          onClick={() => handleStartQuiz()}
          className="hidden md:inline-flex items-center text-muted hover:text-secondary font-bold transition-colors"
        >
          Start Quiz
        </button>
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

          <motion.div variants={itemVariants} className="flex flex-col items-center gap-8">
            {/* Main CTA */}
            <motion.button 
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              onClick={() => handleStartQuiz()}
              className="group inline-flex items-center justify-center gap-3 bg-secondary text-white text-lg font-bold py-5 px-12 rounded-full hover:bg-[#D9A588] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              I'm not sure – Help me choose! ✨
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            {/* Direct Access Section */}
            <div className="mt-8">
              <p className="text-muted mb-6 font-medium text-lg">Or find your perfect match within:</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                {/* Dog Option */}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => handleStartQuiz('Dog')}
                  className="group flex items-center gap-4 bg-white px-8 py-6 rounded-3xl shadow-md border border-stone-100 hover:shadow-xl hover:border-secondary/20 transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  <div className="bg-orange-50 p-3 rounded-2xl text-secondary group-hover:scale-110 transition-transform">
                    <Dog size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-foreground">Dog Breeds</h3>
                    <p className="text-sm text-muted">Loyal companions</p>
                  </div>
                </motion.button>

                {/* Cat Option */}
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  onClick={() => handleStartQuiz('Cat')}
                  className="group flex items-center gap-4 bg-white px-8 py-6 rounded-3xl shadow-md border border-stone-100 hover:shadow-xl hover:border-primary/20 transition-all hover:-translate-y-1 w-full sm:w-auto"
                >
                  <div className="bg-blue-50 p-3 rounded-2xl text-primary group-hover:scale-110 transition-transform">
                    <Cat size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-foreground">Cat Breeds</h3>
                    <p className="text-sm text-muted">Independent spirits</p>
                  </div>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Section 1: How it Works */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 max-w-6xl mx-auto px-4 w-full"
        >
          <div className="text-center mb-16">
             <span className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-4 inline-block">Process</span>
             <h2 className="text-3xl md:text-5xl font-extrabold text-foreground font-heading">Finding your soulmate is science, not luck.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-stone-50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-blue-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-blue-500 mb-6 mx-auto">
                <Brain size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">The Psychology</h3>
              <p className="text-muted leading-relaxed">We analyze your Big 5 Personality traits to understand your emotional needs.</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-stone-50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-green-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-primary mb-6 mx-auto">
                <Home size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">The Lifestyle</h3>
              <p className="text-muted leading-relaxed">We cross-reference your budget, space, and free time with 50+ breeds.</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-10 rounded-[2rem] shadow-lg border border-stone-50 hover:shadow-xl transition-all hover:-translate-y-1">
              <div className="bg-orange-50 w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-secondary mb-6 mx-auto">
                <Sparkles size={32} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4 font-heading">The Match</h3>
              <p className="text-muted leading-relaxed">Our AI algorithm finds the pet that fits your soul and your life.</p>
            </div>
          </div>
        </motion.section>

        {/* Section 2: Why Choose SoulmatePaw? */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 w-full bg-[#E8EFE9] py-24 px-6 rounded-[3rem]"
        >
           <div className="max-w-4xl mx-auto text-center">
             <span className="bg-white text-primary font-bold px-4 py-2 rounded-full text-sm uppercase tracking-wider mb-6 inline-block shadow-sm">Our Mission</span>
             <h2 className="text-3xl md:text-5xl font-extrabold text-foreground font-heading mb-8">More than just a cute face.</h2>
             <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light mb-10">
               We don't just recommend popular breeds. We find compatible companions. 
               Too many pets are returned because of lifestyle mismatches. 
               <br/><br/>
               <span className="font-bold text-primary">Stop rehoming pets. Start finding the one that stays.</span>
             </p>
             <div className="flex flex-col md:flex-row justify-center gap-6 text-left">
                <div className="flex items-center gap-3 bg-white/60 p-4 rounded-xl">
                  <CheckCircle className="text-primary" /> <span>Science-backed matching</span>
                </div>
                <div className="flex items-center gap-3 bg-white/60 p-4 rounded-xl">
                  <CheckCircle className="text-primary" /> <span>Focus on long-term happiness</span>
                </div>
             </div>
           </div>
        </motion.section>

        {/* Section 3: FAQ */}
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 max-w-4xl mx-auto px-6 w-full mb-20"
        >
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-extrabold text-foreground font-heading mb-4">Frequently Asked Questions</h2>
             <p className="text-muted">Everything you need to know about finding your pet soulmate.</p>
          </div>

          <div className="space-y-4">
             {/* FAQ Item 1 */}
             <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group">
               <details className="group p-6 cursor-pointer">
                 <summary className="flex justify-between items-center font-bold text-lg text-foreground list-none">
                   Is this personality test accurate?
                   <ChevronDown className="text-muted group-open:rotate-180 transition-transform" />
                 </summary>
                 <p className="text-muted mt-4 leading-relaxed">
                   Yes! Our quiz is based on the OCEAN (Big 5) psychological model, which is widely used in psychology to understand personality traits. We map these traits to breed characteristics for a scientifically grounded match.
                 </p>
               </details>
             </div>

             {/* FAQ Item 2 */}
             <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group">
               <details className="group p-6 cursor-pointer">
                 <summary className="flex justify-between items-center font-bold text-lg text-foreground list-none">
                   I live in a small apartment, can I get a dog?
                   <ChevronDown className="text-muted group-open:rotate-180 transition-transform" />
                 </summary>
                 <p className="text-muted mt-4 leading-relaxed">
                   Yes! We filter specifically for apartment-friendly breeds that thrive in smaller spaces. Size isn't the only factor—energy level matters too. We'll find you a low-energy or adaptable companion.
                 </p>
               </details>
             </div>

             {/* FAQ Item 3 */}
             <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden group">
               <details className="group p-6 cursor-pointer">
                 <summary className="flex justify-between items-center font-bold text-lg text-foreground list-none">
                   Do you support adoption?
                   <ChevronDown className="text-muted group-open:rotate-180 transition-transform" />
                 </summary>
                 <p className="text-muted mt-4 leading-relaxed">
                   Absolutely. We encourage checking local shelters for your matched breed or similar mixes. Many purebreds and specific mixes are waiting for homes in rescues right now.
                 </p>
               </details>
             </div>
          </div>
        </motion.section>
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
