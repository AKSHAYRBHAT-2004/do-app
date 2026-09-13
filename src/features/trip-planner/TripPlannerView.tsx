import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

const DURATIONS = [2, 3, 5, 7, 10];
const STYLES = ['Budget', 'Relaxing', 'Adventure', 'Luxury', 'Culture'];
const BUDGET_PRESETS = [8000, 15000, 30000, 50000, 80000];

export default function TripPlannerView() {
  const [destination, setDestination] = useState('Goa');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(15000);
  const [style, setStyle] = useState('Relaxing');
  const [planned, setPlanned] = useState(false);

  const adjustBudget = (delta: number) => {
    setBudget(prev => Math.max(3000, prev + delta));
  };

  const handleMakeCheaper = () => {
    setBudget(prev => Math.max(3000, Math.round((prev * 0.75) / 500) * 500));
    setStyle('Budget');
  };

  const handleMoreAction = () => {
    setStyle('Adventure');
  };

  // Generate dynamic day-by-day plan
  const generatePlan = () => {
    const stayCost = Math.round(budget * 0.42);
    const foodCost = Math.round(budget * 0.28);
    const transportCost = Math.round(budget * 0.16);
    const activitiesCost = Math.round(budget * 0.14);

    const dayPlans = [];
    for (let i = 1; i <= days; i++) {
      if (i === 1) {
        dayPlans.push({
          day: 1,
          title: `Day 1: Arrival & ${style === 'Adventure' ? 'Scouting' : 'Sunset'}`,
          events: [
            { time: '1:00 PM', text: `Check-in at ${destination} ${style === 'Luxury' ? 'Boutique Resort' : style === 'Budget' ? 'Co-living Hostel' : 'Central Airbnb'}` },
            { time: '4:30 PM', text: style === 'Adventure' ? 'Kayak exploration & coastal trail hike' : `Scenic sunset stroll at ${destination} waterfront` },
            { time: '8:00 PM', text: style === 'Luxury' ? 'Fine dining chef tasting menu' : 'Authentic local specialty dinner' }
          ]
        });
      } else if (i === days) {
        dayPlans.push({
          day: i,
          title: `Day ${i}: Souvenirs & Farewell`,
          events: [
            { time: '9:30 AM', text: `Morning artisanal coffee & local flea market in ${destination}` },
            { time: '12:00 PM', text: 'Checkout and packing memorable keepsakes' },
            { time: '3:00 PM', text: 'Departure connection' }
          ]
        });
      } else {
        dayPlans.push({
          day: i,
          title: `Day ${i}: ${style === 'Adventure' ? 'Adrenaline & Discovery' : style === 'Culture' ? 'Heritage & Temples' : 'Scenic Highlights'}`,
          events: [
            { time: '9:00 AM', text: style === 'Adventure' ? 'Guided cycling tour or river rafting' : style === 'Culture' ? 'Historic fort and museum tour' : 'Leisurely brunch & scenic viewpoint' },
            { time: '2:30 PM', text: `Hidden gems & artisan shops across ${destination}` },
            { time: '7:30 PM', text: 'Live acoustic music & outdoor dinner' }
          ]
        });
      }
    }

    return { stayCost, foodCost, transportCost, activitiesCost, dayPlans };
  };

  const planData = generatePlan();

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">Trip in 30s ✈️</Text>
        <Text className="text-gray-400">Autonomous travel generator and dynamic modifier</Text>
      </View>

      {!planned ? (
        <View className="mb-8">
          {/* Destination */}
          <Text className="text-white font-bold mb-2 ml-1">📍 Where to?</Text>
          <TextInput
            className="bg-white/10 text-white p-4 rounded-xl mb-6 border border-white/10 text-lg font-medium"
            placeholder="City, region, or country"
            placeholderTextColor="#6B7280"
            value={destination}
            onChangeText={setDestination}
          />
          
          {/* Duration */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-bold ml-1">📅 Duration</Text>
            <Text className="text-teal-400 text-sm font-semibold">{days} Days Selected</Text>
          </View>
          <View className="flex-row mb-6 gap-2 flex-wrap">
            {DURATIONS.map(d => (
              <TouchableOpacity 
                key={d} 
                onPress={() => setDays(d)}
                className={`flex-1 min-w-[55px] py-3 items-center rounded-xl border ${
                  days === d 
                    ? 'bg-teal-600 border-teal-400 shadow-md shadow-teal-500/20' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={days === d ? 'text-white font-bold' : 'text-gray-300'}>{d} Days</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Budget */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white font-bold ml-1">💰 Total Budget</Text>
            <Text className="text-teal-400 font-bold text-lg">₹{budget.toLocaleString()}</Text>
          </View>
          <View className="bg-white/5 p-4 rounded-2xl mb-6 border border-white/10">
            {/* Quick Adjustment Steppers */}
            <View className="flex-row justify-between items-center gap-2 mb-3">
              <TouchableOpacity 
                onPress={() => adjustBudget(-5000)}
                className="bg-white/10 px-3 py-2 rounded-lg"
              >
                <Text className="text-gray-300 text-xs font-bold">- ₹5,000</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => adjustBudget(-1000)}
                className="bg-white/10 px-3 py-2 rounded-lg"
              >
                <Text className="text-gray-300 text-xs font-bold">- ₹1,000</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => adjustBudget(1000)}
                className="bg-white/10 px-3 py-2 rounded-lg"
              >
                <Text className="text-gray-300 text-xs font-bold">+ ₹1,000</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => adjustBudget(5000)}
                className="bg-white/10 px-3 py-2 rounded-lg"
              >
                <Text className="text-gray-300 text-xs font-bold">+ ₹5,000</Text>
              </TouchableOpacity>
            </View>

            {/* Presets */}
            <View className="flex-row justify-between pt-2 border-t border-white/5">
              {BUDGET_PRESETS.map(b => (
                <TouchableOpacity 
                  key={b} 
                  onPress={() => setBudget(b)}
                  className={`px-2.5 py-1 rounded-md ${budget === b ? 'bg-teal-600' : 'bg-transparent'}`}
                >
                  <Text className={budget === b ? 'text-white font-bold text-xs' : 'text-gray-400 text-xs'}>
                    ₹{(b / 1000)}k
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Style */}
          <Text className="text-white font-bold mb-3 ml-1">🎯 Travel Style</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
            {STYLES.map(s => (
              <TouchableOpacity 
                key={s} 
                onPress={() => setStyle(s)}
                className={`px-5 py-2.5 rounded-full mr-2.5 border ${
                  style === s 
                    ? 'bg-teal-600/30 border-teal-400' 
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Text className={style === s ? 'text-teal-200 font-bold' : 'text-gray-300'}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Plan Button */}
          <TouchableOpacity 
            onPress={() => setPlanned(true)}
            className="bg-teal-600 py-4 rounded-xl items-center shadow-lg shadow-teal-500/20 active:opacity-90"
          >
            <Text className="text-white font-bold text-lg">
              Plan My Trip ({destination} • {days} Days • ₹{budget.toLocaleString()})
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="mb-10">
          {/* Header Summary */}
          <View className="flex-row justify-between items-center mb-6 bg-teal-950/40 p-4 rounded-2xl border border-teal-500/30">
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">{destination}</Text>
              <Text className="text-teal-300 text-sm font-medium mt-0.5">
                {days} Days • {style} Style • Budget ₹{budget.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setPlanned(false)}
              className="bg-white/10 px-3.5 py-1.5 rounded-xl"
            >
              <Text className="text-teal-300 font-semibold text-xs">Edit Criteria</Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Itinerary Days */}
          <Text className="text-xl font-bold text-white mb-3">Custom Itinerary</Text>
          {planData.dayPlans.map(day => (
            <View key={day.day} className="bg-white/10 rounded-2xl p-4 mb-4 border border-white/5">
              <Text className="text-lg font-bold text-white mb-3">{day.title}</Text>
              <View className="pl-3 border-l-2 border-teal-500/50 gap-3">
                {day.events.map((ev, eIdx) => (
                  <View key={eIdx}>
                    <Text className="text-teal-300 font-semibold text-xs">{ev.time}</Text>
                    <Text className="text-gray-200 text-sm">{ev.text}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

          {/* Budget Breakdown */}
          <View className="bg-white/5 rounded-2xl p-5 mb-6 border border-white/5">
            <Text className="text-lg font-bold text-white mb-3">Budget Allocation Breakdown</Text>
            <View className="gap-2.5">
              <View className="flex-row justify-between"><Text className="text-gray-300">Stay ({style})</Text><Text className="text-white font-medium">₹{planData.stayCost.toLocaleString()}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-300">Food & Local Dining</Text><Text className="text-white font-medium">₹{planData.foodCost.toLocaleString()}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-300">Transit & Commute</Text><Text className="text-white font-medium">₹{planData.transportCost.toLocaleString()}</Text></View>
              <View className="flex-row justify-between"><Text className="text-gray-300">Activities & Sightseeing</Text><Text className="text-white font-medium">₹{planData.activitiesCost.toLocaleString()}</Text></View>
              <View className="h-px bg-white/10 my-1" />
              <View className="flex-row justify-between">
                <Text className="text-teal-400 font-bold text-base">Total Estimated Cost</Text>
                <Text className="text-teal-400 font-bold text-base">₹{budget.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Dynamic Modifier Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={handleMakeCheaper}
              className="flex-1 bg-white/10 py-3.5 rounded-xl items-center border border-white/10 active:bg-teal-900/30"
            >
              <Text className="text-white font-bold text-sm">📉 Make Cheaper (-25%)</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleMoreAction}
              className="flex-1 bg-teal-600/30 py-3.5 rounded-xl items-center border border-teal-500/40 active:bg-teal-600"
            >
              <Text className="text-teal-200 font-bold text-sm">🧗 More Adventure</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
