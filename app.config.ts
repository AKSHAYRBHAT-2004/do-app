import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'DO',
  slug: 'do-app',
  scheme: 'do',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  // @ts-ignore
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#0A0A0F',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.doapp.do',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundColor: '#0A0A0F',
    },
    package: 'com.doapp.do',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-camera',
    'expo-document-picker',
    'expo-image-picker',
    'expo-location',
    'expo-notifications',
    'expo-secure-store',
  ],
  experiments: {
    typedRoutes: true,
    baseUrl: '/do-app',
  },
  newArchEnabled: true,
});
