import React, { useState, useEffect } from 'react';
import { Wheel } from 'react-custom-roulette';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Download, X, Gift, ExternalLink } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { Modal } from '@mantine/core';

const wheelData = [
  { option: '5% OFF', style: { backgroundColor: '#FF6B6B', textColor: 'white' } },
  { option: '15% OFF', style: { backgroundColor: '#4ECDC4', textColor: 'white' } },
  { option: '25% OFF', style: { backgroundColor: '#45B7D1', textColor: 'white' } },
  { option: 'Wedding Guide', style: { backgroundColor: '#96CEB4', textColor: 'white' } },
];

interface RewardWheelProps {
  onClose: () => void;
}

export const RewardWheel: React.FC<RewardWheelProps> = ({ onClose }) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const { setActiveDiscount, claimReward } = useGameStore();

  useEffect(() => {
    let timer: number;
    if (showReward && wheelData[prizeNumber].option.includes('OFF')) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showReward, prizeNumber]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinStop = () => {
    setShowReward(true);
    claimReward('budget_master');
    if (wheelData[prizeNumber].option.includes('OFF')) {
      const discount = wheelData[prizeNumber].option;
      const code = `WEDDING${discount.replace('%', '').replace(' OFF', '')}`;
      setActiveDiscount({
        option: discount,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
        code,
      });
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      size="lg"
      radius="lg"
      centered
      withCloseButton={false}
      scrollAreaComponent={Modal.NativeScrollArea}
      classNames={{
        body: 'p-0',
        content: 'rounded-2xl overflow-hidden',
        inner: 'p-4',
      }}
    >
      <div className="p-4 sm:p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <AnimatePresence mode="wait">
          {!showReward ? (
            <motion.div
              key="wheel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
                Spin the Wheel of Rewards!
              </h3>
              <div className="flex justify-center mb-6">
                <div className="w-full max-w-[280px] sm:max-w-[320px] aspect-square">
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={wheelData}
                    onStopSpinning={handleSpinStop}
                    backgroundColors={wheelData.map(item => item.style.backgroundColor)}
                    textColors={wheelData.map(item => item.style.textColor)}
                    outerBorderColor="#ccc"
                    outerBorderWidth={2}
                    innerRadius={20}
                    radiusLineColor="#ddd"
                    radiusLineWidth={1}
                  />
                </div>
              </div>
              <button
                onClick={handleSpinClick}
                disabled={mustSpin}
                className="w-full sm:w-auto py-3 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors disabled:bg-gray-300"
              >
                SPIN
              </button>
            </motion.div>
          ) : wheelData[prizeNumber].option.includes('OFF') ? (
            <motion.div
              key="discount"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Gift className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                You've won {wheelData[prizeNumber].option}!
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
                  <Timer className="w-4 h-4" />
                  <span>Offer expires in {formatTime(timeLeft)}</span>
                </div>
                <code className="block font-mono text-lg font-medium text-pink-600 bg-white p-3 rounded border border-gray-200 mb-4 break-all">
                  WEDDING{wheelData[prizeNumber].option.replace('%', '').replace(' OFF', '')}
                </code>
                <div className="bg-pink-50 p-3 rounded-lg space-y-2 text-left">
                  <h4 className="font-medium text-pink-900">How to use your discount:</h4>
                  <ol className="text-sm text-pink-800 space-y-2">
                    <li className="flex items-start gap-2">
                      1. Visit{' '}
                      <a
                        href="https://www.photographeroymontreal.ca/nos-forfaits"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-700 underline inline-flex items-center gap-1 break-all"
                      >
                        photographeroymontreal.ca
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </li>
                    <li>2. Choose your wedding photography package</li>
                    <li>
                      3. Enter code{' '}
                      <span className="font-mono font-medium">
                        WEDDING{wheelData[prizeNumber].option.replace('%', '').replace(' OFF', '')}
                      </span>{' '}
                      at checkout
                    </li>
                  </ol>
                  <p className="text-xs text-pink-700 mt-2">
                    * Discount valid for 15 minutes from time of issue
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                Claim Reward
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="guide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <Gift className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-gray-600 mb-6">
                You've won our exclusive Wedding Planning Guide!
              </p>
              <button
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-3 px-6 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors w-full"
              >
                <Download className="w-4 h-4" />
                <span>Download Guide</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Modal>
  );
};