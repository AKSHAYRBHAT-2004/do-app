import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const CATEGORIES = ['Phones', 'Laptops', 'Headphones', 'Restaurants', 'Hotels', 'Courses'];
const BUDGET_PRESETS = [10000, 30000, 60000, 100000, 150000];

interface ProductOption {
  badge: string;
  name: string;
  price: string;
  reason: string;
}

export default function TellMeBestView() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Phones');
  const [budget, setBudget] = useState(50000);
  const [showResults, setShowResults] = useState(true);
  const [copied, setCopied] = useState(false);

  const adjustBudget = (delta: number) => {
    setBudget(prev => Math.max(3000, prev + delta));
  };

  const getResults = (): { best: ProductOption; alt: ProductOption; cheap: ProductOption; reasoning: string } => {
    switch (category) {
      case 'Laptops':
        if (budget >= 90000) {
          return {
            best: { badge: '🥇 Best Choice', name: 'MacBook Air M3 (16GB RAM)', price: '₹1,04,900', reason: 'Industry-leading 18h battery life, quiet fanless design, and highest resale value.' },
            alt: { badge: '🥈 Best Windows Alt', name: 'Dell XPS 13 / Asus Zenbook S 14', price: '₹98,500', reason: 'Stunning 3K OLED screen and new Lunar Lake AI battery efficiency.' },
            cheap: { badge: '💰 Best Value Pick', name: 'Lenovo IdeaPad Slim 5 (Ryzen 7)', price: '₹62,990', reason: 'Solid metal chassis, 16GB RAM, and 100% sRGB screen for much lower price.' },
            reasoning: `For a budget of ₹${budget.toLocaleString()} in Laptops, prioritize 16GB unified RAM. The M3 Air is the undisputed daily driver king.`
          };
        }
        return {
          best: { badge: '🥇 Best Choice', name: 'Lenovo Yoga Slim 6 (Ryzen 7)', price: '₹58,990', reason: 'Exceptional metal build, 16-thread performance, and 14-inch sharp display.' },
          alt: { badge: '🥈 Best Alternative', name: 'HP Pavilion 14 (Intel Core i5 13th Gen)', price: '₹54,990', reason: 'Reliable customer service network and great backlit keyboard.' },
          cheap: { badge: '💰 Cheapest Sensible', name: 'Acer Aspire Lite (16GB RAM, SSD)', price: '₹34,990', reason: 'Unbeatable specs-to-price ratio without cutting down memory.' },
          reasoning: `In the ₹${budget.toLocaleString()} budget range, avoid 8GB models. The Lenovo Yoga Slim gives you premium build without premium tax.`
        };

      case 'Headphones':
        if (budget >= 15000) {
          return {
            best: { badge: '🥇 Best Choice', name: 'Sony WH-1000XM5', price: '₹26,990', reason: 'World-class active noise cancellation and featherweight plush comfort.' },
            alt: { badge: '🥈 Best Alternative', name: 'Bose QuietComfort SC / Ultra', price: '₹22,990', reason: 'Superior physical headband clamping ergonomics for long flights.' },
            cheap: { badge: '💰 Cheapest High-End', name: 'Sony WH-1000XM4', price: '₹19,990', reason: '90% of the XM5 sound and ANC performance with a foldable design.' },
            reasoning: `For ₹${budget.toLocaleString()} headphones, ANC algorithm is paramount. Sony XM5 dominates office & transit quietness.`
          };
        }
        return {
          best: { badge: '🥇 Best Choice', name: 'Soundcore Space One / Q45', price: '₹8,999', reason: 'LDAC hi-res codec support, 50h battery, and surprisingly punchy ANC.' },
          alt: { badge: '🥈 Best Alternative', name: 'JBL Live 670NC', price: '₹7,499', reason: 'Energetic bass profile and instant multi-device Bluetooth switching.' },
          cheap: { badge: '💰 Cheapest Sensible', name: 'CMF by Nothing Buds Pro 2', price: '₹3,499', reason: 'Smart dial on the case, dual drivers, and 50dB noise cancellation.' },
          reasoning: `Under ₹${budget.toLocaleString()}, Soundcore provides the best balanced soundcurve without harsh treble.`
        };

      case 'Restaurants':
        return {
          best: { badge: '🥇 Best Dining Experience', name: 'Olive Bar & Kitchen / Smoke House Deli', price: '₹2,400 for two', reason: 'Consistent seasonal European menu, relaxed ambient lighting, and top wine list.' },
          alt: { badge: '🥈 Best Contemporary', name: 'Burma Burma / Pa Pa Ya', price: '₹1,800 for two', reason: 'Fabulous pan-Asian flavors with artistic presentation and zero food coma.' },
          cheap: { badge: '💰 Cheapest Iconic Pick', name: 'Rameshwaram Cafe / Local Dosa Specialist', price: '₹350 for two', reason: 'Pure ghee goodness, piping hot filter coffee, and lightning fast service.' },
          reasoning: `Based on your budget of ₹${budget.toLocaleString()}, these restaurants offer the highest verified customer satisfaction in your city.`
        };

      case 'Hotels':
        return {
          best: { badge: '🥇 Top Rated Stay', name: 'Taj Gateway / Heritage Boutique Haveli', price: '₹9,500/night', reason: 'Warm authentic hospitality, heritage courtyard pool, and complimentary breakfast.' },
          alt: { badge: '🥈 Modern Design Alt', name: 'Hyatt Centric / Radisson Red', price: '₹6,800/night', reason: 'High-speed fiber internet, rooftop cocktail pool, and central location.' },
          cheap: { badge: '💰 Smart Budget Pick', name: 'Bloom Rooms / Zostel Plus Private Room', price: '₹2,600/night', reason: 'Pristine cloud beds, minimalist scandi design, and spotlessly clean.' },
          reasoning: `For a hotel stay at ₹${budget.toLocaleString()}, prioritize location and soundproof windows over oversized rooms.`
        };

      case 'Courses':
        return {
          best: { badge: '🥇 Best Career Acceleration', name: 'DeepLearning.AI / Coursera Specialization', price: '₹3,500/mo', reason: 'Taught by Andrew Ng, recognized on LinkedIn, and rigorous project assignments.' },
          alt: { badge: '🥈 Best Practical Skills', name: 'Bootcamp Pro / Educative.io Interactive', price: '₹7,999/yr', reason: 'Zero setup in-browser interactive code sandboxes for rapid learning.' },
          cheap: { badge: '💰 High Value Budget', name: 'Udemy Bestseller (Angela Yu / Colt Steele)', price: '₹499', reason: '60+ hours of complete hands-on portfolio projects for the cost of a pizza.' },
          reasoning: `Skills trump certificates: build 2 distinct showcase projects rather than collecting passive badges.`
        };

      default: // Phones
        if (budget >= 70000) {
          return {
            best: { badge: '🥇 Best Choice', name: 'iPhone 16 Pro / iPhone 16', price: '₹79,900', reason: 'A18 Bionic, all-day battery life, camera control, and 5+ years of software support.' },
            alt: { badge: '🥈 Best Android Alt', name: 'Samsung Galaxy S24 / Ultra', price: '₹74,999', reason: 'Dynamic 120Hz LTPO display, Galaxy AI transcription, and 7 years of Android updates.' },
            cheap: { badge: '💰 Value Flagship', name: 'OnePlus 12 (16GB RAM)', price: '₹59,999', reason: 'Snapdragon 8 Gen 3 with 100W ultra-fast charging included in the box.' },
            reasoning: `At ₹${budget.toLocaleString()}, the iPhone 16 delivers unmatched video quality and software longevity.`
          };
        }
        return {
          best: { badge: '🥇 Best Choice', name: 'Google Pixel 8a / Nothing Phone (2)', price: '₹39,999', reason: 'Pixel computational camera magic combined with clean stock software.' },
          alt: { badge: '🥈 Best All-Rounder', name: 'OnePlus Nord 4 (Metal Unibody)', price: '₹29,999', reason: 'Sleek aluminum chassis, 5500mAh battery, and 4 years of OS upgrades.' },
          cheap: { badge: '💰 Cheapest Sensible Choice', name: 'CMF Phone 1 / Galaxy M35', price: '₹15,999', reason: 'Clean software, AMOLED 120Hz screen, and dependable daily performance.' },
          reasoning: `In the ₹${budget.toLocaleString()} range, avoid bloated skins. Clean software ensures your device stays fast 3 years from now.`
        };
    }
  };

  const results = getResults();

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">Tell Me The Best ✨</Text>
        <Text className="text-gray-400">Zero decision fatigue: exactly 3 curated options for your budget</Text>
      </View>

      <View className="mb-6">
        {/* Search Input */}
        <TextInput
          className="bg-white/10 text-white p-4 rounded-xl mb-4 border border-white/10 text-base"
          placeholder={`Search or customize (e.g. Best ${category} under ₹${budget.toLocaleString()})...`}
          placeholderTextColor="#9CA3AF"
          value={query}
          onChangeText={setQuery}
        />

        {/* Categories */}
        <Text className="text-white font-bold mb-2 ml-1">Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {CATEGORIES.map(c => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              className={`px-4 py-2.5 rounded-full mr-2.5 border ${
                category === c 
                  ? 'bg-purple-600 border-purple-400 shadow-md shadow-purple-500/30' 
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className={category === c ? 'text-white font-bold' : 'text-gray-300'}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Budget Stepper & Presets */}
        <View className="mb-6 bg-white/5 p-4 rounded-2xl border border-white/10">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white font-bold">Budget Limit</Text>
            <Text className="text-purple-300 font-bold text-lg">₹{budget.toLocaleString()}</Text>
          </View>

          {/* Stepper buttons */}
          <View className="flex-row justify-between gap-2 mb-3">
            <TouchableOpacity onPress={() => adjustBudget(-10000)} className="bg-white/10 px-3 py-2 rounded-lg flex-1 items-center">
              <Text className="text-gray-300 text-xs font-bold">- ₹10k</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustBudget(-2000)} className="bg-white/10 px-3 py-2 rounded-lg flex-1 items-center">
              <Text className="text-gray-300 text-xs font-bold">- ₹2k</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustBudget(2000)} className="bg-white/10 px-3 py-2 rounded-lg flex-1 items-center">
              <Text className="text-gray-300 text-xs font-bold">+ ₹2k</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => adjustBudget(10000)} className="bg-white/10 px-3 py-2 rounded-lg flex-1 items-center">
              <Text className="text-gray-300 text-xs font-bold">+ ₹10k</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Presets */}
          <View className="flex-row justify-between pt-2 border-t border-white/5">
            {BUDGET_PRESETS.map(b => (
              <TouchableOpacity
                key={b}
                onPress={() => setBudget(b)}
                className={`px-3 py-1 rounded-md ${budget === b ? 'bg-purple-600' : 'bg-transparent'}`}
              >
                <Text className={budget === b ? 'text-white font-bold text-xs' : 'text-gray-400 text-xs'}>
                  ₹{(b / 1000)}k
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Find Button */}
        <TouchableOpacity 
          onPress={() => setShowResults(true)}
          className="bg-purple-600 py-4 rounded-xl items-center shadow-lg shadow-purple-500/20 active:opacity-90"
        >
          <Text className="text-white font-bold text-lg">
            Find The Best {category} (₹{budget.toLocaleString()})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Results Section */}
      {showResults && (
        <View className="mb-10">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-white">AI Verdict for {category}</Text>
            <TouchableOpacity onPress={handleCopy} className="bg-white/10 px-3 py-1.5 rounded-lg">
              <Text className="text-purple-300 text-xs font-semibold">
                {copied ? 'Copied! ✓' : 'Share / Copy'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Option 1: Best */}
          <View className="bg-purple-950/40 rounded-2xl p-5 mb-4 border border-purple-500/40 shadow-md shadow-purple-500/10">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-2">🥇</Text>
                <Text className="text-lg font-bold text-white flex-1">{results.best.name}</Text>
              </View>
              <View className="bg-purple-500/20 px-2.5 py-1 rounded-full border border-purple-500/40">
                <Text className="text-purple-300 text-xs font-bold">Top Pick</Text>
              </View>
            </View>
            <Text className="text-purple-300 font-bold text-base mb-2">{results.best.price}</Text>
            <Text className="text-gray-200 leading-5">{results.best.reason}</Text>
          </View>

          {/* Option 2: Alternative */}
          <View className="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-2">🥈</Text>
                <Text className="text-lg font-bold text-white flex-1">{results.alt.name}</Text>
              </View>
              <View className="bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
                <Text className="text-blue-300 text-xs font-bold">Alternative</Text>
              </View>
            </View>
            <Text className="text-blue-400 font-bold text-base mb-2">{results.alt.price}</Text>
            <Text className="text-gray-300 leading-5">{results.alt.reason}</Text>
          </View>

          {/* Option 3: Cheapest */}
          <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/10">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1">
                <Text className="text-2xl mr-2">💰</Text>
                <Text className="text-lg font-bold text-white flex-1">{results.cheap.name}</Text>
              </View>
              <View className="bg-green-500/20 px-2.5 py-1 rounded-full border border-green-500/30">
                <Text className="text-green-300 text-xs font-bold">Best Budget</Text>
              </View>
            </View>
            <Text className="text-green-400 font-bold text-base mb-2">{results.cheap.price}</Text>
            <Text className="text-gray-300 leading-5">{results.cheap.reason}</Text>
          </View>

          {/* AI Reasoning Box */}
          <View className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/30">
            <Text className="text-purple-300 font-semibold mb-1">💡 Reasoning Engine</Text>
            <Text className="text-purple-200 leading-6 text-sm">
              {results.reasoning}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
