// Screen F: Inspection Checklist — THE MOST IMPORTANT SCREEN
// Closely reproduces the 22-page reference PDF checklist structure:
// 8 Categories, 46 Subsections, 336 Items with exact names, PASS/FAIL/PENDING controls,
// autosave, offline persistence, defect observation enforcement, and evidence capture.

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  CHECKLIST_CATEGORIES,
  ChecklistCategoryDefinition,
  ChecklistItemDefinition,
} from '../data/checklistDefinition';
import {
  Inspection,
  CheckResultStatus,
  InspectionItemResult,
} from '../types';
import { Colors, Spacing, Typography } from '../theme/colors';
import { ProgressBar, Button } from '../components/common';
import { ChecklistRow } from '../components/checklist/ChecklistRow';
import { LocalDB } from '../services/storage/localDatabase';
import { ImageService } from '../services/storage/imageService';
import { calculateInspectionMetrics } from '../utils/inspectionCalculations';

interface InspectionChecklistScreenProps {
  inspectionId: string;
  onNavigateToSummary: (id: string) => void;
  onBack: () => void;
}

export const InspectionChecklistScreen: React.FC<InspectionChecklistScreenProps> = ({
  inspectionId,
  onNavigateToSummary,
  onBack,
}) => {
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>('EXT');
  const [savingStatus, setSavingStatus] = useState<string>('Saved');
  const scrollRef = useRef<any>(null);

  const loadInspection = async () => {
    const data = await LocalDB.getInspectionById(inspectionId);
    if (data) {
      setInspection(data);
    }
  };

  useEffect(() => {
    loadInspection();
  }, [inspectionId]);

  if (!inspection) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading inspection checklist...</Text>
      </View>
    );
  }

  const results = inspection.results || {};
  const metrics = calculateInspectionMetrics(results);

  // Active Category
  const activeCategory: ChecklistCategoryDefinition =
    CHECKLIST_CATEGORIES.find((c) => c.code === selectedCategoryCode) ||
    CHECKLIST_CATEGORIES[0];

  // Update item status with autosave
  const handleUpdateStatus = async (
    itemId: string,
    status: CheckResultStatus,
    remarks?: string
  ) => {
    setSavingStatus('Saving...');
    try {
      // Find item metadata
      let foundItem: ChecklistItemDefinition | undefined;
      for (const cat of CHECKLIST_CATEGORIES) {
        for (const sub of cat.subsections) {
          const match = sub.items.find((i) => i.id === itemId);
          if (match) {
            foundItem = match;
            break;
          }
        }
        if (foundItem) break;
      }

      if (!foundItem) return;

      const itemResult: InspectionItemResult = {
        id: itemId,
        inspectionId: inspection.id,
        itemId: foundItem.id,
        categoryName: foundItem.category,
        categoryCode: foundItem.categoryCode,
        subsectionName: foundItem.subsection,
        itemName: foundItem.name,
        itemOrder: foundItem.order,
        status,
        remarks: remarks || '',
        referenceValue: foundItem.referenceValue,
        updatedAt: new Date().toISOString(),
      };

      const updated = await LocalDB.updateItemResult(inspection.id, itemResult);
      if (updated) {
        setInspection(updated);
        setSavingStatus('Saved ✓');
      }
    } catch (err) {
      console.error('Autosave error:', err);
      setSavingStatus('Save failed! Retrying...');
    }
  };

  // Attach photographic evidence to an item
  const handleAttachPhoto = async (itemId: string) => {
    Alert.alert(
      'Attach Evidence Photo',
      'Take a photo or choose from gallery to link as evidence for this check.',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const uri = await ImageService.takePhoto();
            if (uri) {
              await ImageService.attachPhoto({
                inspectionId: inspection.id,
                resultId: itemId,
                localUri: uri,
                photoType: 'evidence_fail',
                caption: `Evidence for check ${itemId}`,
              });
              await loadInspection();
            }
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const uri = await ImageService.pickImage();
            if (uri) {
              await ImageService.attachPhoto({
                inspectionId: inspection.id,
                resultId: itemId,
                localUri: uri,
                photoType: 'evidence_fail',
                caption: `Evidence for check ${itemId}`,
              });
              await loadInspection();
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Jump to Next Pending Item
  const handleJumpToNextPending = () => {
    for (const cat of CHECKLIST_CATEGORIES) {
      for (const sub of cat.subsections) {
        for (const item of sub.items) {
          const itemRes = results[item.id];
          const isPending = !itemRes || itemRes.status === 'PENDING';
          if (isPending) {
            setSelectedCategoryCode(cat.code);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            return;
          }
        }
      }
    }
    Alert.alert('All Checks Completed!', 'Every applicable checklist item has been scored.');
  };

  return (
    <View style={styles.container}>
      {/* Workshop Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.topHeaderRow}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.topHeaderTitles}>
            <Text style={styles.reportIdText}>
              {inspection.reportId} • {inspection.vehicle?.registrationNumber || 'VEHICLE'}
            </Text>
            <Text style={styles.vehicleSubtitle}>
              {inspection.vehicle?.make} {inspection.vehicle?.model}
            </Text>
          </View>
          <View style={styles.saveStatusBadge}>
            <Text style={styles.saveStatusText}>{savingStatus}</Text>
          </View>
        </View>

        {/* Live Progress Bar & Counter Banner */}
        <View style={styles.progressContainer}>
          <View style={styles.counterRow}>
            <Text style={styles.counterText}>
              Progress: <Text style={styles.bold}>{metrics.scoredItems} / {metrics.totalItems}</Text> ({metrics.completionPercentage}%)
            </Text>
            <View style={styles.badgesCluster}>
              <Text style={styles.passCount}>✓ {metrics.passedItems} Pass</Text>
              <Text style={styles.failCount}>✗ {metrics.failedItems} Fail</Text>
              <Text style={styles.pendingCount}>⏳ {metrics.pendingItems} Pending</Text>
            </View>
          </View>

          <ProgressBar
            percentage={metrics.completionPercentage}
            height={6}
            color={metrics.failedItems > 0 ? Colors.primary : Colors.pass}
          />
        </View>
      </View>

      {/* Category Horizontal Navigation Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {CHECKLIST_CATEGORIES.map((cat) => {
            const isSelected = cat.code === selectedCategoryCode;
            const catSummary = metrics.categorySummaries.find((c) => c.code === cat.code);
            const catPending = catSummary ? catSummary.pending : cat.totalItems;
            const catFailed = catSummary ? catSummary.failed : 0;

            return (
              <TouchableOpacity
                key={cat.code}
                activeOpacity={0.7}
                onPress={() => setSelectedCategoryCode(cat.code)}
                style={[styles.tabItem, isSelected && styles.tabItemActive]}
              >
                <View style={styles.tabTitleRow}>
                  <Text style={[styles.tabLabel, isSelected && styles.tabLabelActive]}>
                    {cat.name}
                  </Text>
                  {catFailed > 0 ? (
                    <View style={styles.tabFailBadge}>
                      <Text style={styles.tabFailBadgeText}>{catFailed}</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={[styles.tabSub, isSelected && styles.tabSubActive]}>
                  {catPending > 0 ? `${catPending} left` : 'Completed ✓'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Checklist Items List */}
      <ScrollView ref={scrollRef} style={styles.itemsScrollView} contentContainerStyle={styles.itemsContent}>
        <View style={styles.categoryTitleBanner}>
          <Text style={styles.categoryTitleText}>{activeCategory.name.toUpperCase()}</Text>
          <Text style={styles.categoryCountText}>{activeCategory.totalItems} Checks in this Section</Text>
        </View>

        {activeCategory.subsections.map((sub, subIdx) => (
          <View key={subIdx} style={styles.subsectionBlock}>
            {/* Subsection Header */}
            <View style={styles.subHeader}>
              <Text style={styles.subHeaderText}>{sub.name}</Text>
              <Text style={styles.subCountText}>({sub.items.length} items)</Text>
            </View>

            {/* Subsection Rows */}
            {sub.items.map((item) => {
              const itemResult = results[item.id];
              const photoCount =
                inspection.photos?.filter((p) => p.resultId === item.id).length || 0;

              return (
                <ChecklistRow
                  key={item.id}
                  item={item}
                  result={itemResult}
                  onUpdateStatus={handleUpdateStatus}
                  onAttachPhoto={handleAttachPhoto}
                  photoCount={photoCount}
                />
              );
            })}
          </View>
        ))}

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <Button
            title="Jump to Next Pending"
            variant="outline"
            onPress={handleJumpToNextPending}
            icon={<Ionicons name="flash-outline" size={16} color={Colors.primary} />}
            style={styles.jumpBtn}
          />

          <Button
            title="Review Summary & Report"
            onPress={() => onNavigateToSummary(inspection.id)}
            icon={<Ionicons name="document-text-outline" size={18} color={Colors.white} />}
            style={styles.summaryBtn}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.slate600,
    fontSize: Typography.sizes.sm,
  },
  topHeader: {
    backgroundColor: Colors.slate900,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  backBtn: {
    padding: 6,
    marginRight: 6,
  },
  topHeaderTitles: {
    flex: 1,
  },
  reportIdText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  vehicleSubtitle: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  saveStatusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saveStatusText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 2,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  counterText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate300,
  },
  bold: {
    fontWeight: '700',
    color: Colors.white,
  },
  badgesCluster: {
    flexDirection: 'row',
    gap: 8,
  },
  passCount: {
    fontSize: 11,
    color: Colors.pass,
    fontWeight: '700',
  },
  failCount: {
    fontSize: 11,
    color: Colors.fail,
    fontWeight: '700',
  },
  pendingCount: {
    fontSize: 11,
    color: Colors.pending,
    fontWeight: '700',
  },
  tabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  tabsScroll: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    gap: 6,
  },
  tabItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.slate50,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabItemActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  tabTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
  },
  tabLabelActive: {
    color: Colors.primaryDark,
  },
  tabSub: {
    fontSize: 10,
    color: Colors.slate400,
    marginTop: 2,
  },
  tabSubActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
  tabFailBadge: {
    backgroundColor: Colors.fail,
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabFailBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  itemsScrollView: {
    flex: 1,
  },
  itemsContent: {
    paddingBottom: Spacing.xxxl,
  },
  categoryTitleBanner: {
    backgroundColor: Colors.slate100,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitleText: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate800,
    letterSpacing: 0.5,
  },
  categoryCountText: {
    fontSize: 11,
    color: Colors.slate500,
  },
  subsectionBlock: {
    marginBottom: 6,
  },
  subHeader: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  subHeaderText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  subCountText: {
    fontSize: 10,
    color: Colors.slate600,
  },
  bottomActions: {
    padding: Spacing.lg,
    gap: 12,
  },
  jumpBtn: {
    width: '100%',
  },
  summaryBtn: {
    width: '100%',
  },
});
