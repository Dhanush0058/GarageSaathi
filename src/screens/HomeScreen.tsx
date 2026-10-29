// Screen B: Home Dashboard — Hybrid Cinematic Hero & Light Workshop Workspace
// Reference: Motrix Automotive aesthetic
// Top half: High-end automotive workshop background image with electric gold accents
// Bottom half: Crisp light workspace with defined borders, pure dark text, and interactive cards

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme/colors';
import { StatCard, Button, StatusBadge, ProgressBar } from '../components/common';
import { Inspection, UserProfile } from '../types';
import { LocalDB } from '../services/storage/localDatabase';

interface HomeScreenProps {
  currentUser: UserProfile;
  onNavigateToCreate: () => void;
  onNavigateToChecklist: (inspectionId: string) => void;
  onNavigateToSummary: (inspectionId: string) => void;
  onNavigateToHistory: (filter?: 'ALL' | 'draft' | 'in_progress' | 'completed' | 'failed') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  currentUser,
  onNavigateToCreate,
  onNavigateToChecklist,
  onNavigateToSummary,
  onNavigateToHistory,
}) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');

  const loadData = async () => {
    try {
      const list = await LocalDB.getInspections();
      setInspections(list);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Scope metrics by chosen date range
  const filterByDate = (list: Inspection[]) => {
    const now = new Date();
    if (dateRange === 'TODAY') {
      return list.filter(
        (i) => new Date(i.inspectionDate).toDateString() === now.toDateString()
      );
    }
    if (dateRange === 'WEEK') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return list.filter((i) => new Date(i.inspectionDate) >= oneWeekAgo);
    }
    if (dateRange === 'MONTH') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return list.filter((i) => new Date(i.inspectionDate) >= oneMonthAgo);
    }
    return list;
  };

  const scopedInspections = filterByDate(inspections);

  // Metrics derived from actual stored inspection records
  const totalCount = scopedInspections.length;
  const inProgressCount = scopedInspections.filter(
    (i) => i.status === 'in_progress' || i.status === 'draft'
  ).length;
  const completedCount = scopedInspections.filter(
    (i) => i.status === 'completed' || i.status === 'approved'
  ).length;
  const withFailuresCount = scopedInspections.filter(
    (i) => (i.failedItems || 0) > 0
  ).length;

  const recentInspections = scopedInspections.slice(0, 5);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      bounces={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFB800" />}
    >
      {/* =========================================================================
          TOP HALF: COOL REALISTIC WORKSHOP BACKGROUND IMAGE & CINEMATIC HERO
         ========================================================================= */}
      <View style={styles.heroSection}>
        {/* Photorealistic workshop background */}
        <Image
          source={require('../../assets/images/workshop-bg.jpg')}
          style={styles.heroBackgroundImage}
          resizeMode="cover"
        />
        {/* Ambient workshop dark vignette overlay */}
        <View style={styles.heroOverlay} />

        <View style={styles.heroInnerContent}>
          {/* 1. Header Bar */}
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Image
                source={require('../../assets/images/logo-dark.png')}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <Text style={styles.branchName}>
                {currentUser.branchName || currentUser.organizationName}
              </Text>
              <Text style={styles.inspectorGreeting}>
                Lead Inspector: <Text style={styles.goldText}>{currentUser.fullName}</Text>
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToCreate}
              style={styles.quickStartBtn}
            >
              <Ionicons name="add" size={26} color="#080C14" />
            </TouchableOpacity>
          </View>

          {/* 2. Date Scope Filter Pills (Translucent Frosted Glass) */}
          <View style={styles.dateFilterContainer}>
            {(['ALL', 'TODAY', 'WEEK', 'MONTH'] as const).map((dr) => (
              <TouchableOpacity
                key={dr}
                activeOpacity={0.7}
                onPress={() => setDateRange(dr)}
                style={[
                  styles.datePill,
                  dateRange === dr && styles.datePillActive,
                ]}
              >
                <Text
                  style={[
                    styles.datePillText,
                    dateRange === dr && styles.datePillTextActive,
                  ]}
                >
                  {dr === 'ALL'
                    ? 'All Time'
                    : dr === 'TODAY'
                    ? 'Today'
                    : dr === 'WEEK'
                    ? 'This Week'
                    : 'This Month'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 3. Hero Showcase Text & Action Buttons (Matching Reference Image) */}
          <View style={styles.heroContentBlock}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>PDI & DIAGNOSTICS</Text>
            </View>

            <Text style={styles.heroTitle}>
              Keep Every Car{'\n'}
              <Text style={styles.goldText}>Running Like New</Text>
            </Text>

            <Text style={styles.heroSub}>
              Comprehensive 336-point diagnostic assessment covering Engine Bay, Electricals, Chassis, and Road Test compliance.
            </Text>

            {/* Dual Action Pill Buttons */}
            <View style={styles.heroActionsRow}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onNavigateToCreate}
                style={styles.heroPrimaryBtn}
              >
                <Text style={styles.heroPrimaryBtnText}>Start Inspection</Text>
                <Ionicons name="arrow-forward-circle" size={20} color="#080C14" />
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => onNavigateToHistory('ALL')}
                style={styles.heroSecondaryBtn}
              >
                <Text style={styles.heroSecondaryBtnText}>View Reports</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* =========================================================================
          BOTTOM HALF: CRISP LIGHT WORKSPACE (Light colors, pure dark text, defined borders)
         ========================================================================= */}
      <View style={styles.lightWorkspace}>
        {/* WORKSHOP PERFORMANCE METRICS */}
        <View style={styles.metricsHeaderRow}>
          <Text style={styles.sectionTitleDark}>WORKSHOP PERFORMANCE METRICS</Text>
          <Text style={styles.metricsHintTextLight}>Tap card to filter</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Inspections"
              value={totalCount}
              subtitle="Registered vehicles"
              accentColor="#0F172A"
              icon={<Ionicons name="car-sport" size={18} color="#2563EB" />}
              iconBgColor="rgba(37, 99, 235, 0.12)"
              dark={false}
              onPress={() => onNavigateToHistory('ALL')}
            />
            <StatCard
              title="In Progress"
              value={inProgressCount}
              subtitle="Active drafts"
              accentColor="#D97706"
              icon={<Ionicons name="time" size={18} color="#D97706" />}
              iconBgColor="rgba(217, 119, 6, 0.12)"
              dark={false}
              onPress={() => onNavigateToHistory('in_progress')}
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Completed"
              value={completedCount}
              subtitle="Report certified"
              accentColor="#059669"
              icon={<Ionicons name="checkmark-circle" size={18} color="#059669" />}
              iconBgColor="rgba(5, 150, 105, 0.12)"
              dark={false}
              onPress={() => onNavigateToHistory('completed')}
            />
            <StatCard
              title="Failed Checks"
              value={withFailuresCount}
              subtitle="Vehicles with issues"
              accentColor="#DC2626"
              icon={<Ionicons name="alert-circle" size={18} color="#DC2626" />}
              iconBgColor="rgba(220, 38, 38, 0.12)"
              dark={false}
              onPress={() => onNavigateToHistory('failed')}
            />
          </View>
        </View>

        {/* RECENT INSPECTIONS */}
        <View style={styles.recentHeader}>
          <Text style={styles.sectionTitleDark}>RECENT INSPECTIONS</Text>
          {totalCount > 0 ? (
            <TouchableOpacity onPress={() => onNavigateToHistory('ALL')}>
              <Text style={styles.viewAllTextLight}>View All ({totalCount})</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {recentInspections.length === 0 ? (
          <View style={styles.emptyCardLight}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="car-sport-outline" size={38} color="#64748B" />
            </View>
            <Text style={styles.emptyTitleDark}>No inspections recorded yet</Text>
            <Text style={styles.emptySubDark}>
              Begin by conducting your first 336-point vehicle inspection with photographic evidence now.
            </Text>
            <Button
              title="Start First Inspection"
              onPress={onNavigateToCreate}
              icon={<Ionicons name="add-circle" size={18} color="#080C14" />}
              style={styles.emptyCtaBtn}
            />
          </View>
        ) : (
          recentInspections.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() =>
                item.status === 'completed'
                  ? onNavigateToSummary(item.id)
                  : onNavigateToChecklist(item.id)
              }
              style={styles.inspectionCardLight}
            >
              <View style={styles.inspectionCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.vehicleRegDark}>
                    {item.vehicle?.registrationNumber || item.reportId}
                  </Text>
                  <Text style={styles.vehicleMakeModelDark}>
                    {item.vehicle?.make} {item.vehicle?.model} {item.vehicle?.variant || ''}
                  </Text>
                </View>
                <StatusBadge status={item.status} />
              </View>

              <View style={styles.customerRow}>
                <Ionicons name="person" size={13} color="#D97706" />
                <Text style={styles.customerNameDark}>
                  {item.customer?.name || 'Customer'} • {item.reportId}
                </Text>
              </View>

              {/* Progress indicators */}
              <View style={styles.progressSection}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelDark}>
                    {item.scoredItems || 0} / {item.totalItems || 336} Checks Completed
                  </Text>
                  <Text style={styles.progressPctDark}>
                    Pass: {item.passPercentage || 0}%
                  </Text>
                </View>
                <ProgressBar
                  percentage={item.completionPercentage || 0}
                  color={item.passPercentage === 100 ? '#059669' : '#FFB800'}
                />
              </View>

              <View style={styles.cardFooterLight}>
                <Text style={styles.dateTextDark}>
                  {new Date(item.inspectionDate).toLocaleDateString()}
                </Text>
                <View style={styles.footerAction}>
                  <Text style={styles.footerActionTextDark}>
                    {item.status === 'completed' ? 'View Certified Report' : 'Continue Inspection'}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="#D97706" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: '#F8FAFC',
  },

  // -------------------------------------------------------------------------
  // HERO SECTION (TOP HALF)
  // -------------------------------------------------------------------------
  heroSection: {
    position: 'relative',
    backgroundColor: '#080C14',
    paddingBottom: 28,
    overflow: 'hidden',
  },
  heroBackgroundImage: {
    ...StyleSheet.absoluteFill,
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(8, 12, 20, 0.78)',
  },
  heroInnerContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerLogo: {
    width: 175,
    height: 44,
    marginBottom: 6,
  },
  branchName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  inspectorGreeting: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  goldText: {
    color: '#FFB800',
  },
  quickStartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFB800',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  // Date Filter Pills (Frosted Glass style)
  dateFilterContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  datePill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  datePillActive: {
    backgroundColor: '#FFB800',
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E2E8F0',
  },
  datePillTextActive: {
    color: '#080C14',
    fontWeight: '900',
  },

  // Hero Content Block
  heroContentBlock: {
    marginTop: 4,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderWidth: 1,
    borderColor: '#FFB800',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFB800',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 32,
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    fontWeight: '500',
    marginBottom: 18,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heroPrimaryBtn: {
    flex: 1.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFB800',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 8,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  heroPrimaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#080C14',
    letterSpacing: 0.2,
  },
  heroSecondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 24,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    gap: 6,
  },
  heroSecondaryBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // -------------------------------------------------------------------------
  // LIGHT WORKSPACE SECTION (BOTTOM HALF)
  // -------------------------------------------------------------------------
  lightWorkspace: {
    backgroundColor: '#F8FAFC',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: Spacing.lg,
    paddingTop: 24,
    paddingBottom: Spacing.xxxl + 20,
    marginTop: -16, // Smooth curved overlap on the hero
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Section Headers
  metricsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitleDark: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  metricsHintTextLight: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },

  // Metrics Grid
  statsGrid: {
    marginBottom: Spacing.xl,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // Recent Inspections Header
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAllTextLight: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },

  // Empty State Card (Light workspace)
  emptyCardLight: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.xl,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 4,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyTitleDark: {
    fontSize: Typography.sizes.base,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySubDark: {
    fontSize: Typography.sizes.xs,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    fontWeight: '500',
  },
  emptyCtaBtn: {
    width: '100%',
    backgroundColor: '#FFB800',
  },

  // Inspection Cards (Light workspace)
  inspectionCardLight: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  inspectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vehicleRegDark: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 0.3,
  },
  vehicleMakeModelDark: {
    fontSize: Typography.sizes.xs,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  customerNameDark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabelDark: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  progressPctDark: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
  },
  cardFooterLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    marginTop: 2,
  },
  dateTextDark: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionTextDark: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
  },
});
