import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trophy } from 'lucide-react';
import { PlanningMode } from '../types';

type Props = {
  onModeSelect: (mode: PlanningMode) => void;
};

export const WelcomeScreen: React.FC<Props> = ({ onModeSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto text-center p-8"
    >
      <Heart className="w-16 h-16 mx-auto mb-6 text-pink-500" />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Wedding Budget Planner
      </h1>
      <p className="text-gray-600 mb-8">
        Let's create your perfect wedding budget together
      </p>
      
      <div className="space-y-4">
        <button
          onClick={() => onModeSelect('quick')}
          className="w-full py-4 px-6 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
        >
          Quick Estimate
        </button>
        <button
          onClick={() => onModeSelect('personalized')}
          className="w-full py-4 px-6 bg-white text-pink-500 border-2 border-pink-500 rounded-xl hover:bg-pink-50 transition-colors relative"
        >
          <div className="flex items-center justify-center gap-2">
            <span>Personalized Estimate</span>
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-xs text-gray-600 mt-1">
            Earn rewards & unlock exclusive planning guides
          </div>
        </button>
      </div>
    </motion.div>
  );
};