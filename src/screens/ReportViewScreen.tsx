// Screen I: Professional PDF Report Viewer & Share
// Generates official PDF report matching the 22-page reference PDF structure,
// triggers native OS sharing interface, and allows re-generation after changes.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inspection } from '../types';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Card, Button, StatusBadge } from '../components/common';
import { generateAndShareInspectionPdf } from '../services/reporting/generatePdfReport';
import { calculateInspectionMetrics } from '../utils/inspectionCalculations';

interface ReportViewScreenProps {
  inspection: Inspection;
  onBack: () => void;
}

export const ReportViewScreen: React.FC<ReportViewScreenProps> = ({
  inspection,
  onBack,
}) => {
  const [generating, setGenerating] = useState(false);
  const [lastPdfUri, setLastPdfUri] = useState<string | null>(null);

  const metrics = calculateInspectionMetrics(inspection.results);

  const handleSharePdf = async () => {
    setGenerating(true);
    try {
      const uri = await generateAndShareInspectionPdf(inspection, 'share');
      setLastPdfUri(uri);
    } catch (e: any) {
      Alert.alert('PDF Generation Error', e?.message || 'Could not generate report.');
    } finally {
      setGenerating(false);
    }
  };

  const handlePrintPdf = async () => {
    setGenerating(true);
    try {
      const uri = await generateAndShareInspectionPdf(inspection, 'print');
      setLastPdfUri(uri);
    } catch (e: any) {
      Alert.alert('Print Error', e?.message || 'Could not print report.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>Official Inspection Report</Text>
          <Text style={styles.headerSub}>{inspection.reportId}</Text>
        </View>
        <StatusBadge status={inspection.status} />
      </View>

      {/* Report Info Card */}
      <Card style={styles.reportCard}>
        <View style={styles.badgeRow}>
          <Text style={styles.confidentialBadge}>CONFIDENTIAL • Z9 AUTOMOTIVE</Text>
        </View>

        <Text style={styles.reportTitle}>Vehicle Inspection Report</Text>
        <Text style={styles.vehicleName}>
          {inspection.vehicle?.make} {inspection.vehicle?.model}
        </Text>
        <Text style={styles.vehicleDetails}>
          Reg: {inspection.vehicle?.registrationNumber || 'N/A'} • VIN: {inspection.vehicle?.vin || 'N/A'}
        </Text>

        <View style={styles.divider} />

        <View style={styles.summaryGrid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>OVERALL SCORE</Text>
            <Text style={styles.gridValueScore}>
              {metrics.scoredItems > 0 ? `${metrics.passPercentage}%` : 'Unscored'}
            </Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>TOTAL ITEMS</Text>
            <Text style={styles.gridValue}>{metrics.totalItems} Checks</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>INSPECTOR</Text>
            <Text style={styles.gridValue}>{inspection.inspectorName}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>DATE</Text>
            <Text style={styles.gridValue}>
              {new Date(inspection.inspectionDate).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View style={styles.certificateNotice}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.pass} />
          <Text style={styles.certificateNoticeText}>
            Includes Official Certification of Inspection document and comprehensive 8-category defect assessment matching PDI-000028 format.
          </Text>
        </View>
      </Card>

      {/* PDF Actions Card */}
      <Card style={styles.actionsCard}>
        <Text style={styles.actionsTitle}>Report Export & Sharing</Text>
        <Text style={styles.actionsSub}>
          Generate a high-resolution, print-ready PDF containing all 336 inspection points, defect remarks, and photographic evidence.
        </Text>

        <Button
          title={generating ? 'Generating PDF...' : 'Share PDF Report'}
          loading={generating}
          onPress={handleSharePdf}
          icon={<Ionicons name="share-social-outline" size={18} color={Colors.white} />}
          style={styles.primaryActionBtn}
        />

        <Button
          title="Print / Save as PDF"
          variant="outline"
          disabled={generating}
          onPress={handlePrintPdf}
          icon={<Ionicons name="print-outline" size={18} color={Colors.slate800} />}
          style={styles.secondaryActionBtn}
        />

        {lastPdfUri ? (
          <View style={styles.generatedUriBox}>
            <Ionicons name="document-attach" size={16} color={Colors.pass} />
            <Text style={styles.uriText} numberOfLines={1}>
              Saved: {lastPdfUri.split('/').pop()}
            </Text>
          </View>
        ) : null}
      </Card>
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
  header: {
    backgroundColor: Colors.slate900,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  headerSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
  },
  reportCard: {
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  badgeRow: {
    marginBottom: 8,
  },
  confidentialBadge: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.slate500,
    letterSpacing: 1,
  },
  reportTitle: {
    fontSize: Typography.sizes.title,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  vehicleName: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
    marginTop: 2,
  },
  vehicleDetails: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.slate200,
    marginVertical: Spacing.lg,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '45%',
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate400,
  },
  gridValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginTop: 2,
  },
  gridValueScore: {
    fontSize: Typography.sizes.xl,
    fontWeight: '900',
    color: Colors.pass,
    marginTop: 2,
  },
  certificateNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.passLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginTop: Spacing.lg,
  },
  certificateNoticeText: {
    flex: 1,
    fontSize: Typography.sizes.xs,
    color: Colors.passDark,
    lineHeight: 16,
  },
  actionsCard: {
    padding: Spacing.xl,
  },
  actionsTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  actionsSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 4,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  primaryActionBtn: {
    marginBottom: 10,
  },
  secondaryActionBtn: {
    marginBottom: 10,
  },
  generatedUriBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.slate100,
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
  uriText: {
    fontSize: 11,
    color: Colors.slate700,
    flex: 1,
  },
});

