import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DollarSign, Users, ChevronRight, ArrowLeft, Calendar, Home, Sparkles, Gift } from 'lucide-react';
import { BudgetBreakdown } from './BudgetBreakdown';
import { GameProgress } from './GameProgress';
import { budgetRanges, guestRanges, defaultCategories, weddingStyles, seasons, venues, achievements } from '../constants';
import { BudgetRange, GuestRange, WeddingStyleOption, SeasonOption, VenueOption } from '../types';
import { useGameStore } from '../store/gameStore';
import useWindowSize from 'react-use/lib/useWindowSize';
import Confetti from 'react-confetti';

export const PersonalizedEstimate: React.FC = () => {
  const { width, height } = useWindowSize();
  const [step, setStep] = useState(1);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRange | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<GuestRange | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<WeddingStyleOption | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<SeasonOption | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<VenueOption | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState(200);
  const [showGameProgress, setShowGameProgress] = useState(true);
  const [showCongratulations, setShowCongratulations] = useState(false);
  
  const { addXP, unlockAchievement, hasAchievement } = useGameStore();

  useEffect(() => {
    if (step > 1) {
      addXP(20);
    }
  }, [step, addXP]);

  useEffect(() => {
    if (showConfetti) {
      setConfettiPieces(200);
      const timer = setInterval(() => {
        setConfettiPieces((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            setShowConfetti(false);
            return 0;
          }
          return prev - 10;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [showConfetti]);

  const getBudgetValue = () => selectedBudget?.average || 0;
  const getGuestValue = () => selectedGuests?.average || 0;

  const handleComplete = () => {
    setShowConfetti(true);
    setShowCongratulations(true);
    
    if (!hasAchievement(achievements[0].id)) {
      unlockAchievement(achievements[0]);
      addXP(100);
    }
  };

  const handleContinueToBudget = () => {
    setShowCongratulations(false);
    setStep(6);
  };

  if (showCongratulations) {
    return (
      <>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={confettiPieces}
            recycle={false}
            gravity={0.2}
            tweenDuration={4000}
            colors={['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093']}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center p-8"
        >
          <Gift className="w-16 h-16 mx-auto mb-6 text-pink-500" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Congratulations! 🎉
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            You've completed your personalized wedding budget plan! As a reward, you've earned a spin at our reward wheel.
          </p>
          <div className="space-y-4">
            <button
              onClick={handleContinueToBudget}
              className="w-full py-4 px-6 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
            >
              View Your Budget Breakdown
            </button>
            <p className="text-sm text-gray-500">
              You'll find your reward spin opportunity in the budget overview
            </p>
          </div>
        </motion.div>
      </>
    );
  }

  if (step === 6) {
    return (
      <>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            numberOfPieces={confettiPieces}
            recycle={false}
            gravity={0.2}
            tweenDuration={4000}
            colors={['#FF69B4', '#FFB6C1', '#FFC0CB', '#FF1493', '#DB7093']}
          />
        )}
        <BudgetBreakdown
          budget={getBudgetValue()}
          guests={getGuestValue()}
          categories={defaultCategories}
          onEmailSubmit={() => setShowGameProgress(false)}
        />
      </>
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
      {showGameProgress && <GameProgress />}
      
      <div className="mb-4 flex justify-between items-center">
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
            Step {step}/5
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`h-1 w-6 rounded-sm ${
                step >= s ? 'bg-pink-500' : 'bg-gray-200'
              }`}
            />
          ))}
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
          {step === 1 && (
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
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                Guest Count
              </h3>
              <div className="space-y-2">
                {guestRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => {
                      setSelectedGuests(range);
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
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Wedding Style
              </h3>
              <div className="space-y-2">
                {weddingStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => {
                      setSelectedStyle(style);
                      setStep(4);
                    }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedStyle === style
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{style.label}</span>
                        <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-500" />
                Preferred Season
              </h3>
              <div className="space-y-2">
                {seasons.map((season) => (
                  <button
                    key={season.id}
                    onClick={() => {
                      setSelectedSeason(season);
                      setStep(5);
                    }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedSeason === season
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{season.label}</span>
                        <p className="text-sm text-gray-500 mt-1">{season.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                <Home className="w-5 h-5 text-pink-500" />
                Venue Type
              </h3>
              <div className="space-y-2">
                {venues.map((venue) => (
                  <button
                    key={venue.id}
                    onClick={() => {
                      setSelectedVenue(venue);
                      handleComplete();
                    }}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      selectedVenue === venue
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-pink-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{venue.label}</span>
                        <p className="text-sm text-gray-500 mt-1">{venue.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};