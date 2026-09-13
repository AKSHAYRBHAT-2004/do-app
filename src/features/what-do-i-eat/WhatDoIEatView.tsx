import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const COMMON_INGREDIENTS = [
  'Eggs', 'Rice', 'Cheese', 'Tomatoes', 'Onion', 
  'Chicken', 'Spinach', 'Pasta', 'Bread', 'Potatoes'
];

const PREP_TIMES = ['15 min', '30 min', '45 min', '1 hr+'];
const ORDER_BUDGETS = ['₹150', '₹300', '₹600', '₹1,000+'];

interface Recipe {
  title: string;
  cookTime: string;
  cost: string;
  calories: string;
  ingredients: string[];
  steps: string[];
  orderSuggestion: {
    name: string;
    dish: string;
    price: string;
    eta: string;
  };
}

export default function WhatDoIEatView() {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(['Eggs', 'Rice', 'Onion']);
  const [customInput, setCustomInput] = useState('');
  const [prepTime, setPrepTime] = useState('15 min');
  const [orderBudget, setOrderBudget] = useState('₹300');
  const [showResults, setShowResults] = useState(true);
  const [fridgeScanning, setFridgeScanning] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const toggleIngredient = (item: string) => {
    setSelectedIngredients(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const handleAddCustom = () => {
    if (customInput.trim() && !selectedIngredients.includes(customInput.trim())) {
      setSelectedIngredients(prev => [...prev, customInput.trim()]);
      setCustomInput('');
    }
  };

  const handlePhotoFridge = () => {
    setFridgeScanning(true);
    setTimeout(() => {
      setSelectedIngredients(['Eggs', 'Cheese', 'Tomatoes', 'Bread', 'Spinach']);
      setFridgeScanning(false);
    }, 1200);
  };

  const getDynamicRecipe = (): Recipe => {
    const hasEggs = selectedIngredients.some(i => i.toLowerCase().includes('egg'));
    const hasRice = selectedIngredients.some(i => i.toLowerCase().includes('rice'));
    const hasPasta = selectedIngredients.some(i => i.toLowerCase().includes('pasta'));
    const hasBread = selectedIngredients.some(i => i.toLowerCase().includes('bread'));
    const hasChicken = selectedIngredients.some(i => i.toLowerCase().includes('chicken'));

    if (hasChicken) {
      return {
        title: 'Skillet Garlic Herb Chicken with Pan Jus',
        cookTime: '25 min',
        cost: '₹140',
        calories: '420 kcal',
        ingredients: ['Chicken breast cubes', 'Chopped garlic & onions', 'Black pepper & butter', 'Fresh herbs / lemon juice'],
        steps: [
          'Season chicken cubes with salt, pepper, and lemon juice.',
          'Sear in hot pan with olive oil or butter for 4 minutes per side.',
          'Toss in sliced onions and minced garlic, sauté until fragrant.',
          'Garnish with parsley and serve with salad or warm bread.'
        ],
        orderSuggestion: {
          name: 'Tandoor Grill Box',
          dish: 'Smoked Butter Chicken & Roti',
          price: orderBudget,
          eta: '25 mins away'
        }
      };
    }

    if (hasPasta) {
      return {
        title: 'Creamy Garlic Cheese Penne',
        cookTime: '18 min',
        cost: '₹65',
        calories: '390 kcal',
        ingredients: ['Pasta (boiled al dente)', 'Butter & minced garlic', 'Cheddar/parmesan cheese', 'Chili flakes & oregano'],
        steps: [
          'Boil pasta in salted water until firm (al dente). Reserve 1/4 cup pasta water.',
          'Melt butter in a wide skillet, sauté garlic on low heat for 60s.',
          'Add drained pasta and reserved water, vigorously stir in grated cheese.',
          'Season with cracked black pepper and red pepper flakes. Serve immediately.'
        ],
        orderSuggestion: {
          name: 'Little Italy Kitchen',
          dish: 'Truffle Mushroom Rigatoni',
          price: orderBudget,
          eta: '20 mins away'
        }
      };
    }

    if (hasBread && hasEggs) {
      return {
        title: 'Crispy Cheese Omelette Toast',
        cookTime: '10 min',
        cost: '₹35',
        calories: '310 kcal',
        ingredients: ['2 Eggs', '2 Slices bread', 'Butter & cheese slice', 'Chopped onions & chilies'],
        steps: [
          'Whisk eggs with salt, pepper, and finely diced onions.',
          'Pour into buttered skillet. Press two slices of bread directly into egg.',
          'Flip whole omelette and fold excess egg over bread with cheese slice.',
          'Toast both sides until golden and crisp.'
        ],
        orderSuggestion: {
          name: 'The Daily Cafe',
          dish: 'Avocado & Scrambled Eggs Sourdough',
          price: orderBudget,
          eta: '18 mins away'
        }
      };
    }

    if (hasRice && hasEggs) {
      return {
        title: 'Golden Scramble Egg Fried Rice',
        cookTime: '12 min',
        cost: '₹40',
        calories: '340 kcal',
        ingredients: ['2 Eggs (lightly whisked)', '1.5 cups cooked/leftover rice', '1/2 Onion diced', '1 tbsp Soy sauce & pinch pepper'],
        steps: [
          'Heat oil in a wok or skillet on high. Scramble eggs softly for 45s, remove.',
          'Sauté diced onions until lightly browned and fragrant.',
          'Add cold rice, breaking up clumps with spatula on high heat.',
          'Drizzle soy sauce, fold in scrambled eggs, and toss for 1 minute.'
        ],
        orderSuggestion: {
          name: 'Wok & Bowl Express',
          dish: 'Cantonese Chicken & Egg Fried Rice',
          price: orderBudget,
          eta: '22 mins away'
        }
      };
    }

    // Default healthy stir-fry
    return {
      title: 'Quick Veggie Sauté with Melted Cheese',
      cookTime: prepTime,
      cost: '₹50',
      calories: '260 kcal',
      ingredients: selectedIngredients.length > 0 ? selectedIngredients : ['Mixed seasonal vegetables', 'Olive oil & garlic', 'Spices to taste'],
      steps: [
        'Chop vegetables into uniform bite-sized pieces.',
        'Heat 1 tbsp oil in skillet, add harder vegetables first for 3 minutes.',
        'Add softer vegetables, season with salt, pepper, and your favorite spice blend.',
        'Cover for 2 minutes to tenderize. Serve warm with warm toast or rice.'
      ],
      orderSuggestion: {
        name: 'FreshBowl Green Bar',
        dish: 'Warm Mediterranean Quinoa Bowl',
        price: orderBudget,
        eta: '20 mins away'
      }
    };
  };

  const recipe = getDynamicRecipe();

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">What Do I Eat? 🍕</Text>
        <Text className="text-gray-400">Zero food indecision: cook with what you have or order smartly</Text>
      </View>

      {/* Input Section */}
      <View className="bg-white/5 p-5 rounded-2xl border border-white/10 mb-6">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white font-bold">Select Ingredients You Have:</Text>
          <TouchableOpacity 
            onPress={handlePhotoFridge}
            className="bg-orange-500/20 px-3 py-1.5 rounded-lg border border-orange-500/30 flex-row items-center"
          >
            <Text className="text-orange-300 text-xs font-bold mr-1">📷</Text>
            <Text className="text-orange-300 text-xs font-bold">
              {fridgeScanning ? 'Scanning...' : 'Photo Fridge'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick ingredient chips */}
        <View className="flex-row flex-wrap gap-2 mb-4">
          {COMMON_INGREDIENTS.map(item => {
            const isSelected = selectedIngredients.includes(item);
            return (
              <TouchableOpacity
                key={item}
                onPress={() => toggleIngredient(item)}
                className={`py-2 px-3.5 rounded-xl border ${
                  isSelected 
                    ? 'bg-orange-600 border-orange-400 shadow-sm shadow-orange-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={isSelected ? 'text-white font-bold text-xs' : 'text-gray-400 text-xs'}>
                  {isSelected ? `✓ ${item}` : `+ ${item}`}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add custom ingredient input */}
        <View className="flex-row items-center gap-2 mb-4">
          <TextInput
            className="flex-1 bg-black/40 text-white px-4 py-2.5 rounded-xl border border-white/10 text-sm"
            placeholder="Add custom ingredient (e.g. mushrooms)..."
            placeholderTextColor="#6B7280"
            value={customInput}
            onChangeText={setCustomInput}
            onSubmitEditing={handleAddCustom}
          />
          <TouchableOpacity 
            onPress={handleAddCustom}
            className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10"
          >
            <Text className="text-white font-bold text-sm">Add</Text>
          </TouchableOpacity>
        </View>

        {/* Prep Time Selector */}
        <Text className="text-white font-bold mb-2">⏱️ Max Prep Time:</Text>
        <View className="flex-row gap-2 mb-4">
          {PREP_TIMES.map(t => (
            <TouchableOpacity
              key={t}
              onPress={() => setPrepTime(t)}
              className={`flex-1 py-2.5 rounded-xl items-center border ${
                prepTime === t ? 'bg-orange-600 border-orange-400' : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={prepTime === t ? 'text-white font-bold text-xs' : 'text-gray-400 text-xs'}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Budget Selector */}
        <Text className="text-white font-bold mb-2">🛵 If ordering instead:</Text>
        <View className="flex-row gap-2">
          {ORDER_BUDGETS.map(b => (
            <TouchableOpacity 
              key={b}
              onPress={() => setOrderBudget(b)}
              className={`flex-1 py-2 rounded-xl items-center border ${
                orderBudget === b ? 'bg-orange-600 border-orange-400' : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={orderBudget === b ? 'text-white font-bold text-xs' : 'text-gray-400 text-xs'}>{b}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Dynamic Results Card */}
      {showResults && (
        <View className="mb-12">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-white">Make It Yourself 👨‍🍳</Text>
            <View className="bg-orange-500/20 px-2.5 py-1 rounded-full border border-orange-500/30">
              <Text className="text-orange-300 text-xs font-bold">Fastest Match</Text>
            </View>
          </View>
          
          <View className="bg-orange-950/30 rounded-2xl p-5 mb-6 border border-orange-500/30 shadow-lg shadow-orange-500/10">
            <Text className="text-xl font-bold text-white mb-2">{recipe.title}</Text>
            
            <View className="flex-row gap-3 mb-4 mt-1">
              <Text className="text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg text-xs">⏱ {recipe.cookTime}</Text>
              <Text className="text-orange-300 bg-orange-500/10 px-2.5 py-1 rounded-lg text-xs font-semibold">💰 {recipe.cost}</Text>
              <Text className="text-gray-300 bg-white/5 px-2.5 py-1 rounded-lg text-xs">🔥 {recipe.calories}</Text>
            </View>
            
            <Text className="text-white font-bold mb-2 text-sm">Key Ingredients:</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {recipe.ingredients.map((ing, i) => (
                <View key={i} className="bg-white/10 px-2.5 py-1 rounded-lg">
                  <Text className="text-gray-300 text-xs">• {ing}</Text>
                </View>
              ))}
            </View>

            <Text className="text-white font-bold mb-2 text-sm">Interactive Steps:</Text>
            <View className="gap-2.5">
              {recipe.steps.map((st, sIdx) => {
                const isStepDone = !!checkedSteps[sIdx];
                return (
                  <TouchableOpacity
                    key={sIdx}
                    onPress={() => setCheckedSteps(p => ({ ...p, [sIdx]: !p[sIdx] }))}
                    className={`p-3 rounded-xl flex-row items-center border ${
                      isStepDone ? 'bg-white/5 border-green-500/30 opacity-60' : 'bg-white/10 border-white/5'
                    }`}
                  >
                    <View className={`w-5 h-5 rounded-full border mr-3 items-center justify-center ${
                      isStepDone ? 'bg-green-500 border-green-500' : 'border-gray-500'
                    }`}>
                      {isStepDone && <Text className="text-black text-[10px] font-bold">✓</Text>}
                    </View>
                    <Text className={`flex-1 text-xs leading-5 ${isStepDone ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                      {st}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Or order nearby */}
          <Text className="text-xl font-bold text-white mb-3">Or Order Nearby ({orderBudget}) 🛵</Text>
          <View className="bg-white/5 rounded-2xl p-4 border border-white/10 flex-row items-center justify-between">
            <Text className="text-3xl mr-3">🥡</Text>
            <View className="flex-1 mr-3">
              <Text className="text-white font-bold text-base">{recipe.orderSuggestion.name}</Text>
              <Text className="text-gray-300 text-xs mt-0.5">{recipe.orderSuggestion.dish}</Text>
              <Text className="text-gray-500 text-[11px] mt-0.5">{recipe.orderSuggestion.eta}</Text>
            </View>
            <TouchableOpacity className="bg-orange-600 px-4 py-2 rounded-xl items-center shadow-md shadow-orange-500/20">
              <Text className="text-white font-bold text-xs">Order {recipe.orderSuggestion.price}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
