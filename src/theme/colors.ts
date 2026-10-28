// Z9 Automotive Brand Theme Colors
// Dynamic high-contrast workshop palette: Electric Gold/Yellow, Deep Automotive Black, Crisp White, Emerald Green, and Amber.

export const Colors = {
  // Brand Primary (Z9 Automotive Signature Electric Gold / Yellow)
  primary: '#FFB800',
  primaryDark: '#D97706',
  primaryLight: '#FFFBEB',
  primarySurface: '#FEF3C7',
  primaryText: '#0A0A0A',

  // Status Colors (Subject to high contrast & accessible standards)
  pass: '#16A34A',        // Green for PASS
  passLight: '#DCFCE7',
  passDark: '#14532D',

  fail: '#DC2626',        // Red for FAIL
  failLight: '#FEE2E2',
  failDark: '#7F1D1D',

  pending: '#F59E0B',     // Amber/Yellow for PENDING
  pendingLight: '#FEF3C7',
  pendingDark: '#78350F',

  // Neutrals / Typography
  slate900: '#0B0F17',   // Deep Black / Slate for headers and dark mode
  slate800: '#181E29',
  slate700: '#334155',
  slate600: '#475569',
  slate500: '#64748B',
  slate400: '#94A3B8',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#FFFFFF',

  // Workshop & High Readability
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  textPrimary: '#0B0F17',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverted: '#FFFFFF',

  // Functional Accents
  accentBlue: '#2563EB',
  accentBlueLight: '#EFF6FF',
  overlay: 'rgba(11, 15, 23, 0.75)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const Typography = {
  fontFamily: 'System', // Adapts cleanly across Android/iOS
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};
