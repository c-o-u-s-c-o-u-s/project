import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, ChevronRight, ArrowLeft } from 'lucide-react';
import { BudgetBreakdown } from './BudgetBreakdown';
import { budgetRanges, guestRanges, defaultCategories } from '../constants';
import { BudgetRange, GuestRange } from '../types';

export const QuickEstimate: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<GuestRange | null>(null);
  const [customBudget, setCustomBudget] = useState('');
  const [customGuests, setCustomGuests] = useState('');
  const [isCustomBudget, setIsCustomBudget] = useState(false);
  const [isCustomGuests, setIsCustomGuests] = useState(false);

  const getBudgetValue = () => {
    if (isCustomBudget) return Number(customBudget);
    return selectedBudget?.average || 0;
  };

  const getGuestValue = () => {
    if (isCustomGuests) return Number(customGuests);
    return selectedGuests?.average || 0;
  };

  if (step === 3) {
    return (
      <BudgetBreakdown
        budget={getBudgetValue()}
        guests={getGuestValue()}
        categories={defaultCategories}
      />
    );
  }

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep(step - 1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <div className="text-sm font-medium text-gray-500">
            Step {step} of 2
          </div>
        </div>
        <div className="flex gap-1">
          <div className={`h-1 w-12 rounded ${step >= 1 ? 'bg-pink-500' : 'bg-gray-200'}`} />
          <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-pink-500' : 'bg-gray-200'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          custom={step}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
        >
          {step === 1 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-pink-500" />
                What's your budget?
              </h3>
              <div className="space-y-2">
                {budgetRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setSelectedBudget(range);
                      setIsCustomBudget(false);
                      setStep(2);
                    }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedBudget === range
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{range.label}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomBudget(true)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isCustomBudget
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Custom Budget</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
                {isCustomBudget && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={customBudget}
                      onChange={(e) => setCustomBudget(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customBudget) {
                          setStep(2);
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter amount"
                      required
                    />
                    <button
                      onClick={() => customBudget && setStep(2)}
                      className="w-full mt-2 py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300"
                      disabled={!customBudget}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                How many guests?
              </h3>
              <div className="space-y-2">
                {guestRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setSelectedGuests(range);
                      setIsCustomGuests(false);
                      setStep(3);
                    }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedGuests === range
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{range.label}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </button>
                ))}
                <button
                  onClick={() => setIsCustomGuests(true)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    isCustomGuests
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Custom Guest Count</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </button>
                {isCustomGuests && (
                  <div className="mt-3">
                    <input
                      type="number"
                      value={customGuests}
                      onChange={(e) => setCustomGuests(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customGuests) {
                          setStep(3);
                        }
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Enter guest count"
                      required
                    />
                    <button
                      onClick={() => customGuests && setStep(3)}
                      className="w-full mt-2 py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300"
                      disabled={!customGuests}
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};