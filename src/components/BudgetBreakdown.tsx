import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BudgetCategory } from '../types';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Mail, Gift, Download, X, ExternalLink, ChevronRight, Pencil } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { RewardWheel } from './RewardWheel';
import { DiscountReminder } from './DiscountReminder';
import { Modal, Button, TextInput, Slider, NumberInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

type Props = {
  budget: number;
  guests: number;
  categories: BudgetCategory[];
  onEmailSubmit?: () => void;
};

export const BudgetBreakdown: React.FC<Props> = ({ budget: initialBudget, guests, categories: initialCategories, onEmailSubmit }) => {
  const [budget, setBudget] = useState(initialBudget);
  const [categories, setCategories] = useState(initialCategories);
  const [email, setEmail] = useState('');
  const [showRewardWheel, setShowRewardWheel] = useState(false);
  const [emailModalOpened, { open: openEmailModal, close: closeEmailModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [editedPercentage, setEditedPercentage] = useState(0);
  const { rewards, claimReward, hasUnclaimedRewards } = useGameStore();

  const chartData = {
    labels: categories.map(cat => cat.name),
    datasets: [
      {
        data: categories.map(cat => (budget * cat.percentage) / 100),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
          '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        borderWidth: 0,
        hoverBorderWidth: 0
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#1F2937',
        bodyColor: '#1F2937',
        bodyFont: { size: 14 },
        padding: 12,
        boxPadding: 6,
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const percentage = context.dataset.data[context.dataIndex];
            return ` $${value.toLocaleString()} (${(percentage / budget * 100).toFixed(1)}%)`;
          }
        }
      }
    },
    cutout: '70%',
    radius: '90%',
    responsive: true,
    maintainAspectRatio: true
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    closeEmailModal();
    onEmailSubmit?.();
  };

  const handleExportClick = () => {
    if (email) {
      navigator.clipboard.writeText(
        `Wedding Budget Breakdown\n\nTotal: $${budget.toLocaleString()}\nGuests: ${guests}\n\n${categories
          .map(cat => `${cat.name}: $${((budget * cat.percentage) / 100).toLocaleString()} (${cat.percentage}%)`)
          .join('\n')}`
      );
    } else {
      openEmailModal();
    }
  };

  const handleCategoryClick = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setEditedPercentage(category.percentage);
    openEditModal();
  };

  const handleSaveCategory = () => {
    if (!selectedCategory) return;

    const roundedPercentage = Math.round(editedPercentage);
    const remainingPercentage = 100 - roundedPercentage;
    const otherCategories = categories.filter(c => c.name !== selectedCategory.name);
    const totalOtherPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);

    let updatedCategories = categories.map(cat => {
      if (cat.name === selectedCategory.name) {
        return { ...cat, percentage: roundedPercentage };
      }
      const adjustmentFactor = remainingPercentage / totalOtherPercentage;
      return { ...cat, percentage: Math.round(cat.percentage * adjustmentFactor) };
    });

    const totalPercentage = updatedCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (totalPercentage !== 100) {
      const diff = 100 - totalPercentage;
      const largestCategory = updatedCategories
        .filter(cat => cat.name !== selectedCategory.name)
        .reduce((prev, curr) => prev.percentage > curr.percentage ? prev : curr);
      
      updatedCategories = updatedCategories.map(cat => {
        if (cat.name === largestCategory.name) {
          return { ...cat, percentage: cat.percentage + diff };
        }
        return cat;
      });
    }

    setCategories(updatedCategories);
    closeEditModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full"
    >
      <div className="bg-gradient-to-b from-pink-50 to-white py-8 sm:py-16 px-4 sm:px-6 lg:px-8 rounded-b-[2rem] sm:rounded-b-[3rem] mb-8 sm:mb-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Your Wedding Budget</h2>
          <p className="text-xl sm:text-2xl font-medium text-pink-600 mb-2">
            ${budget.toLocaleString()}
          </p>
          <p className="text-base sm:text-lg text-gray-600">{guests} Guests</p>
        </div>
      </div>

      {hasUnclaimedRewards() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8 sm:mb-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 sm:p-6 rounded-xl sm:rounded-2xl text-center mx-4 sm:mx-auto"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-2">🎉 You've Earned a Reward!</h3>
          <p className="mb-4">Spin the wheel to claim your exclusive wedding planning reward</p>
          <button
            onClick={() => setShowRewardWheel(true)}
            className="bg-white text-pink-500 py-2 sm:py-3 px-6 sm:px-8 rounded-lg sm:rounded-xl font-medium hover:bg-pink-50 transition-colors"
          >
            Claim Now
          </button>
        </motion.div>
      )}

      <div className="px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm p-4 sm:p-8 border border-gray-100">
              <div className="w-full max-w-[280px] sm:max-w-xs mx-auto mb-6 sm:mb-8 relative aspect-square">
                <Doughnut data={chartData} options={chartOptions} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">${budget.toLocaleString()}</p>
                    <p className="text-xs sm:text-sm text-gray-500">Total Budget</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                <button
                  onClick={handleExportClick}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-colors w-full sm:w-auto"
                >
                  <Download size={18} />
                  Save Breakdown
                </button>
                <button
                  onClick={openEmailModal}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-pink-600 border-2 border-pink-600 rounded-xl hover:bg-pink-50 transition-colors w-full sm:w-auto"
                >
                  <Mail size={18} />
                  Email
                </button>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {categories.map((category, index) => (
                <div
                  key={category.name}
                  onClick={() => handleCategoryClick(category)}
                  className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: chartData.datasets[0].backgroundColor[index] }}
                      />
                      <div className="min-w-0">
                        <h4 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors truncate">
                          {category.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-0.5 sm:mt-1 line-clamp-1">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 ml-3 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-base sm:text-xl font-semibold text-gray-900">
                          ${((budget * category.percentage) / 100).toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">{category.percentage}% of budget</p>
                      </div>
                      <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-pink-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal 
        opened={emailModalOpened} 
        onClose={closeEmailModal} 
        title="Get Your Budget Breakdown" 
        centered
        size="lg"
        radius="lg"
      >
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Stay on top of your wedding budget</h3>
          <p className="text-gray-600 mb-6">We'll send you a detailed breakdown and helpful planning tips.</p>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <TextInput
              required
              size="lg"
              radius="md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftSection={<Mail size={18} />}
            />
            <Button 
              type="submit" 
              fullWidth 
              size="lg"
              color="pink"
              radius="xl"
            >
              Send My Breakdown
            </Button>
          </form>
        </div>
      </Modal>

      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title={selectedCategory ? `Edit ${selectedCategory.name} Budget` : ''}
        centered
        size="lg"
        radius="lg"
      >
        <div className="p-4 space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Percentage of Total Budget
            </label>
            <Slider
              value={editedPercentage}
              onChange={setEditedPercentage}
              min={1}
              max={100}
              step={0.1}
              label={(value) => `${value}%`}
              size="lg"
              color="pink"
              className="mb-4"
            />
            <NumberInput
              value={Math.round((budget * editedPercentage) / 100)}
              onChange={(value) => setEditedPercentage((Number(value) / budget) * 100)}
              min={0}
              max={budget}
              size="lg"
              radius="md"
              prefix="$"
              thousandSeparator=","
              className="mb-2"
            />
            <p className="text-sm text-gray-500">
              Other categories will be adjusted proportionally
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSaveCategory}
              fullWidth
              size="lg"
              color="pink"
              radius="xl"
            >
              Save Changes
            </Button>
            <Button
              onClick={closeEditModal}
              fullWidth
              size="lg"
              variant="light"
              radius="xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {showRewardWheel && (
          <RewardWheel onClose={() => setShowRewardWheel(false)} />
        )}
      </AnimatePresence>

      <DiscountReminder onReopen={() => setShowRewardWheel(true)} />
    </motion.div>
  );
};