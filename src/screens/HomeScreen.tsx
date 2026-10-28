// Screen B: Home Dashboard
// Real metrics derived from stored inspections: Total, In Progress, Completed, Failed Checks,
// Recent vehicle inspections, and Quick Action to Start Inspection.

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
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  const loadData = async () => {
    try {
      const list = await LocalDB.getInspections();
      setInspections(list);
      const now = new Date();
      setLastSyncTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Top Workshop Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.branchName}>
            {currentUser.branchName || currentUser.organizationName}
          </Text>
          <Text style={styles.inspectorGreeting}>
            Inspector: {currentUser.fullName}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNavigateToCreate}
          style={styles.quickStartBtn}
        >
          <Ionicons name="add" size={26} color={Colors.primaryText} />
        </TouchableOpacity>
      </View>

      {/* Live Sync Status & Scope Filter */}
      <View style={styles.syncHeaderRow}>
        <View style={styles.syncBadge}>
          <View style={styles.syncPulseDot} />
          <Text style={styles.syncText}>Live Workshop Sync</Text>
          <Text style={styles.syncTime}>• {lastSyncTime}</Text>
        </View>

        <View style={styles.datePillsContainer}>
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
                  ? 'All'
                  : dr === 'TODAY'
                  ? 'Today'
                  : dr === 'WEEK'
                  ? 'Week'
                  : 'Month'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Primary Call to Action */}
      <Card style={styles.heroCard}>
        <View style={styles.heroContent}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>New Vehicle Inspection</Text>
            <Text style={styles.heroSub}>
              Start full 336-point PDI or health inspection with photographic evidence
            </Text>
          </View>
          <Button
            title="Start Now"
            onPress={onNavigateToCreate}
            icon={<Ionicons name="clipboard-outline" size={18} color={Colors.primaryText} />}
            style={styles.heroBtn}
          />
        </View>
      </Card>

      {/* Metrics Row */}
      <View style={styles.metricsHeaderRow}>
        <Text style={styles.sectionTitle}>WORKSHOP PERFORMANCE METRICS</Text>
        <Text style={styles.metricsHintText}>Tap card to view list</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Inspections"
            value={totalCount}
            subtitle="Registered vehicles"
            accentColor="#000000"
            icon={<Ionicons name="car-sport" size={18} color="#2563EB" />}
            iconBgColor="#EFF6FF"
            onPress={() => onNavigateToHistory('ALL')}
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Active drafts"
            accentColor={Colors.pending}
            icon={<Ionicons name="time" size={18} color="#D97706" />}
            iconBgColor="#FEF3C7"
            onPress={() => onNavigateToHistory('in_progress')}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Report certified"
            accentColor={Colors.pass}
            icon={<Ionicons name="checkmark-circle" size={18} color="#16A34A" />}
            iconBgColor="#DCFCE7"
            onPress={() => onNavigateToHistory('completed')}
          />
          <StatCard
            title="Failed Checks"
            value={withFailuresCount}
            subtitle="Vehicles with issues"
            accentColor={Colors.fail}
            icon={<Ionicons name="alert-circle" size={18} color="#DC2626" />}
            iconBgColor="#FEE2E2"
            onPress={() => onNavigateToHistory('failed')}
          />
        </View>
      </View>

      {/* Recent Inspections List */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>RECENT INSPECTIONS</Text>
        {totalCount > 0 ? (
          <TouchableOpacity onPress={() => onNavigateToHistory('ALL')}>
            <Text style={styles.viewAllText}>View All ({totalCount})</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {recentInspections.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="car-outline" size={48} color={Colors.slate400} />
          <Text style={styles.emptyTitle}>No inspections recorded yet</Text>
          <Text style={styles.emptySub}>
            Begin by creating your first 336-point vehicle inspection with photographic evidence.
          </Text>
          <Button
            title="Start First Inspection"
            onPress={onNavigateToCreate}
            icon={<Ionicons name="add-circle" size={18} color={Colors.primaryText} />}
            style={styles.emptyCtaBtn}
          />
        </Card>
      ) : (
        recentInspections.map((item) => (
          <Card
            key={item.id}
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
                  {item.vehicle?.make} {item.vehicle?.model}
                </Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <View style={styles.customerRow}>
              <Ionicons name="person-outline" size={14} color="#000000" />
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
                color={item.passPercentage === 100 ? Colors.pass : Colors.primary}
              />
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>
                {new Date(item.inspectionDate).toLocaleDateString()}
              </Text>
              <View style={styles.footerAction}>
                <Text style={styles.footerActionText}>
                  {item.status === 'completed' ? 'View Report' : 'Continue'}
                </Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.primaryDark} />
              </View>
            </View>
          </Card>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxxl,
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
    height: 42,
    marginBottom: 4,
  },
  branchName: {
    fontSize: Typography.sizes.base,
    fontWeight: '900',
    color: '#000000',
  },
  inspectorGreeting: {
    fontSize: Typography.sizes.sm,
    color: '#000000',
    fontWeight: '800',
    marginTop: 2,
  },
  quickStartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  syncHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    flexWrap: 'wrap',
    gap: 8,
  },
  syncBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  syncPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  syncText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#14532D',
    textTransform: 'uppercase',
  },
  syncTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  datePillsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  datePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  datePillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  datePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  datePillTextActive: {
    color: Colors.primaryText,
    fontWeight: '900',
  },
  heroCard: {
    backgroundColor: Colors.slate900,
    borderColor: Colors.slate800,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  heroContent: {
    gap: 12,
  },
  heroText: {
    gap: 4,
  },
  heroTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '900',
    color: Colors.white,
  },
  heroSub: {
    fontSize: Typography.sizes.xs,
    color: '#E2E8F0',
    lineHeight: 18,
    fontWeight: '500',
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
  },
  metricsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  metricsHintText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#000000',
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
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  viewAllText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '900',
    color: '#D97706',
  },
  inspectionCard: {
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  inspectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  vehicleReg: {
    fontSize: Typography.sizes.base,
    fontWeight: '900',
    color: '#000000',
  },
  vehicleMakeModel: {
    fontSize: Typography.sizes.xs,
    color: '#0F172A',
    fontWeight: '700',
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  customerName: {
    fontSize: Typography.sizes.xs,
    color: '#000000',
    fontWeight: '700',
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
    color: '#0F172A',
    fontWeight: '700',
  },
  progressPct: {
    fontSize: 11,
    fontWeight: '900',
    color: '#000000',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slate200,
    paddingTop: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: '#1E293B',
    fontWeight: '700',
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: '900',
    color: '#D97706',
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: '900',
    color: '#000000',
    marginTop: Spacing.md,
  },
  emptySub: {
    fontSize: Typography.sizes.xs,
    color: '#0F172A',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  emptyCtaBtn: {
    width: '100%',
  },
});

