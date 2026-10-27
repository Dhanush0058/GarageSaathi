// GarageSaarthi Brand Theme Colors
// Derived directly from https://www.garagesaarthi.com/ and reference inspection report

export const Colors = {
  // Brand Primary (GarageSaarthi Orange)
  primary: '#FF643C',
  primaryDark: '#B02E0C',
  primaryLight: '#FFF2EE',
  primarySurface: '#F5EAE7',

  // Status Colors (Subject to high contrast & accessible standards)
  pass: '#16A34A',        // Green for PASS
  passLight: '#DCFCE7',
  passDark: '#14532D',

  fail: '#DC2626',        // Red for FAIL
  failLight: '#FEE2E2',
  failDark: '#7F1D1D',

  pending: '#D97706',     // Amber for PENDING
  pendingLight: '#FEF3C7',
  pendingDark: '#78350F',

  // Neutrals / Typography
  slate900: '#0F172A',   // Main header / dark background
  slate800: '#1E293B',
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
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  textInverted: '#FFFFFF',

  // Functional Accents
  accentBlue: '#2563EB',
  accentBlueLight: '#EFF6FF',
  overlay: 'rgba(15, 23, 42, 0.65)',
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
