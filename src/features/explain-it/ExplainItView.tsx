import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';

interface DocPreset {
  id: string;
  name: string;
  icon: string;
  tag: string;
  content: string;
  summary: {
    title: string;
    whatIsIt: string;
    eli5: string;
    whatMatters: string[];
    actions: string[];
    dates: string[];
    numbers: string[];
    ignore: string;
  };
}

const PRESETS: DocPreset[] = [
  {
    id: 'rental',
    name: 'Rental Agreement',
    icon: '🏠',
    tag: 'Real Estate',
    content: 'Standard 11-month tenancy agreement for Apartment 402, Green Glen Layout, Bangalore. Monthly rent INR 28,000, 3 months security deposit refundable upon vacating minus damage inspection. Non-refundable painting charge of 1 month rent. Notice period 2 months. No pets allowed without written consent. Maintenance charges INR 3,500 payable directly to society association by 5th of every month.',
    summary: {
      title: 'Tenancy Agreement — Flat 402',
      whatIsIt: 'Standard 11-month apartment lease between you and the owner for Flat 402.',
      eli5: 'You pay ₹28k a month to live here. You give ₹84k upfront as deposit, but they will keep ₹28k when you leave for "repairs/paint". You must tell them 2 months before leaving.',
      whatMatters: [
        'Deposit is 3 months (₹84,000) — refundable upon handover.',
        'Mandatory ₹28,000 deducted on exit for painting charges.',
        'Society maintenance ₹3,500 is NOT included in rent (due 5th of each month).',
        'Strict 2-month notice period before moving out.'
      ],
      actions: [
        'Transfer ₹84,000 security deposit to account on page 2',
        'Set calendar reminder for monthly ₹3,500 maintenance on 3rd',
        'Take detailed photos of wall scuffs & plumbing before move-in date'
      ],
      dates: ['1st of every month: Rent due', '5th of every month: Society maintenance due', 'Notice required: 60 days before move-out'],
      numbers: ['Rent: ₹28,000/mo', 'Deposit: ₹84,000', 'Exit deduction: ₹28,000', 'Maintenance: ₹3,500/mo'],
      ignore: 'Pages 5-8 contain boilerplate legal clauses about unforeseen natural disasters and municipal dispute jurisdiction.'
    }
  },
  {
    id: 'health',
    name: 'Health Insurance',
    icon: '🏥',
    tag: 'Insurance',
    content: 'Group Medical Comprehensive Health Policy #HDFC-ERGO-9812. Sum insured INR 10,00,000. Room rent capping at 1% of sum insured (INR 10,000/day). Pre-existing conditions covered after 24 months. 20% co-pay on robotic surgeries. Daycare procedures covered up to 540 listed items. Pre-hospitalization 60 days, post-hospitalization 90 days.',
    summary: {
      title: 'Medical Insurance Policy (₹10L)',
      whatIsIt: 'Comprehensive health hospitalization coverage up to ₹10 Lakhs.',
      eli5: 'If you go to the hospital, insurance pays up to ₹10 Lakhs. BUT don’t pick a super luxury hospital room above ₹10k/night or they will cut money from your other bills too.',
      whatMatters: [
        'Room rent limit is ₹10,000/day. Exceeding this creates proportionate deductions!',
        'Pre-existing illnesses only covered after 2 full continuous years.',
        'You can claim medical bills from 60 days BEFORE and 90 days AFTER hospital stay.',
        'Cashless approval requires 4 hours prior notification at network hospitals.'
      ],
      actions: [
        'Save TPA Card #HDFC-9812 to Apple/Google Wallet',
        'Choose twin-sharing or standard private room under ₹10k/day if hospitalized',
        'Save all pharmacy & doctor consultation bills for post-discharge reimbursement'
      ],
      dates: ['24 months: Pre-existing illness waiting clock', '60 days: Pre-hospitalization claim window', '90 days: Post-discharge claim submission'],
      numbers: ['Sum Insured: ₹10,00,000', 'Max Room Rent: ₹10,000/day', 'Robotic surgery co-pay: 20%'],
      ignore: 'Schedule 3 list of 250 rare exclusions (e.g., cosmetic rhinoplasty, experimental gene therapies).'
    }
  },
  {
    id: 'offer',
    name: 'Job Offer Letter',
    icon: '💼',
    tag: 'Career',
    content: 'Offer of Employment for Senior Product Engineer at Apex Labs Inc. Base salary INR 24,00,000 per annum. Annual variable performance bonus up to INR 3,00,000 based on company KPIs. Joining bonus INR 2,00,000 subject to 12 months clawback. Stock options: 4,000 ESOPs vesting over 4 years with 1-year cliff (25% after year 1, monthly thereafter). Notice period 60 days.',
    summary: {
      title: 'Offer Letter — Apex Labs',
      whatIsIt: 'Official employment contract and compensation package breakdown.',
      eli5: 'Your guaranteed pay is ₹2 Lakh/month before tax. You get a ₹2 Lakh bonus now, but if you leave before 1 year, you must give it back. You also get company shares that start unlocking after 1 year.',
      whatMatters: [
        'Fixed Base: ₹24,00,000 (approx. ₹1,68,000 in hand per month after taxes/PF).',
        'Joining bonus ₹2,00,000 must be repaid in full if you leave before 365 days.',
        'ESOPs: First 1,000 shares unlock exactly 12 months after your joining date.',
        'Notice period is 60 days (2 months).'
      ],
      actions: [
        'Sign and return Annexure A acceptance within 7 business days',
        'Submit relieving letter and past 3 months payslips from current employer',
        'Mark 1-year cliff anniversary on calendar for stock vesting'
      ],
      dates: ['7 business days: Acceptance deadline', 'Joining Date: 1st of next month', '1 Year Cliff: Stock vesting commencement'],
      numbers: ['Base Pay: ₹24,00,000', 'Variable: Up to ₹3,00,000', 'Joining Bonus: ₹2,00,000', 'ESOPs: 4,000 units'],
      ignore: 'Paragraph 14 general intellectual property assignment and internal arbitration venue clauses.'
    }
  }
];

