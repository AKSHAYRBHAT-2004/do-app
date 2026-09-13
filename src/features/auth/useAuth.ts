import { useAuthStore } from '@/stores/authStore';

export function useAuth() {
  const {
    user,
    session,
    isLoading,
    isAuthenticated,
    profile,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    loadProfile,
    updateProfile,
    initialize,
  } = useAuthStore();

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    profile,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    signInWithApple,
    loadProfile,
    updateProfile,
    initialize,
  };
}

export default useAuth;
