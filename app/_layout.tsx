import '../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    try {
      initialize?.();
    } catch (e) {
      console.warn('Auth init note:', e);
    }
  }, [initialize]);

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0A0A0F' },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="feature/[slug]" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding/index" options={{ headerShown: false }} />
        <Stack.Screen
          name="(modals)/voice"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="(modals)/camera"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="(modals)/confirmation"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen
          name="(modals)/settings"
          options={{ presentation: 'modal', headerShown: false }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
