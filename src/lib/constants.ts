export const APP_NAME = 'DO';
export const APP_VERSION = '1.0.0';

export const AI_MODELS = {
  GPT_4_TURBO: 'gpt-4-turbo',
  GPT_3_5_TURBO: 'gpt-3.5-turbo',
  GEMINI_PRO: 'gemini-pro',
};

export const PRIORITY_LEVELS = {
  DO_NOW: { id: 'DO_NOW', color: '#EF4444', label: 'Do Now' },
  DO_TODAY: { id: 'DO_TODAY', color: '#F59E0B', label: 'Do Today' },
  CAN_WAIT: { id: 'CAN_WAIT', color: '#3B82F6', label: 'Can Wait' },
  AI_HANDLED: { id: 'AI_HANDLED', color: '#8B5CF6', label: 'AI Handled' },
} as const;

export const DEFAULT_DOMAINS = {
  PERSONAL: 'personal',
  WORK: 'work',
  FINANCE: 'finance',
  HEALTH: 'health',
  HOUSEHOLD: 'household',
};

export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  MAX: 'max',
};

export const QUICK_SUGGESTIONS = [
  'Plan my day',
  'What should I eat?',
  'Pay my bills',
  'Summarize my tasks',
];
