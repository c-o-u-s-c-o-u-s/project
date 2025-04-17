import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Zap, HelpCircle } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Tooltip } from './Tooltip';

export const GameProgress: React.FC = () => {
  const { xp, level, achievements } = useGameStore();
  const xpForNextLevel = level * 100;
  const xpProgress = (xp % 100) / 100;
  const xpNeeded = xpForNextLevel - (xp % 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-4 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <Tooltip
          content={
            <div className="space-y-1">
              <p>Current Level: {level}</p>
              <p>{xpNeeded} XP needed for next level</p>
            </div>
          }
        >
          <div className="flex items-center gap-2 cursor-help">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-medium text-gray-800">Level {level}</span>
          </div>
        </Tooltip>
        <Tooltip content="Experience points earned from completing tasks">
          <div className="flex items-center gap-2 cursor-help">
            <Zap className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-gray-800">{xp} XP</span>
          </div>
        </Tooltip>
      </div>

      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
        <Tooltip content={`${Math.round(xpProgress * 100)}% to next level`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${xpProgress * 100}%` }}
            className="absolute top-0 left-0 h-full bg-blue-500 cursor-help"
            transition={{ duration: 0.5 }}
          />
        </Tooltip>
      </div>

      {achievements.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-800 mb-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="font-medium">Recent Achievements</span>
            <Tooltip content="Unlock achievements by completing wedding planning milestones">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement) => (
              <Tooltip key={achievement.id} content={achievement.description}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full text-sm cursor-help"
                >
                  <span>{achievement.icon}</span>
                  <span className="text-gray-700">{achievement.name}</span>
                </motion.div>
              </Tooltip>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};