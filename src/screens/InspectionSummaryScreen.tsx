// Screen H: Inspection Summary & Scorecard
// Displays overall progress, transparent PASS percentage calculation, category-wise breakdowns,
// list of defects/failed checks, photographic evidence, and certification completion action.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inspection, InspectionItemResult } from '../types';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Card, Button, ProgressBar, StatusBadge, LoadingInspectionAnimation } from '../components/common';
import { LocalDB } from '../services/storage/localDatabase';
import { calculateInspectionMetrics } from '../utils/inspectionCalculations';
import { useSmartNavigation } from '../utils/useSmartNavigation';

interface InspectionSummaryScreenProps {
  inspectionId: string;
  onNavigateToChecklist: (id: string) => void;
  onNavigateToReport: (id: string) => void;
  onBack: () => void;
}

export const InspectionSummaryScreen: React.FC<InspectionSummaryScreenProps> = ({
  inspectionId,
  onNavigateToChecklist,
  onNavigateToReport,
  onBack,
}) => {
  const panHandlers = useSmartNavigation(onBack);
  const [inspection, setInspection] = useState<Inspection | null>(null);

  const loadData = async () => {
    const data = await LocalDB.getInspectionById(inspectionId);
    if (data) setInspection(data);
  };

  useEffect(() => {
    loadData();
  }, [inspectionId]);

  if (!inspection) {
    return (
      <LoadingInspectionAnimation
        message="Generating Scorecard & Summary..."
        subMessage="Aggregating 336 inspection checkpoints"
        dark={true}
      />
    );
  }

  const results = inspection.results || {};
  const metrics = calculateInspectionMetrics(results);
  const photos = inspection.photos || [];

  // Failed items list
  const failedItems: InspectionItemResult[] = Object.values(results).filter(
    (r) => r.status === 'FAIL'
  );

  const handleMarkCompleted = async () => {
    if (metrics.pendingItems > 0) {
      Alert.alert(
        'Incomplete Inspection',
        `There are still ${metrics.pendingItems} pending checks. Do you want to mark this inspection as completed anyway, or continue checking?`,
        [
          { text: 'Keep Inspecting', style: 'cancel' },
          {
            text: 'Mark Complete',
            onPress: async () => {
              const updated = {
                ...inspection,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                certifiedBy: inspection.inspectorName,
              };
              await LocalDB.saveInspection(updated);
              setInspection(updated);
              Alert.alert('Inspection Certified', 'Inspection marked as completed.');
            },
          },
        ]
      );
      return;
    }

    const updated = {
      ...inspection,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
      certifiedBy: inspection.inspectorName,
    };
    await LocalDB.saveInspection(updated);
    setInspection(updated);
    Alert.alert('Success', 'Inspection marked as complete and verified.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} {...panHandlers}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#FFB800" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Inspection Summary</Text>
          <Text style={styles.headerSub}>{inspection.reportId}</Text>
        </View>
        <StatusBadge status={inspection.status} />
      </View>

      {/* Vehicle & Customer Card */}
      <Card style={styles.metaCard}>
        <View style={styles.vehicleRow}>
          <View style={styles.vehicleIcon}>
            <Ionicons name="car-sport" size={28} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.regNumber}>{inspection.vehicle?.registrationNumber || 'VEHICLE'}</Text>
            <Text style={styles.makeModel}>
              {inspection.vehicle?.make} {inspection.vehicle?.model} {inspection.vehicle?.variant || ''}
            </Text>
          </View>
        </View>

        <View style={styles.metaDetailsGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>CLIENT</Text>
            <Text style={styles.metaValue}>{inspection.customer?.name || 'Customer'}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>INSPECTOR</Text>
            <Text style={styles.metaValue}>{inspection.inspectorName}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>ODOMETER</Text>
            <Text style={styles.metaValue}>{inspection.odometer} km</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>DATE</Text>
            <Text style={styles.metaValue}>
              {new Date(inspection.inspectionDate).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Card>

      {/* Main Scorecard Banner */}
      <Card style={styles.scoreCard}>
        <View style={styles.scoreCardMain}>
          <View style={styles.scoreNumberContainer}>
            <Text
              style={[
                styles.scoreNumber,
                {
                  color:
                    metrics.scoredItems === 0
                      ? Colors.slate400
                      : metrics.passPercentage >= 90
                      ? Colors.pass
                      : Colors.primary,
                },
              ]}
            >
              {metrics.scoredItems > 0 ? `${metrics.passPercentage}%` : '—'}
            </Text>
            <Text style={styles.scoreNumberLabel}>
              {metrics.scoredItems > 0 ? 'PASS SCORE' : 'UNSCORED'}
            </Text>
          </View>

          <View style={styles.scoreStats}>
            <View style={styles.scoreStatRow}>
              <Text style={styles.statDotPass}>●</Text>
              <Text style={styles.statLabel}>Passed Checks:</Text>
              <Text style={styles.statValueBold}>{metrics.passedItems}</Text>
            </View>
            <View style={styles.scoreStatRow}>
              <Text style={styles.statDotFail}>●</Text>
              <Text style={styles.statLabel}>Failed Checks:</Text>
              <Text style={styles.statValueBold}>{metrics.failedItems}</Text>
            </View>
            <View style={styles.scoreStatRow}>
              <Text style={styles.statDotPending}>●</Text>
              <Text style={styles.statLabel}>Pending Checks:</Text>
              <Text style={styles.statValueBold}>{metrics.pendingItems}</Text>
            </View>
            <View style={styles.scoreStatRow}>
              <Text style={styles.statDotNeutral}>●</Text>
              <Text style={styles.statLabel}>Total Checks:</Text>
              <Text style={styles.statValueBold}>{metrics.totalItems}</Text>
            </View>
          </View>
        </View>

        <View style={styles.scoreProgressBar}>
          <View style={styles.scoreProgressTextRow}>
            <Text style={styles.scoreProgressLabel}>Completion Progress</Text>
            <Text style={styles.scoreProgressPct}>{metrics.completionPercentage}%</Text>
          </View>
          <ProgressBar
            percentage={metrics.completionPercentage}
            height={8}
            color={metrics.failedItems > 0 ? Colors.primary : Colors.pass}
          />
        </View>
      </Card>

      {/* Category Progress Breakdown */}
      <Text style={styles.sectionHeader}>CATEGORY QUALITY BREAKDOWN</Text>
      <Card style={styles.categoryGridCard}>
        {metrics.categorySummaries.map((cat) => {
          const isScored = cat.passed + cat.failed > 0;
          return (
            <View key={cat.code} style={styles.categoryRow}>
              <View style={styles.catLeft}>
                <View style={styles.catCodeTag}>
                  <Text style={styles.catCodeTagText}>{cat.shortLabel}</Text>
                </View>
                <View>
                  <Text style={styles.catName}>{cat.name}</Text>
                  <Text style={styles.catCounts}>
                    {cat.passed} / {cat.total} passed • {cat.pending} pending
                  </Text>
                </View>
              </View>

              <View style={styles.catRight}>
                <Text
                  style={[
                    styles.catPct,
                    {
                      color: isScored
                        ? cat.passPercentage === 100
                          ? Colors.pass
                          : Colors.primary
                        : Colors.slate400,
                    },
                  ]}
                >
                  {isScored ? `${cat.passPercentage}%` : '—'}
                </Text>
              </View>
            </View>
          );
        })}
      </Card>

      {/* Failed Checks List (Observations) */}
      <Text style={styles.sectionHeader}>
        DEFECT OBSERVATIONS ({failedItems.length})
      </Text>
      {failedItems.length === 0 ? (
        <Card style={styles.emptyDefectsCard}>
          <Ionicons name="checkmark-circle" size={32} color={Colors.pass} />
          <Text style={styles.noDefectsTitle}>No Failed Checks Recorded</Text>
          <Text style={styles.noDefectsSub}>All completed items meet quality inspection standards.</Text>
        </Card>
      ) : (
        failedItems.map((fail) => (
          <Card key={fail.itemId} style={styles.defectCard}>
            <View style={styles.defectHeader}>
              <Text style={styles.defectCategory}>{fail.categoryName.toUpperCase()}</Text>
              <StatusBadge status="FAIL" />
            </View>
            <Text style={styles.defectItemName}>{fail.itemName}</Text>
            {fail.remarks ? (
              <View style={styles.defectRemarkBox}>
                <Ionicons name="chatbox-ellipses-outline" size={14} color={Colors.fail} />
                <Text style={styles.defectRemarkText}>{fail.remarks}</Text>
              </View>
            ) : null}
          </Card>
        ))
      )}

      {/* Photographic Evidence Gallery */}
      <Text style={styles.sectionHeader}>
        EVIDENCE GALLERY ({photos.length})
      </Text>
      {photos.length === 0 ? (
        <Card style={styles.emptyPhotosCard}>
          <Ionicons name="camera-outline" size={32} color={Colors.slate400} />
          <Text style={styles.emptyPhotosText}>No photos attached yet</Text>
        </Card>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoGallery}>
          {photos.map((p) => (
            <Card key={p.id} style={styles.photoItemCard}>
              {p.localUri ? (
                <Image source={{ uri: p.localUri }} style={styles.photoThumb} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="image" size={24} color={Colors.slate400} />
                </View>
              )}
              <Text style={styles.photoCaption} numberOfLines={1}>
                {p.caption || p.photoType}
              </Text>
            </Card>
          ))}
        </ScrollView>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          title="Return to Checklist"
          variant="outline"
          onPress={() => onNavigateToChecklist(inspection.id)}
          icon={<Ionicons name="list" size={18} color={Colors.slate800} />}
        />

        {inspection.status !== 'completed' ? (
          <Button
            title="Mark Inspection Complete"
            variant="success"
            onPress={handleMarkCompleted}
            icon={<Ionicons name="checkmark-done" size={18} color={Colors.white} />}
          />
        ) : null}

        <Button
          title="Generate & View PDF Report"
          onPress={() => onNavigateToReport(inspection.id)}
          icon={<Ionicons name="document-text" size={18} color={Colors.white} />}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: Typography.sizes.sm,
    color: Colors.slate500,
  },
  header: {
    backgroundColor: '#080C14',
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderBottomWidth: 2.5,
    borderBottomColor: '#FFB800',
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#181E29',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: Typography.sizes.xs,
    color: '#FFB800',
    fontWeight: '700',
    marginTop: 1,
  },
  metaCard: {
    marginBottom: Spacing.md,
  },
  vehicleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
    paddingBottom: 10,
    marginBottom: 10,
  },
  vehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  regNumber: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  makeModel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
  },
  metaDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    width: '45%',
  },
  metaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate400,
  },
  metaValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.slate800,
  },
  scoreCard: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FED7AA',
    marginBottom: Spacing.md,
  },
  scoreCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreNumberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 110,
    borderRightWidth: 1,
    borderRightColor: '#FED7AA',
    paddingRight: 10,
  },
  scoreNumber: {
    fontSize: 34,
    fontWeight: '900',
  },
  scoreNumberLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.slate600,
  },
  scoreStats: {
    flex: 1,
    paddingLeft: 14,
    gap: 4,
  },
  scoreStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDotPass: { color: Colors.pass, fontSize: 12 },
  statDotFail: { color: Colors.fail, fontSize: 12 },
  statDotPending: { color: Colors.pending, fontSize: 12 },
  statDotNeutral: { color: Colors.slate400, fontSize: 12 },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    flex: 1,
  },
  statValueBold: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: Colors.slate900,
  },
  scoreProgressBar: {
    borderTopWidth: 1,
    borderTopColor: '#FED7AA',
    paddingTop: 8,
  },
  scoreProgressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scoreProgressLabel: {
    fontSize: 11,
    color: Colors.slate600,
  },
  scoreProgressPct: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.slate800,
  },
  sectionHeader: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate500,
    letterSpacing: 1,
    marginVertical: 8,
  },
  categoryGridCard: {
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate100,
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  catCodeTag: {
    backgroundColor: Colors.slate100,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
    width: 44,
    alignItems: 'center',
  },
  catCodeTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate700,
  },
  catName: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  catCounts: {
    fontSize: 10,
    color: Colors.slate500,
  },
  catRight: {
    alignItems: 'flex-end',
  },
  catPct: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
  },
  defectCard: {
    backgroundColor: '#FEF8F8',
    borderLeftWidth: 4,
    borderLeftColor: Colors.fail,
    marginBottom: 6,
    padding: Spacing.md,
  },
  defectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  defectCategory: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.failDark,
  },
  defectItemName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.semiBold,
    color: Colors.slate900,
  },
  defectRemarkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FDE8E8',
    padding: 6,
    borderRadius: 4,
    marginTop: 6,
  },
  defectRemarkText: {
    fontSize: Typography.sizes.xs,
    color: Colors.failDark,
  },
  emptyDefectsCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  noDefectsTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.passDark,
    marginTop: 6,
  },
  noDefectsSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  emptyPhotosCard: {
    alignItems: 'center',
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  emptyPhotosText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 4,
  },
  photoGallery: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  photoItemCard: {
    width: 120,
    padding: 6,
    marginRight: 8,
  },
  photoThumb: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    marginBottom: 4,
  },
  photoPlaceholder: {
    width: '100%',
    height: 80,
    borderRadius: 6,
    backgroundColor: Colors.slate200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  photoCaption: {
    fontSize: 10,
    color: Colors.slate700,
    textAlign: 'center',
  },
  actionButtonsContainer: {
    gap: 10,
    marginTop: Spacing.md,
  },
});

