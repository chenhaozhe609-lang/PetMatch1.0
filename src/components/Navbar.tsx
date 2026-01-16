'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  DollarSign,
  BookOpen,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Find Soulmate', href: '/match', icon: Heart, highlight: true },
  ];

  const toolsLinks = [
    { name: 'Name Generator', href: '/tools/name-generator', icon: Sparkles },
    { name: 'Cost Calculator', href: '/tools/cost-calculator', icon: DollarSign },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-secondary text-white p-2 rounded-xl shadow-sm group-hover:scale-105 transition-transform">
            <Heart size={20} fill="currentColor" className="text-white" />
          </div>
          <span className="text-xl font-bold text-foreground tracking-tight font-heading">SoulmatePaw</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {/* Find Soulmate */}
          <Link
            href="/match"
            className={cn(
              "text-sm font-bold transition-colors flex items-center gap-2",
              pathname === '/match' ? "text-primary" : "text-foreground hover:text-primary"
            )}
          >
            Find Soulmate
          </Link>



          {/* Tools Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
            ref={dropdownRef}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm font-bold transition-colors focus:outline-none py-2",
                pathname.startsWith('/tools') || isToolsOpen ? "text-secondary" : "text-foreground hover:text-secondary"
              )}
            >
              Tools
              <ChevronDown
                size={14}
                className={cn("transition-transform duration-200", isToolsOpen ? "rotate-180" : "")}
              />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden p-2"
                >
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 transition-colors group"
                    >
                      <div className="p-2 bg-stone-100 rounded-lg text-stone-500 group-hover:bg-secondary/10 group-hover:text-secondary transition-colors">
                        <tool.icon size={18} />
                      </div>
                      <span className="text-sm font-bold text-foreground group-hover:text-secondary transition-colors">
                        {tool.name}
                      </span>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground hover:bg-stone-100 rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-stone-100 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-6">
              {/* Main Links */}
              <div className="space-y-4">
                <Link
                  href="/match"
                  className="flex items-center gap-3 text-lg font-bold text-foreground hover:text-primary transition-colors"
                >
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Heart size={20} />
                  </div>
                  Find Soulmate
                </Link>
              </div>

              {/* Tools Section (Expanded by default) */}
              <div className="pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Tools</p>
                <div className="space-y-3 pl-2">
                  {toolsLinks.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      className="flex items-center gap-3 text-base font-medium text-foreground hover:text-secondary transition-colors"
                    >
                      <div className="p-1.5 bg-stone-100 rounded-md text-stone-500">
                        <tool.icon size={16} />
                      </div>
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
