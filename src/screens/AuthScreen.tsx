// Screen A: Authentication & Session Management
// Provides secure sign in, role-based access control (Admin, Owner, Inspector, Reviewer),
// and profile view with Z9 Automotive branding.

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Button, Card } from '../components/common';
import { UserProfile, UserRole } from '../types';
import { LocalDB } from '../services/storage/localDatabase';

interface AuthScreenProps {
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

const PRESET_ROLES: { role: UserRole; name: string; email: string; label: string }[] = [
  {
    role: 'inspector',
    name: 'Madhu Inspector',
    email: 'inspector.madhu@z9automotive.com',
    label: 'Lead Inspector (PDI Specialist)',
  },
  {
    role: 'owner',
    name: 'Rajesh Reddy',
    email: 'rajesh.owner@z9automotive.com',
    label: 'Garage Owner / Director',
  },
  {
    role: 'manager',
    name: 'Vikram Joshi',
    email: 'vikram.manager@z9automotive.com',
    label: 'Workshop Operations Manager',
  },
  {
    role: 'reviewer',
    name: 'Priya Sharma',
    email: 'priya.audit@z9automotive.com',
    label: 'Quality Reviewer (Read Only)',
  },
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCustomLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      const user: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email.trim(),
        fullName: email.split('@')[0].toUpperCase(),
        role: 'inspector',
        organizationId: 'org-001',
        organizationName: 'Z9 Automotive Workshop',
        branchId: 'br-001',
        branchName: 'Main Workshop',
      };
      await LocalDB.setCurrentUser(user);
      onLoginSuccess(user);
    } catch (err) {
      setErrorMsg('Sign-in failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = async (preset: typeof PRESET_ROLES[0]) => {
    setLoading(true);
    const user: UserProfile = {
      id: `usr-${preset.role}-01`,
      email: preset.email,
      fullName: preset.name,
      role: preset.role,
      organizationId: 'org-001',
      organizationName: 'Z9 Automotive Workshop',
      branchId: 'br-001',
      branchName: 'Main Workshop - Hyderabad',
    };
    await LocalDB.setCurrentUser(user);
    onLoginSuccess(user);
    setLoading(false);
  };

  if (currentUser) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={Colors.white} />
          </View>
          <Text style={styles.profileName}>{currentUser.fullName}</Text>
          <Text style={styles.profileRole}>{currentUser.role.toUpperCase()}</Text>
          <Text style={styles.profileEmail}>{currentUser.email}</Text>

          <View style={styles.orgInfo}>
            <Text style={styles.orgLabel}>ORGANIZATION</Text>
            <Text style={styles.orgValue}>{currentUser.organizationName}</Text>
            {currentUser.branchName ? (
              <>
                <Text style={styles.orgLabel}>BRANCH</Text>
                <Text style={styles.orgValue}>{currentUser.branchName}</Text>
              </>
            ) : null}
          </View>

          <Button
            title="Sign Out"
            variant="outline"
            onPress={onLogout}
            style={styles.signOutBtn}
          />
        </Card>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollInner}>
        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>Vehicle Inspection & Quality Management</Text>
        </View>

        {/* Credentials Card */}
        <Card style={styles.loginCard}>
          <Text style={styles.cardTitle}>Staff Sign In</Text>
          <Text style={styles.cardSub}>
            Sign in with your authorized Z9 Automotive staff credentials
          </Text>

          {errorMsg ? (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={16} color={Colors.fail} />
              <Text style={styles.errorBannerText}>{errorMsg}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. inspector@z9automotive.com"
              placeholderTextColor={Colors.slate400}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={Colors.slate400}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <Button
            title="Sign In"
            onPress={handleCustomLogin}
            loading={loading}
            style={styles.submitBtn}
          />

          {/* Quick Workshop Role Switcher for instant testing */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR QUICK SIGN-IN AS</Text>
            <View style={styles.dividerLine} />
          </View>

          {PRESET_ROLES.map((preset) => (
            <TouchableOpacity
              key={preset.role}
              activeOpacity={0.7}
              onPress={() => handlePresetSelect(preset)}
              style={styles.presetBtn}
            >
              <View style={styles.presetIcon}>
                <Ionicons
                  name={
                    preset.role === 'inspector'
                      ? 'clipboard'
                      : preset.role === 'owner'
                      ? 'business'
                      : preset.role === 'manager'
                      ? 'speedometer'
                      : 'eye'
                  }
                  size={18}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.presetInfo}>
                <Text style={styles.presetName}>{preset.name}</Text>
                <Text style={styles.presetRole}>{preset.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.slate400} />
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollInner: {
    padding: Spacing.lg,
    paddingTop: Spacing.xxxl,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.sm,
  },
  logo: {
    width: 260,
    height: 62,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  loginCard: {
    padding: Spacing.xl,
  },
  cardTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '900',
    color: '#000000',
  },
  cardSub: {
    fontSize: Typography.sizes.sm,
    color: '#0F172A',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.failLight,
    padding: 8,
    borderRadius: 6,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    color: Colors.failDark,
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semiBold,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.sizes.xs,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.slate50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: Typography.sizes.base,
    color: '#000000',
    fontWeight: '600',
  },
  submitBtn: {
    marginTop: Spacing.sm,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    paddingHorizontal: 10,
  },
  presetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  presetIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  presetInfo: {
    flex: 1,
  },
  presetName: {
    fontSize: Typography.sizes.sm,
    fontWeight: '900',
    color: '#000000',
  },
  presetRole: {
    fontSize: Typography.sizes.xs,
    color: '#0F172A',
    fontWeight: '700',
  },
  profileCard: {
    alignItems: 'center',
    padding: Spacing.xxl,
    margin: Spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  profileName: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  profileRole: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    letterSpacing: 1,
    marginTop: 2,
  },
  profileEmail: {
    fontSize: Typography.sizes.sm,
    color: Colors.slate500,
    marginTop: 4,
  },
  orgInfo: {
    width: '100%',
    backgroundColor: Colors.slate50,
    padding: Spacing.md,
    borderRadius: 8,
    marginVertical: Spacing.lg,
  },
  orgLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate400,
    marginBottom: 2,
  },
  orgValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.slate800,
    marginBottom: 8,
  },
  signOutBtn: {
    width: '100%',
  },
});
