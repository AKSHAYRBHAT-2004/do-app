export const theme = {
  colors: {
    background: {
      default: '#0A0A0F',
      surface: '#12121A',
      surfaceElevated: '#1A1A2E',
      surfaceHighlight: '#2A2A3E',
    },
    accent: {
      primary: '#8B5CF6',
      secondary: '#A78BFA',
      cyan: '#06B6D4',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E2E8F0',
      tertiary: '#94A3B8',
      muted: '#64748B',
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  typography: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
  glassmorphism: {
    default: {
      backgroundColor: 'rgba(26, 26, 46, 0.6)',
      borderColor: 'rgba(139, 92, 246, 0.2)',
      borderWidth: 1,
    },
    subtle: {
      backgroundColor: 'rgba(18, 18, 26, 0.4)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
    },
    accent: {
      backgroundColor: 'rgba(139, 92, 246, 0.15)',
      borderColor: 'rgba(139, 92, 246, 0.4)',
      borderWidth: 1,
    }
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    glow: {
      shadowColor: '#8B5CF6',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 10,
    }
  },
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  }
};
