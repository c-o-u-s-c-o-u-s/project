import { ReactNode } from 'react';

export type BudgetCategory = {
  name: string;
  percentage: number;
  icon: string;
  description: string;
};

export type PlanningMode = 'quick' | 'personalized';

export type WeddingStyle = 'intimate' | 'traditional' | 'luxury' | 'destination' | 'custom';

export type UserProgress = {
  step: number;
  xp: number;
  level: number;
  achievements: string[];
};

export type BudgetData = {
  totalBudget: number;
  guestCount: number;
  style: WeddingStyle;
  categories: Record<string, number>;
  email?: string;
};

export type BudgetRange = {
  label: string;
  min: number;
  max: number;
  average: number;
};

export type GuestRange = {
  label: string;
  min: number;
  max: number;
  average: number;
};

export type WeddingStyleOption = {
  id: WeddingStyle;
  label: string;
  description: string;
  icon: string;
};

export type SeasonOption = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type VenueOption = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export type Reward = {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'template' | 'discount';
  code?: string;
  claimed: boolean;
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward?: Reward;
};

export type ActiveDiscount = {
  option: string;
  expiresAt: number;
  code: string;
};