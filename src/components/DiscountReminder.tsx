import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

interface DiscountReminderProps {
  onReopen: () => void;
}

export const DiscountReminder: React.FC<DiscountReminderProps> = ({ onReopen }) => {
  const { activeDiscount, clearActiveDiscount } = useGameStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (activeDiscount) {
      const updateTimer = () => {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((activeDiscount.expiresAt - now) / 1000));
        setTimeLeft(remaining);

        if (remaining === 0) {
          clearActiveDiscount();
        }
      };

      updateTimer();
      const interval = setInterval(updateTimer, 1000);

      return () => clearInterval(interval);
    }
  }, [activeDiscount, clearActiveDiscount]);

  if (!activeDiscount || timeLeft === 0) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-40"
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm">
          <div
            className="flex items-center gap-2 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Timer className="w-4 h-4 text-pink-500" />
            <span className="text-sm font-medium text-gray-700">
              {activeDiscount.option} expires in {formatTime(timeLeft)}
            </span>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            )}
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="border-t border-gray-100"
              >
                <div className="p-3 space-y-3">
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <code className="font-mono text-sm font-medium text-pink-600">
                      {activeDiscount.code}
                    </code>
                  </div>

                  <AnimatePresence>
                    {showDetails ? (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-pink-50 p-3 rounded-lg space-y-2"
                      >
                        <h4 className="font-medium text-pink-900">How to use your discount:</h4>
                        <ol className="text-sm text-pink-800 space-y-2">
                          <li className="flex items-start gap-2">
                            1. Visit <a href="https://www.photographeroymontreal.ca/nos-forfaits" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700 underline inline-flex items-center gap-1">
                              photographeroymontreal.ca
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </li>
                          <li>2. Choose your wedding photography package</li>
                          <li>3. Enter code <span className="font-mono font-medium">{activeDiscount.code}</span> at checkout</li>
                        </ol>
                        <p className="text-xs text-pink-700 mt-2">
                          * Discount valid for 15 minutes from time of issue
                        </p>
                      </motion.div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetails(true);
                          }}
                          className="flex-1 py-2 px-3 bg-pink-500 text-white text-sm rounded hover:bg-pink-600 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearActiveDiscount();
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};