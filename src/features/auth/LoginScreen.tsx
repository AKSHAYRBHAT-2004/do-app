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
  const { signIn, signUp, isLoading } = useAuthStore();

  const [mode, setMode] = useState<'social' | 'email'>('social');
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
        setSuccess('Account created! Check your email to confirm, then sign in.');
        setIsSignUp(false);
      } else {
        await signIn(email.trim(), password);
        goHome();
      }
    } catch (err: any) {
      // Parse Supabase error messages into friendly text
      const msg = err?.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
        setError('Incorrect email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email first — check your inbox.');
      } else if (msg.includes('User already registered') || msg.includes('already been registered')) {
        setError('An account with this email already exists. Try signing in instead.');
        setIsSignUp(false);
      } else if (msg.includes('placeholder') || msg.includes('fetch') || msg.includes('network')) {
        // Supabase not configured — fall back to demo mode
        handleDemoSignIn();
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    }
  };

  // Demo mode: works when Supabase is not configured
  const handleDemoSignIn = () => {
    const { setUser, setProfile } = useAuthStore.getState();
    const displayName = name.trim() || email.split('@')[0] || 'DO User';
    setUser({
      id: 'demo_' + Date.now(),
      email: email || 'demo@doapp.ai',
      app_metadata: {},
      user_metadata: { full_name: displayName },
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    } as any);
    setProfile({
      id: 'demo_' + Date.now(),
      name: displayName,
      email: email || 'demo@doapp.ai',
      avatar_url: undefined,
      tier: 'pro',
    });
    goHome();
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    // OAuth requires a native build (Expo Go or standalone app)
    // On web, we show a helpful message
    setError(null);
    if (Platform.OS === 'web') {
      setError(
        `${provider === 'google' ? 'Google' : 'Apple'} sign-in works in the native app. Use email/password on the web version.`
      );
      setMode('email');
    } else {
      // On native, this would call supabase.auth.signInWithOAuth
      setError('Social sign-in requires a production build. Use email/password for now.');
      setMode('email');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#0A0A0F]"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo & Title */}
      <View className="items-center mb-10">
        <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center mb-4 shadow-2xl shadow-white/20">
          <Text className="text-black font-black text-4xl tracking-tighter">DO</Text>
        </View>
        <Text className="text-white text-2xl font-bold mb-1 tracking-wide">
          {isSignUp ? 'Create Your Account' : 'Welcome to DO'}
        </Text>
        <Text className="text-gray-400 text-center text-xs">
          Your Autonomous AI Life Operating System
        </Text>
      </View>

      {/* Error / Success banners */}
      {error && (
        <View className="bg-red-500/20 border border-red-500/40 p-3 rounded-xl mb-4 max-w-sm self-center w-full">
          <Text className="text-red-300 text-xs font-semibold text-center">{error}</Text>
        </View>
      )}
      {success && (
        <View className="bg-green-500/20 border border-green-500/40 p-3 rounded-xl mb-4 max-w-sm self-center w-full">
          <Text className="text-green-300 text-xs font-semibold text-center">{success}</Text>
        </View>
      )}

      {isLoading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-gray-400 text-sm mt-3">
            {isSignUp ? 'Creating your account...' : 'Signing you into DO...'}
          </Text>
        </View>
      ) : mode === 'social' ? (
        /* ─── Social Sign-In Buttons ─── */
        <View className="gap-3.5 w-full max-w-sm self-center">
          <TouchableOpacity
            onPress={() => handleSocialAuth('apple')}
            className="bg-white py-3.5 rounded-2xl flex-row justify-center items-center"
            activeOpacity={0.8}
          >
            <Text className="text-black text-xl mr-3">🍎</Text>
            <Text className="text-black font-bold text-base">Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleSocialAuth('google')}
            className="bg-white/10 border border-white/10 py-3.5 rounded-2xl flex-row justify-center items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl mr-3">🔵</Text>
            <Text className="text-white font-bold text-base">Continue with Google</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center my-1">
            <View className="flex-1 h-[1px] bg-white/10" />
            <Text className="text-gray-500 text-xs mx-3">or</Text>
            <View className="flex-1 h-[1px] bg-white/10" />
          </View>

          <TouchableOpacity
            onPress={() => setMode('email')}
            className="bg-transparent border border-white/10 py-3.5 rounded-2xl flex-row justify-center items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white text-xl mr-3">✉️</Text>
            <Text className="text-white font-bold text-base">Continue with Email</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ─── Email Sign-In / Sign-Up Form ─── */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="w-full max-w-sm self-center"
        >
          <TouchableOpacity onPress={() => { setMode('social'); setError(null); }} className="self-start mb-4">
            <Text className="text-gray-400 text-sm">← Back</Text>
          </TouchableOpacity>

          <Text className="text-white text-lg font-bold mb-4">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>

          {isSignUp && (
            <TextInput
              className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium mb-3"
              placeholder="Your Full Name"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium mb-3"
            placeholder="Email address"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            value={email}
            onChangeText={(t) => { setEmail(t); setError(null); }}
          />

          <TextInput
            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium mb-4"
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={(t) => { setPassword(t); setError(null); }}
            onSubmitEditing={handleEmailSubmit}
          />

          <TouchableOpacity
            onPress={handleEmailSubmit}
            className="bg-purple-600 py-3.5 rounded-xl items-center mb-4 shadow-lg shadow-purple-500/20"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">
              {isSignUp ? 'Create Account →' : 'Sign In →'}
            </Text>
          </TouchableOpacity>

          {/* Try without account */}
          <TouchableOpacity onPress={handleDemoSignIn} className="items-center mb-3">
            <Text className="text-gray-500 text-xs">
              Just exploring?{' '}
              <Text className="text-purple-400 font-bold">Try without account</Text>
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-gray-400 text-xs">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}>
              <Text className="text-purple-400 font-bold text-xs">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* Footer */}
      <View className="mt-10 self-center items-center">
        <Text className="text-gray-600 text-xs mb-1">🔒 Your data is encrypted and private</Text>
      </View>
    </ScrollView>
  );
}
