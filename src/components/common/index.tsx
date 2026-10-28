// GarageSaarthi Reusable UI Components
// High contrast, workshop readability, tactile tap targets for mobile technicians

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../../theme/colors';

// -------------------------------------------------------------------------
// 1. BUTTON COMPONENT
// -------------------------------------------------------------------------
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      case 'success':
        return styles.btnSuccess;
      case 'primary':
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.btnTextPrimary;
      case 'outline':
        return styles.btnTextOutline;
      case 'secondary':
        return styles.btnTextSecondary;
      default:
        return styles.btnTextLight;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.btnSm;
      case 'lg':
        return styles.btnLg;
      default:
        return styles.btnMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.btnBase,
        getContainerStyle(),
        getSizeStyle(),
        (disabled || loading) && styles.btnDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === 'primary'
              ? Colors.primaryText
              : variant === 'outline'
              ? Colors.primary
              : Colors.white
          }
        />
      ) : (
        <View style={styles.btnContent}>
          {icon ? <View style={styles.btnIcon}>{icon}</View> : null}
          <Text style={[styles.btnTextBase, getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// -------------------------------------------------------------------------
// 2. CARD COMPONENT
// -------------------------------------------------------------------------
export const Card: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
}> = ({ children, style, onPress }) => {
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.card, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
};

// -------------------------------------------------------------------------
// 3. BADGE COMPONENT
// -------------------------------------------------------------------------
export const StatusBadge: React.FC<{
  status: 'PASS' | 'FAIL' | 'PENDING' | 'draft' | 'in_progress' | 'completed' | string;
  style?: ViewStyle;
}> = ({ status, style }) => {
  const norm = status.toUpperCase();

  let bg = Colors.slate100;
  let text = Colors.slate700;
  let label = norm;

  if (norm === 'PASS') {
    bg = Colors.passLight;
    text = Colors.passDark;
    label = '✓ PASS';
  } else if (norm === 'FAIL') {
    bg = Colors.failLight;
    text = Colors.failDark;
    label = '✗ FAIL';
  } else if (norm === 'PENDING') {
    bg = Colors.pendingLight;
    text = Colors.pendingDark;
    label = '⏳ PENDING';
  } else if (norm === 'COMPLETED') {
    bg = Colors.passLight;
    text = Colors.passDark;
    label = 'COMPLETED';
  } else if (norm === 'IN_PROGRESS') {
    bg = Colors.primarySurface;
    text = Colors.primaryDark;
    label = 'IN PROGRESS';
  }

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
    </View>
  );
};

// -------------------------------------------------------------------------
// 4. PROGRESS BAR
// -------------------------------------------------------------------------
export const ProgressBar: React.FC<{
  percentage: number;
  height?: number;
  color?: string;
  style?: ViewStyle;
}> = ({ percentage, height = 8, color = Colors.primary, style }) => {
  const clamped = Math.max(0, Math.min(100, percentage));
  return (
    <View style={[styles.progressTrack, { height }, style]}>
      <View style={[styles.progressFill, { width: `${clamped}%`, height, backgroundColor: color }]} />
    </View>
  );
};

// -------------------------------------------------------------------------
// 5. STAT CARD
// -------------------------------------------------------------------------
export const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  accentColor?: string;
  icon?: React.ReactNode;
  iconBgColor?: string;
  onPress?: () => void;
}> = ({
  title,
  value,
  subtitle,
  accentColor = Colors.primary,
  icon,
  iconBgColor = Colors.slate100,
  onPress,
}) => {
  return (
    <Card onPress={onPress} style={styles.statCard}>
      <View style={styles.statCardHeader}>
        <Text style={styles.statCardTitle}>{title}</Text>
        {icon ? (
          <View style={[styles.statIconBadge, { backgroundColor: iconBgColor }]}>
            {icon}
          </View>
        ) : null}
      </View>
      <Text style={[styles.statCardValue, { color: accentColor }]}>{value}</Text>
      <View style={styles.statFooterRow}>
        {subtitle ? <Text style={styles.statCardSub}>{subtitle}</Text> : null}
        {onPress ? (
          <Ionicons name="chevron-forward" size={14} color={Colors.slate500} />
        ) : null}
      </View>
    </Card>
  );
};

// -------------------------------------------------------------------------
// STYLES
// -------------------------------------------------------------------------
const styles = StyleSheet.create({
  // Button
  btnBase: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
  },
  btnSecondary: {
    backgroundColor: Colors.slate800,
  },
  btnOutline: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
  },
  btnDanger: {
    backgroundColor: Colors.fail,
  },
  btnSuccess: {
    backgroundColor: Colors.pass,
  },
  btnDisabled: {
    opacity: 0.55,
  },
  btnSm: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 36,
  },
  btnMd: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  btnLg: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    minHeight: 54,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 6,
  },
  btnTextBase: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
  },
  btnTextPrimary: {
    color: Colors.primaryText,
  },
  btnTextLight: {
    color: Colors.white,
  },
  btnTextOutline: {
    color: Colors.slate800,
  },
  btnTextSecondary: {
    color: Colors.white,
  },

  // Card
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginVertical: 6,
  },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },

  // Progress Bar
  progressTrack: {
    backgroundColor: Colors.slate200,
    borderRadius: 999,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: 999,
  },

  // Stat Card
  statCard: {
    flex: 1,
    minWidth: 140,
    marginHorizontal: 4,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statCardTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#000000',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
    marginRight: 6,
  },
  statIconBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCardValue: {
    fontSize: Typography.sizes.xxl,
    fontWeight: '900',
    marginBottom: 2,
  },
  statFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  statCardSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
});
