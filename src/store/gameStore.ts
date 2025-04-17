import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement, Reward, ActiveDiscount } from '../types';

interface GameState {
  xp: number;
  level: number;
  achievements: Achievement[];
  rewards: Reward[];
  activeDiscount: ActiveDiscount | null;
  claimedAchievements: string[];
  addXP: (amount: number) => void;
  unlockAchievement: (achievement: Achievement) => void;
  hasAchievement: (achievementId: string) => void;
  claimReward: (rewardId: string) => void;
  hasUnclaimedRewards: () => boolean;
  setActiveDiscount: (discount: ActiveDiscount | null) => void;
  clearActiveDiscount: () => void;
  hasClaimedAchievement: (achievementId: string) => boolean;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      achievements: [],
      rewards: [],
      activeDiscount: null,
      claimedAchievements: [],
      addXP: (amount) =>
        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          return {
            xp: newXP,
            level: newLevel,
          };
        }),
      hasAchievement: (achievementId: string) => {
        return get().achievements.some(a => a.id === achievementId);
      },
      unlockAchievement: (achievement) =>
        set((state) => {
          if (state.achievements.some(a => a.id === achievement.id)) {
            return state;
          }
          
          const rewards = [...state.rewards];
          if (achievement.reward) {
            rewards.push(achievement.reward);
          }

          return {
            achievements: [...state.achievements, achievement],
            rewards,
            xp: state.xp + 50,
          };
        }),
      claimReward: (rewardId) =>
        set((state) => ({
          rewards: state.rewards.map((reward) =>
            reward.id === rewardId ? { ...reward, claimed: true } : reward
          ),
          claimedAchievements: [...state.claimedAchievements, rewardId]
        })),
      hasUnclaimedRewards: () => {
        const state = get();
        return state.rewards.some((reward) => !reward.claimed) && 
               !state.claimedAchievements.includes('budget_master');
      },
      setActiveDiscount: (discount) => set({ activeDiscount: discount }),
      clearActiveDiscount: () => set({ activeDiscount: null }),
      hasClaimedAchievement: (achievementId: string) => {
        return get().claimedAchievements.includes(achievementId);
      }
    }),
    {
      name: 'wedding-planner-storage',
    }
  )
);