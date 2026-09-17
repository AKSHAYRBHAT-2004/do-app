import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp, signInWithGoogle, signInWithApple, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'social' | 'email'>('social');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Quick Google Sign-In dialog
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('akshayrbhat25@gmail.com');
  const [googleName, setGoogleName] = useState('Akshay Bhat');

  const goHome = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleEmailSubmit = async () => {
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please enter your email or Gmail address.');
      return;
    }
    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (isSignUp) {
        const displayName = name.trim() || cleanEmail.split('@')[0];
        await signUp(cleanEmail, password, displayName);
        setSuccess(`Welcome to DO, ${displayName}! Opening your dashboard...`);
        setTimeout(() => goHome(), 700);
      } else {
        await signIn(cleanEmail, password);
        setSuccess('Signed in successfully! Opening DO...');
        setTimeout(() => goHome(), 700);
      }
    } catch (err: any) {
      setError(err?.message || 'Unable to sign in. Please check your credentials.');
    }
  };

  const handleGoogleSubmit = async () => {
    if (!googleEmail.trim()) {
      setError('Please enter your Gmail address.');
      return;
    }
    try {
      await signInWithGoogle(googleEmail.trim(), googleName.trim() || googleEmail.split('@')[0]);
      setShowGoogleModal(false);
      setSuccess(`Signed in with Google as ${googleEmail.trim()}!`);
      setTimeout(() => goHome(), 700);
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed.');
    }
  };

  const handleAppleSubmit = async () => {
    try {
      await signInWithApple();
      setSuccess('Signed in with Apple ID!');
      setTimeout(() => goHome(), 700);
    } catch (err: any) {
      setError(err?.message || 'Apple sign-in failed.');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0F]"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Brand Header */}
      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center mb-4 shadow-2xl shadow-purple-500/20">
          <Text className="text-black font-black text-4xl tracking-tighter">DO</Text>
        </View>
        <Text className="text-white text-2xl font-bold mb-1 tracking-wide">
          {isSignUp ? 'Create Your Account' : 'Welcome to DO'}
        </Text>
        <Text className="text-gray-400 text-center text-xs">
          Your Autonomous AI Life Operating System
        </Text>
      </View>

      {/* Error & Success Toasts */}
      {error && (
        <View className="bg-red-500/20 border border-red-500/40 p-3.5 rounded-xl mb-4 max-w-sm self-center w-full">
          <Text className="text-red-300 text-xs font-semibold text-center">{error}</Text>
        </View>
      )}
      {success && (
        <View className="bg-emerald-500/20 border border-emerald-500/40 p-3.5 rounded-xl mb-4 max-w-sm self-center w-full">
          <Text className="text-emerald-300 text-xs font-semibold text-center">{success}</Text>
        </View>
      )}

      {/* Loading Spinner */}
      {isLoading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-gray-400 text-sm mt-3 font-medium">
            {isSignUp ? 'Setting up your personal AI OS...' : 'Authenticating...'}
          </Text>
        </View>
      ) : showGoogleModal ? (
        /* ─── Google Sign-In Dialog ─── */
        <View className="bg-white/10 p-5 rounded-2xl border border-white/15 w-full max-w-sm self-center">
          <View className="flex-row items-center mb-3">
            <Text className="text-2xl mr-2">🔵</Text>
            <Text className="text-white font-bold text-lg">Sign In with Google</Text>
          </View>
          <Text className="text-gray-400 text-xs mb-4">
            Connect your Google / Gmail account to sync your schedule, tasks, and memory.
          </Text>

          <Text className="text-gray-300 text-xs font-medium mb-1">Your Name</Text>
          <TextInput
            className="bg-black/40 border border-white/15 text-white p-3 rounded-xl text-sm mb-3"
            placeholder="Your Name"
            placeholderTextColor="#64748B"
            value={googleName}
            onChangeText={setGoogleName}
          />

          <Text className="text-gray-300 text-xs font-medium mb-1">Gmail Address</Text>
          <TextInput
            className="bg-black/40 border border-white/15 text-white p-3 rounded-xl text-sm mb-4"
            placeholder="yourname@gmail.com"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            keyboardType="email-address"
            value={googleEmail}
            onChangeText={setGoogleEmail}
          />

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowGoogleModal(false)}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 items-center"
            >
              <Text className="text-gray-400 font-semibold text-xs">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGoogleSubmit}
              className="flex-1 py-3 rounded-xl bg-purple-600 items-center shadow-lg shadow-purple-500/20"
            >
              <Text className="text-white font-bold text-xs">Sign In with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : mode === 'social' ? (
        /* ─── Social Sign In Buttons ─── */
        <View className="gap-3.5 w-full max-w-sm self-center">
          {/* Continue with Google */}
          <TouchableOpacity
            onPress={() => setShowGoogleModal(true)}
            className="bg-white/10 border border-white/15 py-3.5 rounded-2xl flex-row justify-center items-center active:bg-white/20"
            activeOpacity={0.8}
          >
            <Text className="text-xl mr-3">🔵</Text>
            <Text className="text-white font-bold text-base">Continue with Google</Text>
          </TouchableOpacity>

          {/* Continue with Apple */}
          <TouchableOpacity
            onPress={handleAppleSubmit}
            className="bg-white py-3.5 rounded-2xl flex-row justify-center items-center active:opacity-90"
            activeOpacity={0.8}
          >
            <Text className="text-black text-xl mr-3">🍎</Text>
            <Text className="text-black font-bold text-base">Continue with Apple</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-1.5">
            <View className="flex-1 h-[1px] bg-white/10" />
            <Text className="text-gray-500 text-xs mx-3">or continue with email</Text>
            <View className="flex-1 h-[1px] bg-white/10" />
          </View>

          {/* Continue with Email */}
          <TouchableOpacity
            onPress={() => { setMode('email'); setError(null); }}
            className="bg-transparent border border-white/15 py-3.5 rounded-2xl flex-row justify-center items-center active:bg-white/5"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl mr-3">✉️</Text>
            <Text className="text-white font-bold text-base">Sign In with Email / Password</Text>
          </TouchableOpacity>

          {/* Instant Guest Mode */}
          <TouchableOpacity
            onPress={() => {
              const { setUser, setProfile } = useAuthStore.getState();
              setUser({
                id: `guest_${Date.now()}`,
                email: 'akshayrbhat25@gmail.com',
                app_metadata: {},
                user_metadata: { full_name: 'Akshay' },
                aud: 'authenticated',
                created_at: new Date().toISOString(),
              } as any);
              setProfile({
                id: `guest_${Date.now()}`,
                name: 'Akshay',
                email: 'akshayrbhat25@gmail.com',
                tier: 'pro',
              });
              goHome();
            }}
            className="mt-2 py-2 items-center"
          >
            <Text className="text-gray-500 text-xs">
              Want a quick preview?{' '}
              <Text className="text-purple-400 font-semibold underline">Continue as Akshay</Text>
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── Email Sign In / Sign Up Form ─── */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="w-full max-w-sm self-center"
        >
          <TouchableOpacity
            onPress={() => { setMode('social'); setError(null); setSuccess(null); }}
            className="self-start mb-4"
          >
            <Text className="text-purple-400 text-sm font-semibold">← Back to Sign In options</Text>
          </TouchableOpacity>

          <Text className="text-white text-xl font-bold mb-1">
            {isSignUp ? 'Create Your Account' : 'Sign In with Email'}
          </Text>
          <Text className="text-gray-400 text-xs mb-5">
            {isSignUp
              ? 'Enter your name, email/Gmail, and a secure password.'
              : 'Enter your registered email and password to access your DO OS.'}
          </Text>

          {isSignUp && (
            <TextInput
              className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium mb-3"
              placeholder="Your Full Name (e.g. Akshay Bhat)"
              placeholderTextColor="#64748B"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium mb-3"
            placeholder="Email or Gmail (e.g. akshayrbhat25@gmail.com)"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(null); }}
          />

          <TextInput
            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium mb-4"
            placeholder="Password (minimum 6 characters)"
            placeholderTextColor="#64748B"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setError(null); }}
            onSubmitEditing={handleEmailSubmit}
          />

          <TouchableOpacity
            onPress={handleEmailSubmit}
            className="bg-purple-600 py-3.5 rounded-xl items-center mb-4 shadow-lg shadow-purple-500/20 active:opacity-90"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {isSignUp ? 'Create Account & Start' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Toggle Sign In / Sign Up */}
          <View className="flex-row justify-center py-2">
            <Text className="text-gray-400 text-xs">
              {isSignUp ? 'Already registered? ' : "Don't have an account yet? "}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsSignUp(!isSignUp);
                setError(null);
                setSuccess(null);
              }}
            >
              <Text className="text-purple-400 font-bold text-xs">
                {isSignUp ? 'Sign In' : 'Sign Up for Free'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Security Footer */}
      <View className="mt-8 self-center items-center">
        <Text className="text-gray-600 text-xs mb-1">🔒 256-bit encrypted • Private & local-first</Text>
      </View>
    </ScrollView>
  );
}
