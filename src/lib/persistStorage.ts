import { Platform } from 'react-native';

/**
 * Cross-platform persistent storage:
 * - Native: react-native-mmkv (fast)
 * - Web: localStorage (survives browser refresh)
 * - Fallback: in-memory Map (loses data on refresh — last resort)
 */
export function createPersistStorage(id: string) {
  // 1. Try MMKV (native only, fastest)
  try {
    const { MMKV } = require('react-native-mmkv');
    const mmkv = new MMKV({ id });
    return {
      setItem: (name: string, value: string) => mmkv.set(name, value),
      getItem: (name: string) => mmkv.getString(name) ?? null,
      removeItem: (name: string) => mmkv.delete(name),
    };
  } catch {
    // MMKV not available (web or not installed)
  }

  // 2. Use localStorage on web — persists across browser refreshes
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    return {
      setItem: (name: string, value: string) => {
        try { localStorage.setItem(`do_${id}_${name}`, value); } catch {}
      },
      getItem: (name: string) => {
        try { return localStorage.getItem(`do_${id}_${name}`); } catch { return null; }
      },
      removeItem: (name: string) => {
        try { localStorage.removeItem(`do_${id}_${name}`); } catch {}
      },
    };
  }

  // 3. In-memory fallback (data lost on refresh — only hit in SSR/test environments)
  const map = new Map<string, string>();
  return {
    setItem: (name: string, value: string) => map.set(name, value),
    getItem: (name: string) => map.get(name) ?? null,
    removeItem: (name: string) => map.delete(name),
  };
}
