export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  tier: SubscriptionTier;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  currency: string;
}

export interface User {
  profile: UserProfile;
  preferences: UserPreferences;
}

export type SubscriptionTier = 'free' | 'pro' | 'max';

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TaskPriority = 'DO_NOW' | 'DO_TODAY' | 'CAN_WAIT' | 'AI_HANDLED';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  task_id?: string;
  title: string;
  trigger_at: string;
}

export interface MemoryCategory {
  id: string;
  name: string;
}

export interface Memory {
  id: string;
  content: string;
  category_id?: string;
  created_at: string;
}

export type IntentDomain = 'productivity' | 'finance' | 'lifestyle' | 'general';
export type IntentUrgency = 'high' | 'medium' | 'low';

export interface SubIntent {
  id: string;
  description: string;
  status: 'pending' | 'completed';
}

export interface Intent {
  id: string;
  domain: IntentDomain;
  urgency: IntentUrgency;
  description: string;
  sub_intents?: SubIntent[];
}

export type ActionCardType = 'task' | 'reminder' | 'payment' | 'suggestion';

export interface ActionCard {
  id: string;
  type: ActionCardType;
  title: string;
  action_url?: string;
}

export type ToolDomain = 'search' | 'calculation' | 'database';
export type ToolImpact = 'read' | 'write' | 'execute';

export interface Tool {
  id: string;
  name: string;
  domain: ToolDomain;
  impact: ToolImpact;
}

export type NotificationPriority = 'high' | 'normal' | 'low';

export interface Notification {
  id: string;
  title: string;
  body: string;
  priority: NotificationPriority;
  read: boolean;
  created_at: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billing_cycle: 'monthly' | 'yearly';
  next_billing_date: string;
}

export interface Bill {
  id: string;
  title: string;
  amount: number;
  due_date: string;
  is_paid: boolean;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  is_purchased: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}

export interface TripActivity {
  id: string;
  title: string;
  start_time: string;
  end_time?: string;
}

export interface TripDay {
  date: string;
  activities: TripActivity[];
}

export interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  itinerary: TripDay[];
}

export interface HouseholdItem {
  id: string;
  name: string;
  stock_level: number;
}

export interface SpendingCategory {
  id: string;
  name: string;
}

export interface SpendingRecord {
  id: string;
  amount: number;
  category_id: string;
  date: string;
  description?: string;
}

export type StreamEventType = 'message' | 'tool_call' | 'tool_result' | 'error';

export interface StreamEvent {
  type: StreamEventType;
  data: any;
}

export interface DecisionOption {
  id: string;
  title: string;
  pros: string[];
  cons: string[];
  score: number;
}

export interface MealSuggestion {
  id: string;
  name: string;
  ingredients: string[];
  recipe_url?: string;
  calories?: number;
}

export interface DocumentAnalysis {
  id: string;
  document_url: string;
  summary: string;
  extracted_entities: Record<string, any>;
}
