import { BudgetCategory, BudgetRange, GuestRange, WeddingStyleOption, SeasonOption, VenueOption, Achievement } from './types';

export const budgetRanges: BudgetRange[] = [
  {
    label: 'Intimate (Under $10k)',
    min: 5000,
    max: 10000,
    average: 7500
  },
  {
    label: 'Modest ($10k - $25k)',
    min: 10000,
    max: 25000,
    average: 17500
  },
  {
    label: 'Moderate ($25k - $50k)',
    min: 25000,
    max: 50000,
    average: 37500
  },
  {
    label: 'Luxury ($50k - $100k)',
    min: 50000,
    max: 100000,
    average: 75000
  },
  {
    label: 'Premium (Over $100k)',
    min: 100000,
    max: 250000,
    average: 175000
  }
];

export const guestRanges: GuestRange[] = [
  {
    label: 'Micro Wedding (Under 20)',
    min: 1,
    max: 20,
    average: 15
  },
  {
    label: 'Intimate (20-50)',
    min: 20,
    max: 50,
    average: 35
  },
  {
    label: 'Medium (50-100)',
    min: 50,
    max: 100,
    average: 75
  },
  {
    label: 'Large (100-200)',
    min: 100,
    max: 200,
    average: 150
  },
  {
    label: 'Grand (200+)',
    min: 200,
    max: 500,
    average: 300
  }
];

export const weddingStyles: WeddingStyleOption[] = [
  {
    id: 'intimate',
    label: 'Intimate & Cozy',
    description: 'Small, personal celebration focused on close relationships',
    icon: '🏡'
  },
  {
    id: 'traditional',
    label: 'Classic & Traditional',
    description: 'Timeless celebration with conventional elements',
    icon: '⛪'
  },
  {
    id: 'luxury',
    label: 'Luxury & Elegant',
    description: 'High-end, sophisticated celebration with premium details',
    icon: '✨'
  },
  {
    id: 'destination',
    label: 'Destination & Adventure',
    description: 'Unique location with a focus on experience',
    icon: '🌎'
  },
  {
    id: 'custom',
    label: 'Uniquely Yours',
    description: 'Completely customized to your personal style',
    icon: '💫'
  }
];

export const seasons: SeasonOption[] = [
  {
    id: 'summer',
    label: 'Summer',
    description: 'Warm weather, outdoor venues, longer daylight',
    icon: '☀️'
  },
  {
    id: 'fall',
    label: 'Fall',
    description: 'Mild weather, beautiful colors, cozy atmosphere',
    icon: '🍂'
  },
  {
    id: 'winter',
    label: 'Winter',
    description: 'Indoor venues, holiday spirit, potential snow',
    icon: '❄️'
  },
  {
    id: 'spring',
    label: 'Spring',
    description: 'Fresh blooms, mild weather, new beginnings',
    icon: '🌸'
  }
];

export const venues: VenueOption[] = [
  {
    id: 'hotel',
    label: 'Hotel & Resort',
    description: 'All-in-one venue with accommodation',
    icon: '🏨'
  },
  {
    id: 'garden',
    label: 'Garden & Park',
    description: 'Natural outdoor setting with scenic views',
    icon: '🌳'
  },
  {
    id: 'historic',
    label: 'Historic & Castle',
    description: 'Unique venue with character and history',
    icon: '🏰'
  },
  {
    id: 'beach',
    label: 'Beach & Waterfront',
    description: 'Scenic water views and natural beauty',
    icon: '🏖️'
  },
  {
    id: 'urban',
    label: 'Urban & Industrial',
    description: 'Modern city venues with unique character',
    icon: '🏙️'
  }
];

export const defaultCategories: BudgetCategory[] = [
  {
    name: 'Venue',
    percentage: 30,
    icon: 'Home',
    description: 'Ceremony and reception locations'
  },
  {
    name: 'Catering',
    percentage: 20,
    icon: 'Utensils',
    description: 'Food service and staff'
  },
  {
    name: 'Photography',
    percentage: 12,
    icon: 'Camera',
    description: 'Photos and video coverage'
  },
  {
    name: 'Attire',
    percentage: 8,
    icon: 'Shirt',
    description: 'Wedding dress, suits, and accessories'
  },
  {
    name: 'Entertainment',
    percentage: 7,
    icon: 'Music',
    description: 'DJ, band, or other entertainment'
  },
  {
    name: 'Decorations',
    percentage: 7,
    icon: 'Flower',
    description: 'Flowers, centerpieces, and decor'
  },
  {
    name: 'Rings',
    percentage: 5,
    icon: 'Ring',
    description: 'Wedding bands and engagement ring'
  },
  {
    name: 'Cake',
    percentage: 4,
    icon: 'Cake',
    description: 'Wedding cake and desserts'
  },
  {
    name: 'Transportation',
    percentage: 3,
    icon: 'Car',
    description: 'Vehicles for wedding party and guests'
  },
  {
    name: 'Favors',
    percentage: 2,
    icon: 'Gift',
    description: 'Guest favors and welcome bags'
  },
  {
    name: 'Beverages',
    percentage: 2,
    icon: 'Wine',
    description: 'Bar service and drinks'
  }
];

export const achievements: Achievement[] = [
  {
    id: 'budget_master',
    name: 'Budget Master',
    description: 'Completed your first budget breakdown',
    icon: '🏆',
    reward: {
      id: 'wedding_planning_guide',
      title: 'Ultimate Wedding Planning Guide',
      description: 'A comprehensive guide with professional tips and timeline templates',
      type: 'guide',
      claimed: false
    }
  },
  {
    id: 'detail_oriented',
    name: 'Detail Oriented',
    description: 'Customized all category allocations',
    icon: '🔍',
    reward: {
      id: 'vendor_checklist',
      title: 'Vendor Interview Checklist',
      description: 'Essential questions to ask your potential wedding vendors',
      type: 'template',
      claimed: false
    }
  },
  {
    id: 'smart_saver',
    name: 'Smart Saver',
    description: 'Optimized budget to save 10% or more',
    icon: '💰',
    reward: {
      id: 'savings_discount',
      title: 'Wedding Vendor Discount',
      description: '15% off your choice of wedding vendor services',
      type: 'discount',
      code: 'WEDPLAN15',
      claimed: false
    }
  }
];