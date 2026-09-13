// Tools for FINANCE domain

export const analyze_spending = async (params: { userId: string, dateRange?: string }) => {
  return {
    totalSpent: 8420,
    currency: 'INR',
    period: 'Current Month',
    categories: [
      { name: 'Food & Dining', amount: 2850, percentage: 34 },
      { name: 'Shopping & Essentials', amount: 2100, percentage: 25 },
      { name: 'Transport & Commute', amount: 1420, percentage: 17 },
      { name: 'Subscriptions', amount: 850, percentage: 10 },
      { name: 'Others', amount: 1200, percentage: 14 }
    ],
    insight: 'Food spending increased by 12% compared to last month. Dining out accounts for 70% of food costs.'
  };
};

export const track_budget = async (params: { userId: string, targetMonthlyBudget?: number }) => {
  const budget = params.targetMonthlyBudget || 15000;
  const spent = 8420;
  return {
    monthlyBudget: budget,
    currentSpent: spent,
    remaining: budget - spent,
    daysLeftInMonth: 18,
    dailySafeSpending: Math.round((budget - spent) / 18),
    status: 'on_track'
  };
};

export const explain_bill = async (params: { billText?: string, imageUrl?: string }) => {
  return {
    vendor: 'City Power Board',
    totalAmount: 2850,
    dueDate: 'Today (11:59 PM)',
    keyBreakdown: [
      { item: 'Base Energy Charge', cost: 1950 },
      { item: 'Fuel Surcharge & Taxes', cost: 720 },
      { item: 'Late Fee Prevention Discount', cost: -180 }
    ],
    actionRequired: 'Pay today to avoid ₹150 late fee penalties.',
    canIgnore: 'Historical consumption chart on page 2 does not affect payment.'
  };
};

export const manage_subscriptions = async (params: { userId: string }) => {
  return {
    activeCount: 4,
    totalMonthlyCost: 1149,
    subscriptions: [
      { name: 'Netflix Premium', cost: 649, billingDate: '18th of month', status: 'active' },
      { name: 'Spotify Duo', cost: 149, billingDate: '24th of month', status: 'active' },
      { name: 'Cloud Storage 2TB', cost: 199, billingDate: '1st of month', status: 'active' },
      { name: 'Gym Membership', cost: 1500, billingCycle: 'quarterly', status: 'active' }
    ],
    recommendation: 'You haven’t used Spotify Duo in 3 weeks. You can save ₹149/mo by downgrading.'
  };
};

export const savings_advisor = async (params: { goalAmount: number, targetMonths: number }) => {
  return {
    goal: params.goalAmount,
    timeframeMonths: params.targetMonths,
    monthlySavingsRequired: Math.ceil(params.goalAmount / params.targetMonths),
    suggestedCuts: [
      { area: 'Dining delivery apps', potentialSave: 1500 },
      { area: 'Unused streaming tiers', potentialSave: 300 }
    ]
  };
};
