import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

interface Expense {
  id: string;
  name: string;
  category: 'Food' | 'Shopping' | 'Transport' | 'Utilities' | 'Fun';
  amount: number;
  date: string;
  icon: string;
}

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueText: string;
  category: string;
  isPaid: boolean;
  avatarColor: string;
}

const INITIAL_EXPENSES: Expense[] = [
  { id: '1', name: 'Whole Foods & Fresh Groceries', category: 'Food', amount: 4850, date: 'Yesterday', icon: '🍔' },
  { id: '2', name: 'Zara Autumn Jacket', category: 'Shopping', amount: 3100, date: '3 days ago', icon: '🛍️' },
  { id: '3', name: 'Uber & Metro Passes', category: 'Transport', amount: 2420, date: 'This week', icon: '🚗' },
  { id: '4', name: 'Electricity & High-speed Wifi', category: 'Utilities', amount: 2850, date: 'Oct 4', icon: '⚡' },
  { id: '5', name: 'Cinema & Weekend Drinks', category: 'Fun', amount: 1630, date: 'Oct 2', icon: '🎉' },
];

const INITIAL_BILLS: Bill[] = [
  { id: 'b1', name: 'Netflix 4K Ultra', amount: 649, dueText: 'Due Tomorrow', category: 'Entertainment', isPaid: false, avatarColor: 'bg-red-500/20 text-red-400' },
  { id: 'b2', name: 'Water & Municipality Board', amount: 320, dueText: 'Due in 5 days', category: 'Utilities', isPaid: false, avatarColor: 'bg-blue-500/20 text-blue-400' },
  { id: 'b3', name: 'Gym Membership Pro', amount: 1800, dueText: 'Due in 8 days', category: 'Health', isPaid: false, avatarColor: 'bg-emerald-500/20 text-emerald-400' },
];

const BUDGET_PRESETS = [15000, 25000, 40000, 60000];
const CATEGORIES = ['All', 'Food', 'Shopping', 'Transport', 'Utilities', 'Fun'] as const;

