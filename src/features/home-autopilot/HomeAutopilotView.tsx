import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

interface GroceryItem {
  id: string;
  name: string;
  status: 'Out' | 'Low' | 'Stocked';
  checked: boolean;
}

interface ChoreItem {
  id: string;
  title: string;
  dueText: string;
  done: boolean;
}

const INITIAL_GROCERIES: GroceryItem[] = [
  { id: '1', name: 'Milk (2 Litres, Farm Fresh)', status: 'Out', checked: false },
  { id: '2', name: 'Eggs (1 Dozen Organic Brown)', status: 'Low', checked: false },
  { id: '3', name: 'Greek Yogurt & Berries', status: 'Low', checked: false },
  { id: '4', name: 'Sourdough Bread', status: 'Stocked', checked: true },
];

const INITIAL_CHORES: ChoreItem[] = [
  { id: 'c1', title: 'Take out kitchen & recycling trash', dueText: 'Due today (pickup at 8 PM)', done: false },
  { id: 'c2', title: 'Run dishwasher & wipe countertops', dueText: 'Tonight', done: false },
  { id: 'c3', title: 'Water balcony plants', dueText: 'Tomorrow morning', done: true },
];

export default function HomeAutopilotView() {
  const [groceries, setGroceries] = useState<GroceryItem[]>(INITIAL_GROCERIES);
  const [chores, setChores] = useState<ChoreItem[]>(INITIAL_CHORES);
  const [smartAdded, setSmartAdded] = useState(false);
  const [acServiceDone, setAcServiceDone] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add Item states
  const [showAddGrocery, setShowAddGrocery] = useState(false);
  const [newGroceryName, setNewGroceryName] = useState('');
  const [newGroceryStatus, setNewGroceryStatus] = useState<'Out' | 'Low'>('Out');

  const [showAddChore, setShowAddChore] = useState(false);
  const [newChoreTitle, setNewChoreTitle] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleGrocery = (id: string) => {
    setGroceries(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleChore = (id: string) => {
    setChores(prev =>
      prev.map(item =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleSmartAdd = () => {
    if (smartAdded) return;
    const item: GroceryItem = {
      id: Date.now().toString(),
      name: 'Laundry Detergent Pods (40-pack)',
      status: 'Low',
      checked: false,
    };
    setGroceries([item, ...groceries]);
    setSmartAdded(true);
    showToast('✓ Added Laundry Detergent Pods to groceries!');
  };

  const handleAddGroceryItem = () => {
    if (!newGroceryName.trim()) return;
    const item: GroceryItem = {
      id: Date.now().toString(),
      name: newGroceryName.trim(),
      status: newGroceryStatus,
      checked: false,
    };
    setGroceries([item, ...groceries]);
    setNewGroceryName('');
    setShowAddGrocery(false);
    showToast(`✓ Added "${item.name}" to grocery list`);
  };

  const handleAddChoreItem = () => {
    if (!newChoreTitle.trim()) return;
    const chore: ChoreItem = {
      id: Date.now().toString(),
      title: newChoreTitle.trim(),
      dueText: 'Scheduled today',
      done: false,
    };
    setChores([chore, ...chores]);
    setNewChoreTitle('');
    setShowAddChore(false);
    showToast(`✓ Added chore: "${chore.title}"`);
  };

  const handleOrderAll = () => {
    const unpurchased = groceries.filter(g => !g.checked);
    if (unpurchased.length === 0) {
      showToast('All items are already marked bought!');
      return;
    }
    showToast(`🛒 Dispatched ${unpurchased.length} items to QuickCommerce (Blinkit/Zepto)!`);
    // Mark them all ordered
    setGroceries(prev => prev.map(g => ({ ...g, checked: true })));
  };

  const activeGroceryCount = groceries.filter(g => !g.checked).length;
  const activeChoreCount = chores.filter(c => !c.done).length;

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      {/* Header */}
      <View className="mb-6 mt-2">
        <Text className="text-3xl font-bold text-white mb-1">Home Autopilot 🏠</Text>
        <Text className="text-gray-400">Pantry, chores, and home maintenance on auto-pilot</Text>
      </View>

      {/* Toast Alert */}
      {toastMessage && (
        <View className="bg-blue-500/20 border border-blue-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-blue-300 text-xs font-bold">{toastMessage}</Text>
        </View>
      )}

      {/* Smart Predictive Restock Alert */}
      <View className="bg-blue-900/20 border border-blue-500/40 p-4 rounded-2xl mb-6 flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <View className="flex-row items-center mb-1">
            <Text className="text-blue-400 font-bold text-xs uppercase tracking-wider">Predictive Restock</Text>
            <Text className="text-blue-300 text-xs ml-2">🤖 AI Prediction</Text>
          </View>
          <Text className="text-gray-200 text-xs leading-4">
            You buy laundry detergent every 5 weeks. It's week 5 and your pantry sensor predicts low supply.
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleSmartAdd}
          disabled={smartAdded}
          className={`px-3.5 py-2 rounded-xl border ${
            smartAdded ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-600 border-blue-400/50'
          }`}
        >
          <Text className="text-white font-bold text-xs">
            {smartAdded ? '✓ Added' : '+ Add to list'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Groceries & Pantry Section */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-white mr-2">🛒 Groceries & Pantry</Text>
            <View className="bg-white/10 px-2 py-0.5 rounded-full">
              <Text className="text-blue-300 text-xs font-semibold">{activeGroceryCount} needed</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddGrocery(!showAddGrocery)}
            className="bg-white/10 px-3 py-1 rounded-lg border border-white/10"
          >
            <Text className="text-blue-400 text-xs font-bold">+ Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* Add Item Form */}
        {showAddGrocery && (
          <View className="bg-white/10 p-4 rounded-2xl border border-blue-500/40 mb-3">
            <Text className="text-white font-bold text-sm mb-2">New Grocery Item</Text>
            <TextInput
              className="bg-black/40 text-white p-3 rounded-xl mb-3 border border-white/10 text-sm font-medium"
              placeholder="Item name (e.g., Almond Milk, Brown Rice, Coffee)"
              placeholderTextColor="#6B7280"
              value={newGroceryName}
              onChangeText={setNewGroceryName}
            />
            <View className="flex-row gap-2 mb-3">
              <TouchableOpacity
                onPress={() => setNewGroceryStatus('Out')}
                className={`flex-1 py-1.5 rounded-lg items-center border ${
                  newGroceryStatus === 'Out' ? 'bg-red-500/30 border-red-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-bold ${newGroceryStatus === 'Out' ? 'text-red-300' : 'text-gray-400'}`}>
                  🔴 Out of Stock
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewGroceryStatus('Low')}
                className={`flex-1 py-1.5 rounded-lg items-center border ${
                  newGroceryStatus === 'Low' ? 'bg-amber-500/30 border-amber-500' : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={`text-xs font-bold ${newGroceryStatus === 'Low' ? 'text-amber-300' : 'text-gray-400'}`}>
                  🟡 Running Low
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowAddGrocery(false)}
                className="flex-1 py-2 rounded-xl bg-white/5 items-center"
              >
                <Text className="text-gray-400 text-xs font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddGroceryItem}
                className="flex-1 py-2 rounded-xl bg-blue-600 items-center"
              >
                <Text className="text-white text-xs font-bold">Add to List</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Grocery List Card */}
        <View className="bg-white/5 rounded-2xl p-4 border border-white/5 gap-2">
          {groceries.map((item, idx) => (
            <React.Fragment key={item.id}>
              {idx > 0 && <View className="h-px bg-white/5" />}
              <TouchableOpacity
                onPress={() => toggleGrocery(item.id)}
                className="flex-row justify-between items-center py-2"
              >
                <View className="flex-row items-center flex-1 mr-2">
                  <View
                    className={`w-5 h-5 rounded-md border mr-3 items-center justify-center ${
                      item.checked
                        ? 'bg-blue-600 border-blue-500'
                        : 'border-gray-500 bg-white/5'
                    }`}
                  >
                    {item.checked && <Text className="text-white text-[10px] font-bold">✓</Text>}
                  </View>
                  <Text
                    className={`text-sm ${
                      item.checked ? 'text-gray-500 line-through' : 'text-white font-medium'
                    }`}
                  >
                    {item.name}
                  </Text>
                </View>

                {!item.checked && (
                  <View
                    className={`px-2 py-0.5 rounded ${
                      item.status === 'Out'
                        ? 'bg-red-500/20 text-red-400'
                        : item.status === 'Low'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${
                        item.status === 'Out'
                          ? 'text-red-400'
                          : item.status === 'Low'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {item.status}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>

        {/* 1-Click Order Button */}
        <TouchableOpacity
          onPress={handleOrderAll}
          className="mt-3 bg-blue-600/30 border border-blue-500 py-3 rounded-xl items-center flex-row justify-center"
        >
          <Text className="text-blue-300 font-bold text-xs mr-2">⚡ 1-Click Order All</Text>
          <Text className="text-blue-200/70 text-[11px]">via Blinkit / Zepto</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Chores Section */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center">
            <Text className="text-xl font-bold text-white mr-2">🧹 Chores</Text>
            <View className="bg-white/10 px-2 py-0.5 rounded-full">
              <Text className="text-emerald-300 text-xs font-semibold">{activeChoreCount} pending</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowAddChore(!showAddChore)}
            className="bg-white/10 px-3 py-1 rounded-lg border border-white/10"
          >
            <Text className="text-emerald-400 text-xs font-bold">+ Chore</Text>
          </TouchableOpacity>
        </View>

        {showAddChore && (
          <View className="bg-white/10 p-4 rounded-2xl border border-emerald-500/40 mb-3">
            <Text className="text-white font-bold text-sm mb-2">Schedule Chore</Text>
            <TextInput
              className="bg-black/40 text-white p-3 rounded-xl mb-3 border border-white/10 text-sm font-medium"
              placeholder="Chore title (e.g. Clean air fryer, Mop floor)"
              placeholderTextColor="#6B7280"
              value={newChoreTitle}
              onChangeText={setNewChoreTitle}
            />
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setShowAddChore(false)}
                className="flex-1 py-2 rounded-xl bg-white/5 items-center"
              >
                <Text className="text-gray-400 text-xs font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddChoreItem}
                className="flex-1 py-2 rounded-xl bg-emerald-600 items-center"
              >
                <Text className="text-white text-xs font-bold">Save Chore</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="bg-white/5 rounded-2xl p-4 border border-white/5 gap-3">
          {chores.map((chore, idx) => (
            <React.Fragment key={chore.id}>
              {idx > 0 && <View className="h-px bg-white/5" />}
              <View className="flex-row justify-between items-center">
                <View className="flex-1 mr-3">
                  <Text
                    className={`font-medium text-sm ${
                      chore.done ? 'line-through text-gray-500' : 'text-white'
                    }`}
                  >
                    {chore.title}
                  </Text>
                  <Text className="text-gray-400 text-xs mt-0.5">{chore.dueText}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleChore(chore.id)}
                  className={`px-3 py-1.5 rounded-lg border ${
                    chore.done
                      ? 'bg-emerald-500/20 border-emerald-500/40'
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  <Text
                    className={`text-xs font-bold ${
                      chore.done ? 'text-emerald-300' : 'text-white'
                    }`}
                  >
                    {chore.done ? '✓ Done' : 'Mark Done'}
                  </Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Appliance & Maintenance Section */}
      <View className="mb-10">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-xl font-bold text-white">🔧 Scheduled Maintenance</Text>
          <Text className="text-gray-400 text-xs">Quarterly cycle</Text>
        </View>
        <View className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-3">
              <Text className="text-3xl mr-3">❄️</Text>
              <View className="flex-1">
                <Text className="text-white font-medium text-sm">AC Deep Filter Cleaning</Text>
                <Text className={`text-xs mt-0.5 ${acServiceDone ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {acServiceDone ? '✓ Serviced & good for 6 months' : 'Due in 2 weeks (6 months elapsed)'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setAcServiceDone(!acServiceDone);
                showToast(acServiceDone ? 'Service reset' : '🛠️ Booked Urban Company AC Service for Saturday 11 AM!');
              }}
              className={`px-3 py-1.5 rounded-lg border ${
                acServiceDone ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-amber-500/20 border-amber-500/40'
              }`}
            >
              <Text className={`text-xs font-bold ${acServiceDone ? 'text-emerald-300' : 'text-amber-300'}`}>
                {acServiceDone ? 'Serviced' : 'Book (₹499)'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
