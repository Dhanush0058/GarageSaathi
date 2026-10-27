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
  onNavigateToHistory: () => void;
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

  // Metrics derived from actual stored inspection records
  const totalCount = inspections.length;
  const inProgressCount = inspections.filter(
    (i) => i.status === 'in_progress' || i.status === 'draft'
  ).length;
  const completedCount = inspections.filter(
    (i) => i.status === 'completed' || i.status === 'approved'
  ).length;
  const withFailuresCount = inspections.filter((i) => (i.failedItems || 0) > 0).length;

  const recentInspections = inspections.slice(0, 5);

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
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
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
            icon={<Ionicons name="clipboard-outline" size={18} color={Colors.white} />}
            style={styles.heroBtn}
          />
        </View>
      </Card>

      {/* Metrics Row */}
      <Text style={styles.sectionTitle}>WORKSHOP PERFORMANCE METRICS</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Total Inspections"
            value={totalCount}
            subtitle="Registered vehicles"
            accentColor={Colors.slate900}
            icon={<Ionicons name="car-sport" size={20} color={Colors.slate500} />}
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Active drafts"
            accentColor={Colors.pending}
            icon={<Ionicons name="time" size={20} color={Colors.pending} />}
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            title="Completed"
            value={completedCount}
            subtitle="Report certified"
            accentColor={Colors.pass}
            icon={<Ionicons name="checkmark-done-circle" size={20} color={Colors.pass} />}
          />
          <StatCard
            title="Failed Checks"
            value={withFailuresCount}
            subtitle="Vehicles with issues"
            accentColor={Colors.fail}
            icon={<Ionicons name="alert-circle" size={20} color={Colors.fail} />}
          />
        </View>
      </View>

      {/* Recent Inspections List */}
      <View style={styles.recentHeader}>
        <Text style={styles.sectionTitle}>RECENT INSPECTIONS</Text>
        {totalCount > 0 ? (
          <TouchableOpacity onPress={onNavigateToHistory}>
            <Text style={styles.viewAllText}>View All ({totalCount})</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {recentInspections.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Ionicons name="car-outline" size={48} color={Colors.slate300} />
          <Text style={styles.emptyTitle}>No inspections recorded yet</Text>
          <Text style={styles.emptySub}>
            Begin by creating your first vehicle inspection using the button above.
          </Text>
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
              <Ionicons name="person-outline" size={14} color={Colors.slate500} />
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
                <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
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
    marginBottom: Spacing.lg,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerLogo: {
    width: 140,
    height: 38,
    marginBottom: 4,
  },
  branchName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  inspectorGreeting: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  quickStartBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  heroCard: {
    backgroundColor: Colors.slate900,
    borderColor: Colors.slate800,
    marginBottom: Spacing.xl,
  },
  heroContent: {
    gap: 12,
  },
  heroText: {
    gap: 4,
  },
  heroTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  heroSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate300,
    lineHeight: 18,
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
  },
  sectionTitle: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate500,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
  },
  statsGrid: {
    marginBottom: Spacing.xl,
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
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  inspectionCard: {
    padding: Spacing.md,
  },
  inspectionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  vehicleReg: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  vehicleMakeModel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  customerName: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
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
    color: Colors.slate500,
  },
  progressPct: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: Colors.slate100,
    paddingTop: 8,
    marginTop: 4,
  },
  dateText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  footerAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerActionText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  emptyCard: {
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
    marginTop: Spacing.md,
  },
  emptySub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    textAlign: 'center',
    marginTop: 4,
  },
});
