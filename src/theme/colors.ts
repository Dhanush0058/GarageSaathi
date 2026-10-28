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

  // Neutrals / Typography — High Contrast & Pure Dark Black for Workshop Readability
  slate900: '#000000',   // Pure Black for headers and key titles
  slate800: '#0F172A',
  slate700: '#181E29',
  slate600: '#1E293B',
  slate500: '#0F172A',   // Enhanced to deep solid dark for maximum readability
  slate400: '#475569',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#FFFFFF',

  // Workshop & High Readability
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardAlt: '#F1F5F9',
  border: '#CBD5E1',     // Defined crisp borders for cards
  borderStrong: '#94A3B8',
  textPrimary: '#000000', // Pure solid black
  textSecondary: '#0F172A', // Bold dark black
  textMuted: '#1E293B',   // Deep solid charcoal, no washed out grey
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
