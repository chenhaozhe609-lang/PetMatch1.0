'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useUserSession } from '@/context/UserSessionContext';
import { DecisionNode } from '@/types/database';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export default function DecisionFlow() {
  const { currentFlowId, handleFlowChoice, setSelectedCategory, resetSession } = useUserSession();
  const [node, setNode] = useState<DecisionNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(1); // Default slide right

  useEffect(() => {
    async function fetchNode() {
      setLoading(true);
      const { data, error } = await supabase
        .from('decision_nodes')
        .select('*')
        .eq('id', currentFlowId)
        .single();

      if (error) {
        console.error('Error fetching node:', error);
      } else {
        setNode(data as DecisionNode);
      }
      setLoading(false);
    }

    fetchNode();
  }, [currentFlowId]);

  const handleChoice = (nextId: string, label: string) => {
    setDirection(1); // Always move forward
    handleFlowChoice(nextId, label);
  };

  const handleContinue = () => {
    if (node && node.type === 'result' && node.final_result_pet_name) {
      setSelectedCategory(node.final_result_pet_name);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!node) {
    return <div className="text-center text-red-500 p-8">Node not found!</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 min-h-[500px] flex items-center justify-center">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={node.id}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/50"
        >
          {/* Header / Question Area */}
          <div className={clsx(
            "p-10 text-center",
            node.type === 'result' ? 'bg-green-50/50' : 'bg-white/50'
          )}>
            <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-tight">
              {node.text}
            </h2>
            
            {node.type === 'result' && (
              <div className="mt-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="inline-block p-4 bg-green-100 rounded-full mb-4 shadow-inner"
                >
                  <span className="text-4xl">🎉</span>
                </motion.div>
                <p className="text-xl text-green-700 font-medium">It's a Match!</p>
              </div>
            )}
          </div>

          {/* Action Area */}
          <div className="p-8 bg-gray-50/50 border-t border-gray-100">
            {node.type === 'question' && node.options && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {node.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(option.next_node_id, option.label)}
                    className="group relative flex flex-col items-center justify-center p-6 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-200 min-h-[100px]"
                  >
                    <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-600 text-center">
                      {option.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}

            {node.type === 'result' && (
              <div className="text-center">
                 <p className="text-gray-600 mb-6 text-lg">
                   You matched with: <strong className="text-gray-900 text-2xl ml-2">{node.final_result_pet_name}</strong>
                 </p>
                 
                 <div className="flex flex-col gap-3 mt-8">
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={handleContinue}
                     className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                   >
                     Continue to Find My Breed →
                   </motion.button>

                   <motion.button 
                     whileHover={{ scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={() => resetSession()}
                     className="w-full bg-white text-gray-500 font-medium py-3 px-6 rounded-xl border border-gray-200 hover:border-gray-400 hover:text-gray-700 transition-colors"
                   >
                     Not what I expected? Restart
                   </motion.button>
                 </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