export default function ExplainItView() {
  const [selectedPreset, setSelectedPreset] = useState<DocPreset>(PRESETS[0]);
  const [customText, setCustomText] = useState('');
  const [mode, setMode] = useState<'actions' | 'eli5' | 'detailed'>('actions');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [copiedToast, setCopiedToast] = useState(false);
  const [calendarToast, setCalendarToast] = useState(false);

  const toggleAction = (idx: number) => {
    setCompletedActions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSelectPreset = (preset: DocPreset) => {
    setIsProcessing(true);
    setSelectedPreset(preset);
    setCustomText('');
    setCompletedActions({});
    setTimeout(() => {
      setIsProcessing(false);
    }, 400);
  };

  const handleAnalyzeCustom = () => {
    if (!customText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setSelectedPreset({
        id: 'custom',
        name: 'Custom Document',
        icon: '📝',
        tag: 'Pasted Text',
        content: customText,
        summary: {
          title: 'Custom Analyzed Document',
          whatIsIt: 'Analyzed breakdown of the text provided.',
          eli5: 'Here is the plain English summary: ' + customText.slice(0, 140) + '...',
          whatMatters: [
            'Core commitment highlighted in the first section.',
            'Financial obligations or clauses identified.',
            'Deadlines and actionable requirements found.'
          ],
          actions: [
            'Review highlighted clauses and acknowledge terms',
            'File digital copy in personal records',
            'Follow up with counterpart regarding ambiguous terms'
          ],
          dates: ['Immediate: Review required', 'Due within 14 days: Formal response'],
          numbers: ['Items detected: 3 key terms', 'Estimated reading time: 45 seconds'],
          ignore: 'Standard introductory greetings, preamble disclosures, and signature lines.'
        }
      });
      setIsProcessing(false);
    }, 600);
  };

  const handleCopy = () => {
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  const handleAddToCalendar = () => {
    setCalendarToast(true);
    setTimeout(() => setCalendarToast(false), 2500);
  };

  return (
    <ScrollView className="flex-1 bg-[#0A0A0F] p-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-white mb-2">Explain It Like I'm Lazy 📄</Text>
        <Text className="text-gray-400">Zero legal jargon. Plain English breakdown & actionable next steps.</Text>
      </View>

      {/* Preset Documents Quick Selector */}
      <Text className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 ml-1">
        Choose a Document or Sample:
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {PRESETS.map(p => {
          const isSelected = selectedPreset.id === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              onPress={() => handleSelectPreset(p)}
              className={`mr-3 px-4 py-3 rounded-2xl flex-row items-center border ${
                isSelected ? 'bg-indigo-600/30 border-indigo-500' : 'bg-white/5 border-white/10'
              }`}
            >
              <Text className="text-xl mr-2">{p.icon}</Text>
              <View>
                <Text className={`font-bold text-sm ${isSelected ? 'text-indigo-200' : 'text-white'}`}>
                  {p.name}
                </Text>
                <Text className="text-gray-500 text-[10px]">{p.tag}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Custom Text / Paste Area */}
      <View className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-300 text-xs font-semibold">OR PASTE ANY CONFUSING TEXT</Text>
          {customText.length > 0 && (
            <TouchableOpacity onPress={() => setCustomText('')}>
              <Text className="text-gray-500 text-xs">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
        <TextInput
          className="bg-black/30 text-white p-3 rounded-xl mb-3 border border-white/5 text-sm h-20"
          placeholder="Paste contract, medical bill, tax email, or policy text..."
          placeholderTextColor="#6B7280"
          multiline
          textAlignVertical="top"
          value={customText}
          onChangeText={setCustomText}
        />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleAnalyzeCustom}
            disabled={!customText.trim()}
            className={`flex-1 py-3 rounded-xl items-center ${
              customText.trim() ? 'bg-indigo-600' : 'bg-white/10'
            }`}
          >
            <Text className={`font-bold text-sm ${customText.trim() ? 'text-white' : 'text-gray-500'}`}>
              ⚡ Simplify Pasted Text
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleSelectPreset(PRESETS[0])}
            className="bg-white/10 px-4 py-3 rounded-xl items-center"
          >
            <Text className="text-gray-300 text-xs">📷 Snap/Upload</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode Switcher */}
      <View className="mb-4">
        <Text className="text-gray-400 text-xs uppercase tracking-widest font-semibold mb-2 ml-1">
          Explanation Depth:
        </Text>
        <View className="flex-row bg-white/5 p-1 rounded-xl border border-white/10">
          <TouchableOpacity
            onPress={() => setMode('actions')}
            className={`flex-1 py-2 rounded-lg items-center ${mode === 'actions' ? 'bg-indigo-600' : ''}`}
          >
            <Text className={`text-xs font-bold ${mode === 'actions' ? 'text-white' : 'text-gray-400'}`}>
              ✅ Just Actions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('eli5')}
            className={`flex-1 py-2 rounded-lg items-center ${mode === 'eli5' ? 'bg-indigo-600' : ''}`}
          >
            <Text className={`text-xs font-bold ${mode === 'eli5' ? 'text-white' : 'text-gray-400'}`}>
              🧒 ELI5 Simple
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMode('detailed')}
            className={`flex-1 py-2 rounded-lg items-center ${mode === 'detailed' ? 'bg-indigo-600' : ''}`}
          >
            <Text className={`text-xs font-bold ${mode === 'detailed' ? 'text-white' : 'text-gray-400'}`}>
              🔍 Full Breakdown
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Toast Feedback */}
      {copiedToast && (
        <View className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-emerald-300 text-xs font-bold">✓ Summary copied to clipboard!</Text>
        </View>
      )}
      {calendarToast && (
        <View className="bg-blue-500/20 border border-blue-500/40 p-3 rounded-xl mb-4 items-center">
          <Text className="text-blue-300 text-xs font-bold">📅 Important dates synced to calendar & reminders!</Text>
        </View>
      )}

      {/* Explanations Display */}
      {isProcessing ? (
        <View className="bg-white/5 rounded-2xl p-10 items-center justify-center border border-white/10 my-4">
          <Text className="text-4xl mb-3">🤖</Text>
          <Text className="text-white font-bold text-base">Reading & Translating...</Text>
          <Text className="text-gray-500 text-xs mt-1">Filtering legalese into plain English</Text>
        </View>
      ) : (
        <View className="gap-4 mb-8">
          {/* Header Card */}
          <View className="bg-white/10 rounded-2xl p-4 border border-white/10 flex-row justify-between items-center">
            <View className="flex-1 mr-3">
              <Text className="text-xs text-indigo-400 font-bold uppercase">Source Document</Text>
              <Text className="text-lg font-bold text-white mt-0.5">{selectedPreset.summary.title}</Text>
            </View>
            <TouchableOpacity
              onPress={handleCopy}
              className="bg-white/10 px-3 py-1.5 rounded-lg border border-white/10"
            >
              <Text className="text-gray-300 text-xs font-semibold">📋 Copy</Text>
            </TouchableOpacity>
          </View>

          {/* ELI5 View */}
          {mode === 'eli5' && (
            <View className="bg-purple-900/20 rounded-2xl p-5 border border-purple-500/30">
              <Text className="text-base font-bold text-purple-300 mb-2">🧒 Explain Like I'm 5</Text>
              <Text className="text-white text-base leading-6">{selectedPreset.summary.eli5}</Text>
            </View>
          )}

          {/* Core Summary */}
          {mode !== 'actions' && (
            <View className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <Text className="text-base font-bold text-white mb-2">📋 What is this?</Text>
              <Text className="text-gray-300 text-sm leading-5">{selectedPreset.summary.whatIsIt}</Text>
            </View>
          )}

          {/* What Actually Matters (Red Flags) */}
          <View className="bg-red-950/20 rounded-2xl p-4 border border-red-500/30">
            <Text className="text-base font-bold text-red-400 mb-2">⚠️ What Actually Matters</Text>
            {selectedPreset.summary.whatMatters.map((item, i) => (
              <Text key={i} className="text-gray-300 text-sm mb-1.5 leading-5">
                • {item}
              </Text>
            ))}
          </View>

          {/* Action Checklist */}
          <View className="bg-emerald-950/20 rounded-2xl p-4 border border-emerald-500/30">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-base font-bold text-emerald-400">✅ What You Need To Do</Text>
              <Text className="text-emerald-400/70 text-xs font-semibold">Check when done</Text>
            </View>
            {selectedPreset.summary.actions.map((act, idx) => {
              const isDone = !!completedActions[idx];
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => toggleAction(idx)}
                  className={`flex-row items-center p-3 rounded-xl mb-2 border ${
                    isDone ? 'bg-emerald-900/20 border-emerald-500/40' : 'bg-white/5 border-white/5'
                  }`}
                >
                  <View
                    className={`w-6 h-6 rounded-md mr-3 items-center justify-center border ${
                      isDone ? 'bg-emerald-500 border-emerald-400' : 'border-gray-500'
                    }`}
                  >
                    {isDone && <Text className="text-white text-xs font-bold">✓</Text>}
                  </View>
                  <Text
                    className={`flex-1 text-sm ${
                      isDone ? 'text-gray-500 line-through' : 'text-gray-200 font-medium'
                    }`}
                  >
                    {act}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Important Dates & Numbers */}
          {mode === 'detailed' && (
            <>
              <View className="bg-blue-950/20 rounded-2xl p-4 border border-blue-500/30">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-base font-bold text-blue-400">📅 Important Dates & Deadlines</Text>
                  <TouchableOpacity onPress={handleAddToCalendar} className="bg-blue-500/30 px-2.5 py-1 rounded-md">
                    <Text className="text-blue-200 text-xs font-bold">+ Sync</Text>
                  </TouchableOpacity>
                </View>
                {selectedPreset.summary.dates.map((d, i) => (
                  <Text key={i} className="text-gray-300 text-xs mb-1">
                    • {d}
                  </Text>
                ))}
              </View>

              <View className="bg-amber-950/20 rounded-2xl p-4 border border-amber-500/30">
                <Text className="text-base font-bold text-amber-400 mb-2">🔢 Critical Numbers & Amounts</Text>
                {selectedPreset.summary.numbers.map((n, i) => (
                  <Text key={i} className="text-gray-300 text-xs mb-1 font-mono">
                    • {n}
                  </Text>
                ))}
              </View>

              <View className="bg-white/5 rounded-2xl p-4 border border-white/5">
                <Text className="text-base font-bold text-gray-400 mb-1">🗑️ Safely Ignore</Text>
                <Text className="text-gray-500 text-xs leading-4">{selectedPreset.summary.ignore}</Text>
              </View>
            </>
          )}

          {/* Bottom Action bar */}
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              onPress={handleAddToCalendar}
              className="flex-1 bg-white/10 py-3.5 rounded-xl items-center border border-white/10"
            >
              <Text className="text-white font-semibold text-sm">📅 Set Reminders</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCopy}
              className="flex-1 bg-indigo-600 py-3.5 rounded-xl items-center shadow-lg shadow-indigo-500/30"
            >
              <Text className="text-white font-bold text-sm">📋 Share Summary</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