export default function MoneyAssistantView() {
  const [budgetLimit, setBudgetLimit] = useState(25000);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Quick Add Expense Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<Expense['category']>('Food');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const adjustBudget = (delta: number) => {
    setBudgetLimit(prev => Math.max(5000, prev + delta));
  };

  const handleAddExpense = () => {
    const parsed = parseFloat(newAmount);
    if (!newTitle.trim() || isNaN(parsed) || parsed <= 0) {
      showToast('⚠️ Please enter a valid description and amount');
      return;
    }

    const iconMap: Record<Expense['category'], string> = {
      Food: '🍔',
      Shopping: '🛍️',
      Transport: '🚗',
      Utilities: '⚡',
      Fun: '🎉'
    };

    const newExpense: Expense = {
      id: Date.now().toString(),
      name: newTitle.trim(),
      category: newCategory,
      amount: Math.round(parsed),
      date: 'Just now',
      icon: iconMap[newCategory]
    };

    setExpenses([newExpense, ...expenses]);
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
    showToast(`✓ Logged ₹${parsed.toLocaleString()} for ${newExpense.name}`);
  };

  const handlePayBill = (billId: string) => {
    const target = bills.find(b => b.id === billId);
    if (!target) return;

    // Mark bill paid
    setBills(prev => prev.map(b => b.id === billId ? { ...b, isPaid: true } : b));
    // Also add to expenses automatically
    const newExp: Expense = {
      id: Date.now().toString(),
      name: `Paid: ${target.name}`,
      category: 'Utilities',
      amount: target.amount,
      date: 'Just now',
      icon: '💳'
    };
    setExpenses([newExp, ...expenses]);
    showToast(`💳 Paid ₹${target.amount.toLocaleString()} for ${target.name}`);
  };

  // Calculations
  const totalSpent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remainingBudget = budgetLimit - totalSpent;
  const percentUsed = Math.min(100, Math.round((totalSpent / budgetLimit) * 100));

  // Category totals
  const categoryTotals: Record<string, number> = {
    Food: 0, Shopping: 0, Transport: 0, Utilities: 0, Fun: 0
  };
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const filteredExpenses = selectedCategory === 'All' 
    ? expenses 
    : expenses.filter(e => e.category === selectedCategory);

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      {/* Header */}
      <View className="mb-6 mt-2 flex-row justify-between items-start">
        <View>
          <Text className="text-3xl font-bold text-white mb-1">Money Assistant 💰</Text>
          <Text className="text-gray-400">Autonomous budget & spending guard</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 px-3.5 py-2 rounded-xl border border-emerald-400/40 flex-row items-center"
        >
          <Text className="text-white font-bold text-xs">+ Log Expense</Text>
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {toastMessage && (
        <View className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-emerald-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* Quick Add Expense Form */}
      {showAddForm && (
        <View className="bg-white/10 rounded-2xl p-4 border border-emerald-500/40 mb-6">
          <Text className="text-white font-bold text-base mb-3">Add New Expense</Text>
          <TextInput
            className="bg-black/40 text-white p-3 rounded-xl mb-3 border border-white/10 text-sm font-medium"
            placeholder="Expense title (e.g. Swiggy, Groceries, Metro)"
            placeholderTextColor="#6B7280"
            value={newTitle}
            onChangeText={setNewTitle}
          />
          <View className="flex-row gap-3 mb-3">
            <TextInput
              className="flex-1 bg-black/40 text-white p-3 rounded-xl border border-white/10 text-sm font-bold"
              placeholder="Amount in ₹"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
              value={newAmount}
              onChangeText={setNewAmount}
            />
          </View>
          
          <Text className="text-gray-400 text-xs font-semibold mb-2">Category:</Text>
          <View className="flex-row flex-wrap gap-2 mb-4">
            {(['Food', 'Shopping', 'Transport', 'Utilities', 'Fun'] as Expense['category'][]).map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setNewCategory(cat)}
                className={`px-3 py-1.5 rounded-lg border ${
                  newCategory === cat ? 'bg-emerald-600 border-emerald-400' : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-bold ${newCategory === cat ? 'text-white' : 'text-gray-400'}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowAddForm(false)}
              className="flex-1 py-2.5 rounded-xl bg-white/10 items-center"
            >
              <Text className="text-gray-400 font-semibold text-xs">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleAddExpense}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 items-center"
            >
              <Text className="text-white font-bold text-xs">Save Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Monthly Budget Card with Steppers */}
      <View className="bg-emerald-950/30 border border-emerald-500/40 p-5 rounded-3xl mb-6 items-center relative overflow-hidden">
        <View className="flex-row justify-between w-full items-center mb-1">
          <Text className="text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Monthly Target Budget
          </Text>
          <View className="flex-row items-center gap-1">
            <TouchableOpacity
              onPress={() => adjustBudget(-2500)}
              className="bg-white/10 w-7 h-7 rounded-full items-center justify-center border border-white/10"
            >
              <Text className="text-white font-bold text-sm">-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => adjustBudget(2500)}
              className="bg-white/10 w-7 h-7 rounded-full items-center justify-center border border-white/10"
            >
              <Text className="text-white font-bold text-sm">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-4xl font-black text-white my-1">
          ₹{totalSpent.toLocaleString()}
          <Text className="text-emerald-400/60 text-lg font-medium"> / ₹{budgetLimit.toLocaleString()}</Text>
        </Text>

        {/* Progress Bar */}
        <View className="w-full bg-white/10 h-2.5 rounded-full my-3 overflow-hidden">
          <View
            className={`h-full rounded-full ${
              percentUsed > 90 ? 'bg-red-500' : percentUsed > 70 ? 'bg-amber-500' : 'bg-emerald-400'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </View>

        {/* Remaining badge */}
        <View className={`px-4 py-1.5 rounded-full border ${
          remainingBudget < 0 ? 'bg-red-500/20 border-red-500/40' : 'bg-emerald-500/20 border-emerald-500/30'
        }`}>
          <Text className={`text-xs font-bold ${remainingBudget < 0 ? 'text-red-400' : 'text-emerald-300'}`}>
            {remainingBudget >= 0
              ? `₹${remainingBudget.toLocaleString()} remaining (${100 - percentUsed}% buffer)`
              : `⚠️ Over budget by ₹${Math.abs(remainingBudget).toLocaleString()}!`}
          </Text>
        </View>

        {/* Quick Budget Presets */}
        <View className="flex-row gap-2 mt-4 pt-3 border-t border-white/10 w-full justify-center">
          {BUDGET_PRESETS.map(preset => (
            <TouchableOpacity
              key={preset}
              onPress={() => setBudgetLimit(preset)}
              className={`px-3 py-1 rounded-lg border ${
                budgetLimit === preset ? 'bg-emerald-500 border-emerald-400' : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={`text-[11px] font-bold ${budgetLimit === preset ? 'text-white' : 'text-gray-400'}`}>
                ₹{(preset / 1000)}k
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* AI Financial Guard Insight */}
      <View className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-4 mb-6 flex-row items-start">
        <Text className="text-2xl mr-3">🤖</Text>
        <View className="flex-1">
          <Text className="text-purple-200 font-bold mb-1">AI Financial Guard</Text>
          <Text className="text-purple-300/80 text-xs leading-5">
            {percentUsed > 80
              ? `You have spent ${percentUsed}% of your ₹${budgetLimit.toLocaleString()} limit. Groceries & utilities take up most share. Consider holding off discretionary shopping for 6 days.`
              : `Spending pace is optimal. You have a healthy buffer of ₹${remainingBudget.toLocaleString()} to allocate towards your savings or weekend getaway.`}
          </Text>
        </View>
      </View>

      {/* Category Breakdown */}
      <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/5">
        <Text className="text-base font-bold text-white mb-4">Category Breakdown</Text>
        
        {/* Food */}
        <View className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-300 text-xs">🍔 Food & Dining</Text>
            <Text className="text-white text-xs font-semibold">₹{categoryTotals.Food.toLocaleString()}</Text>
          </View>
          <View className="h-2 bg-white/10 rounded-full w-full">
            <View
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((categoryTotals.Food / Math.max(1, totalSpent)) * 100))}%` }}
            />
          </View>
        </View>

        {/* Shopping */}
        <View className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-300 text-xs">🛍️ Shopping</Text>
            <Text className="text-white text-xs font-semibold">₹{categoryTotals.Shopping.toLocaleString()}</Text>
          </View>
          <View className="h-2 bg-white/10 rounded-full w-full">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((categoryTotals.Shopping / Math.max(1, totalSpent)) * 100))}%` }}
            />
          </View>
        </View>

        {/* Transport */}
        <View className="mb-3">
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-300 text-xs">🚗 Transport</Text>
            <Text className="text-white text-xs font-semibold">₹{categoryTotals.Transport.toLocaleString()}</Text>
          </View>
          <View className="h-2 bg-white/10 rounded-full w-full">
            <View
              className="h-full bg-yellow-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((categoryTotals.Transport / Math.max(1, totalSpent)) * 100))}%` }}
            />
          </View>
        </View>

        {/* Utilities */}
        <View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-gray-300 text-xs">⚡ Utilities & Bills</Text>
            <Text className="text-white text-xs font-semibold">₹{categoryTotals.Utilities.toLocaleString()}</Text>
          </View>
          <View className="h-2 bg-white/10 rounded-full w-full">
            <View
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(100, Math.round((categoryTotals.Utilities / Math.max(1, totalSpent)) * 100))}%` }}
            />
          </View>
        </View>
      </View>

      {/* Upcoming Bills with Interactive Pay */}
      <Text className="text-lg font-bold text-white mb-3">Upcoming Bills</Text>
      <View className="gap-3 mb-6">
        {bills.map(bill => (
          <View
            key={bill.id}
            className={`p-4 rounded-2xl flex-row items-center justify-between border ${
              bill.isPaid ? 'bg-white/5 border-white/5 opacity-60' : 'bg-white/10 border-white/10'
            }`}
          >
            <View className="flex-row items-center flex-1">
              <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bill.avatarColor}`}>
                <Text className="font-bold text-base">{bill.name.charAt(0)}</Text>
              </View>
              <View className="flex-1 mr-2">
                <Text className={`font-semibold text-sm ${bill.isPaid ? 'line-through text-gray-400' : 'text-white'}`}>
                  {bill.name}
                </Text>
                <Text className={`text-xs ${bill.isPaid ? 'text-emerald-400' : 'text-red-400'}`}>
                  {bill.isPaid ? '✓ Paid & Logged' : bill.dueText}
                </Text>
              </View>
            </View>
            
            <View className="items-end">
              <Text className="text-white font-bold text-sm mb-1.5">₹{bill.amount.toLocaleString()}</Text>
              {!bill.isPaid ? (
                <TouchableOpacity
                  onPress={() => handlePayBill(bill.id)}
                  className="bg-emerald-600 px-3 py-1 rounded-lg border border-emerald-400/40"
                >
                  <Text className="text-white font-bold text-xs">Pay Now</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-emerald-400 text-xs font-semibold">Done</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Recent Expenses List with Category Filters */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-white">Expense Log</Text>
        <Text className="text-gray-500 text-xs">{filteredExpenses.length} transactions</Text>
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            className={`mr-2 px-3 py-1.5 rounded-full border ${
              selectedCategory === cat ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10'
            }`}
          >
            <Text className={`text-xs font-semibold ${selectedCategory === cat ? 'text-black' : 'text-gray-300'}`}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View className="gap-2 mb-10">
        {filteredExpenses.map(exp => (
          <View key={exp.id} className="bg-white/5 rounded-xl p-3.5 border border-white/5 flex-row justify-between items-center">
            <View className="flex-row items-center flex-1 mr-3">
              <Text className="text-xl mr-3">{exp.icon}</Text>
              <View className="flex-1">
                <Text className="text-white text-sm font-medium" numberOfLines={1}>{exp.name}</Text>
                <Text className="text-gray-500 text-[10px]">{exp.category} • {exp.date}</Text>
              </View>
            </View>
            <Text className="text-white font-bold text-sm">₹{exp.amount.toLocaleString()}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
