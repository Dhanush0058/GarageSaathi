// Screen B: Home Dashboard — Dark Luxury Automotive Workshop Experience
// Reference: Motrix Automotive & Z9 Cockpit aesthetic.
// High contrast, defined borders, interactive metric cards, service categories, and instant inspection launcher.

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
import { Card, StatCard, Button, StatusBadge, ProgressBar } from '../components/common';
import { Inspection, UserProfile } from '../types';
import { LocalDB } from '../services/storage/localDatabase';

interface HomeScreenProps {
  currentUser: UserProfile;
  onNavigateToCreate: () => void;
  onNavigateToChecklist: (inspectionId: string) => void;
  onNavigateToSummary: (inspectionId: string) => void;
  onNavigateToHistory: (filter?: 'ALL' | 'draft' | 'in_progress' | 'completed' | 'failed') => void;
}

// 8 Inspection Checkpoint Categories matching reference quick access
const QUICK_CATEGORIES = [
  { code: 'EXT', name: 'EXTERIOR', count: 67, icon: 'car-sport-outline' },
  { code: 'INT', name: 'INTERIOR', count: 71, icon: 'shield-checkmark-outline' },
  { code: 'ELE', name: 'ELECTRICAL', count: 66, icon: 'flash-outline' },
  { code: 'ENG', name: 'ENGINE BAY', count: 42, icon: 'hardware-chip-outline' },
  { code: 'UND', name: 'UNDERBODY', count: 48, icon: 'construct-outline' },
  { code: 'TYR', name: 'TYRES', count: 15, icon: 'disc-outline' },
  { code: 'ROA', name: 'ROAD TEST', count: 14, icon: 'speedometer-outline' },
  { code: 'DOC', name: 'DOCS', count: 13, icon: 'document-text-outline' },
];

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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFB800" />}
    >
      {/* 1. TOP COCKPIT HEADER */}
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

      {/* 2. DATE SCOPE FILTER PILLS (Clean full-width row without sync button) */}
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

      {/* 3. HERO SHOWCASE CARD (Matching Reference Image 3) */}
      <View style={styles.heroCard}>
        <View style={styles.heroGlowCorner} />
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>PDI & DIAGNOSTICS</Text>
        </View>

        <Text style={styles.heroTitle}>
          Keep Every Car <Text style={styles.goldText}>Running Like New</Text>
        </Text>
        <Text style={styles.heroSub}>
          Comprehensive 336-point diagnostic assessment covering Engine Bay, Electricals, Chassis, and Road Test compliance.
        </Text>

        {/* Dual Action Pill Buttons */}
        <View style={styles.heroActionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onNavigateToCreate}
            style={styles.heroPrimaryBtn}
          >
            <Text style={styles.heroPrimaryBtnText}>Start Inspection</Text>
            <Ionicons name="arrow-forward-circle" size={18} color="#080C14" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigateToHistory('ALL')}
            style={styles.heroSecondaryBtn}
          >
            <Text style={styles.heroSecondaryBtnText}>View Reports</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. QUICK CHECKPOINT SERVICE PILLS (Matching Reference Image 3 bottom row) */}
      <View style={styles.quickAccessSection}>
        <Text style={styles.sectionTitle}>336-POINT INSPECTION CATEGORIES</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
          {QUICK_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.code}
              activeOpacity={0.75}
              onPress={onNavigateToCreate}
              style={styles.categoryPillCard}
            >
              <View style={styles.categoryIconCircle}>
                <Ionicons name={cat.icon as any} size={18} color="#FFB800" />
              </View>
              <Text style={styles.categoryNameText}>{cat.name}</Text>
              <Text style={styles.categoryCountText}>{cat.count} Checks</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 5. WORKSHOP PERFORMANCE METRICS (With High-Contrast Dark Cockpit Borders) */}
      <View style={styles.metricsHeaderRow}>
        <Text style={styles.sectionTitle}>WORKSHOP PERFORMANCE METRICS</Text>
        <Text style={styles.metricsHintText}>Tap card to filter</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Inspections"
            value={totalCount}
            subtitle="Registered vehicles"
            accentColor="#FFFFFF"
            icon={<Ionicons name="car-sport" size={18} color="#3B82F6" />}
            iconBgColor="rgba(59, 130, 246, 0.15)"
            dark={true}
            onPress={() => onNavigateToHistory('ALL')}
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Active drafts"
            accentColor="#F59E0B"
            icon={<Ionicons name="time" size={18} color="#F59E0B" />}
            iconBgColor="rgba(245, 158, 11, 0.15)"
            dark={true}
            onPress={() => onNavigateToHistory('in_progress')}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Report certified"
            accentColor="#10B981"
            icon={<Ionicons name="checkmark-circle" size={18} color="#10B981" />}
            iconBgColor="rgba(16, 185, 129, 0.15)"
            dark={true}
            onPress={() => onNavigateToHistory('completed')}
          />
          <StatCard
            title="Failed Checks"
            value={withFailuresCount}
            subtitle="Vehicles with issues"
            accentColor="#EF4444"
            icon={<Ionicons name="alert-circle" size={18} color="#EF4444" />}
            iconBgColor="rgba(239, 68, 68, 0.15)"
            dark={true}
            onPress={() => onNavigateToHistory('failed')}
          />
        </View>
      </View>

      {/* 6. RECENT INSPECTIONS LIST */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>RECENT INSPECTIONS</Text>
        {totalCount > 0 ? (
          <TouchableOpacity onPress={() => onNavigateToHistory('ALL')}>
            <Text style={styles.viewAllText}>View All ({totalCount})</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {recentInspections.length === 0 ? (
        <View style={styles.emptyCard}>
          <Ionicons name="car-outline" size={48} color="#334155" />
          <Text style={styles.emptyTitle}>No inspections recorded yet</Text>
          <Text style={styles.emptySub}>
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
            style={styles.inspectionCard}
          >
            <View style={styles.inspectionCardHeader}>
              <View>
                <Text style={styles.vehicleReg}>
                  {item.vehicle?.registrationNumber || item.reportId}
                </Text>
                <Text style={styles.vehicleMakeModel}>
                  {item.vehicle?.make} {item.vehicle?.model} {item.vehicle?.variant || ''}
                </Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <View style={styles.customerRow}>
              <Ionicons name="person" size={13} color="#FFB800" />
              <Text style={styles.customerName}>
                {item.customer?.name || 'Customer'} • {item.reportId}
              </Text>
            </View>

            {/* Progress indicators */}
            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>
                  {item.scoredItems || 0} / {item.totalItems || 336} Checks Completed
                </Text>
                <Text style={styles.progressPct}>
                  Pass: {item.passPercentage || 0}%
                </Text>
              </View>
              <ProgressBar
                percentage={item.completionPercentage || 0}
                color={item.passPercentage === 100 ? '#10B981' : '#FFB800'}
              />
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>
                {new Date(item.inspectionDate).toLocaleDateString()}
              </Text>
              <View style={styles.footerAction}>
                <Text style={styles.footerActionText}>
                  {item.status === 'completed' ? 'View Certified Report' : 'Continue Inspection'}
                </Text>
                <Ionicons name="arrow-forward" size={14} color="#FFB800" />
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14', // Deep dark luxury automotive cockpit background
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl + 20,
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
    elevation: 6,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
  },

  // Date Filter Pills Row
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginBottom: Spacing.lg,
  },
  datePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  datePillActive: {
    backgroundColor: '#FFB800',
    borderColor: '#FFC700',
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  datePillTextActive: {
    color: '#080C14',
    fontWeight: '900',
  },

  // Hero Card (Matching Reference Image 3)
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  heroGlowCorner: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 184, 0, 0.08)',
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 184, 0, 0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  heroBadgeText: {
    color: '#FFB800',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 26,
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  heroActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  heroPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFB800',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    shadowColor: '#FFB800',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  heroPrimaryBtnText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#080C14',
  },
  heroSecondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  heroSecondaryBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Quick Checkpoint Service Pills (Matching Reference Image 3 bottom row)
  quickAccessSection: {
    marginBottom: Spacing.lg,
  },
  categoryScrollContent: {
    gap: 8,
    paddingVertical: 2,
  },
  categoryPillCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    minWidth: 92,
  },
  categoryIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 184, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryNameText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  categoryCountText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#FFB800',
    marginTop: 2,
  },

  // Metrics Section
  metricsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  metricsHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFB800',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
  },
  statsGrid: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },

  // Recent Inspections
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  viewAllText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '900',
    color: '#FFB800',
  },
  inspectionCard: {
    backgroundColor: '#0F172A',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  inspectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  vehicleReg: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  vehicleMakeModel: {
    fontSize: 13,
    color: '#FFB800',
    fontWeight: '700',
    marginTop: 1,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 10,
  },
  customerName: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
  },
  progressSection: {
    marginBottom: 10,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFB800',
  },
  emptyCard: {
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 14,
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: Spacing.md,
  },
  emptySub: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  emptyCtaBtn: {
    width: '100%',
  },
});
