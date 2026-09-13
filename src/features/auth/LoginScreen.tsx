import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { setUser, setProfile } = useAuthStore();
  const [useEmail, setUseEmail] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const completeAuth = (userEmail: string, userName: string) => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: 'user_' + Date.now(),
        email: userEmail,
        app_metadata: {},
        user_metadata: { full_name: userName },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as any);

      setProfile({
        id: 'user_' + Date.now(),
        name: userName,
        email: userEmail,
        avatar_url: undefined,
        tier: 'pro',
      });

      setLoading(false);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    }, 600);
  };

  const handleAppleAuth = () => {
    completeAuth('apple.user@icloud.com', 'Apple User');
  };

  const handleGoogleAuth = () => {
    completeAuth('alex.turner@gmail.com', 'Alex Turner');
  };

  const handleEmailSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setMessage('Please enter both email and password.');
      return;
    }
    const displayName = isSignUp && name.trim() ? name.trim() : email.split('@')[0];
    completeAuth(email.trim(), displayName);
  };

  return (
    <View className="flex-1 bg-[#0A0A0F] justify-center p-6">
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

      {message && (
        <View className="bg-red-500/20 border border-red-500/40 p-3 rounded-xl mb-4 max-w-sm self-center w-full items-center">
          <Text className="text-red-300 text-xs font-semibold">{message}</Text>
        </View>
      )}

      {loading ? (
        <View className="items-center justify-center py-10">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-gray-400 text-sm mt-3">Signing you into DO...</Text>
        </View>
      ) : !useEmail ? (
        <View className="gap-3.5 w-full max-w-sm self-center">
          <TouchableOpacity
            onPress={handleAppleAuth}
            className="bg-white py-3.5 rounded-2xl flex-row justify-center items-center active:opacity-80"
          >
            <Text className="text-black text-xl mr-3">🍎</Text>
            <Text className="text-black font-bold text-base">Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGoogleAuth}
            className="bg-white/10 border border-white/10 py-3.5 rounded-2xl flex-row justify-center items-center active:opacity-80"
          >
            <Text className="text-white text-xl mr-3">🔵</Text>
            <Text className="text-white font-bold text-base">Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setUseEmail(true)}
            className="bg-transparent border border-white/10 py-3.5 rounded-2xl flex-row justify-center items-center active:opacity-80"
          >
            <Text className="text-white text-xl mr-3">✉️</Text>
            <Text className="text-white font-bold text-base">Continue with Email</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="w-full max-w-sm self-center gap-3"
        >
          <TouchableOpacity onPress={() => setUseEmail(false)} className="self-start mb-1">
            <Text className="text-gray-400 text-sm">← Back to Social Sign In</Text>
          </TouchableOpacity>

          {isSignUp && (
            <TextInput
              className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium"
              placeholder="Your Full Name"
              placeholderTextColor="#6B7280"
              value={name}
              onChangeText={setName}
            />
          )}

          <TextInput
            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium"
            placeholder="Email address"
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            className="bg-white/5 border border-white/10 text-white p-3.5 rounded-xl text-sm font-medium"
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={handleEmailSubmit}
            className="bg-purple-600 py-3.5 rounded-xl items-center mt-2 shadow-lg shadow-purple-500/20"
          >
            <Text className="text-white font-bold text-base">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-3">
            <Text className="text-gray-400 text-xs">
              {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            </Text>
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
              <Text className="text-purple-400 font-bold text-xs">
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )}

      <View className="mt-12 self-center items-center">
        <Text className="text-gray-600 text-xs mb-1">🔒 Your data is encrypted and private</Text>
        <View className="flex-row">
          <TouchableOpacity onPress={() => alert('Terms of Service: Your data remains private and local.')}>
            <Text className="text-gray-500 text-xs mx-2">Terms</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Privacy Policy: End-to-end encrypted storage.')}>
            <Text className="text-gray-500 text-xs mx-2">Privacy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
