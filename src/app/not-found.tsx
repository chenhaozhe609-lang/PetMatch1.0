'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-8 relative"
            >
                <div className="text-9xl font-extrabold text-stone-100 font-heading select-none">
                    404
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl animate-bounce">🐶</span>
                </div>
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground font-heading mb-4">
                Uh-oh! This page went for a walk.
            </h1>

            <p className="text-lg text-muted max-w-md mb-10 leading-relaxed">
                We searched high and low, but we couldn't find the page you're looking for. It might have been adopted or moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
                >
                    <Home size={20} />
                    Go Home
                </Link>

                <Link
                    href="/match"
                    className="flex items-center justify-center gap-2 bg-white text-foreground border border-stone-200 px-8 py-3 rounded-full font-bold shadow-sm hover:bg-stone-50 transition-all"
                >
                    <Search size={20} />
                    Find a Pet
                </Link>
            </div>
        </div>
    );
}
