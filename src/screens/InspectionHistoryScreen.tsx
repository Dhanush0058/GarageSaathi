// Screen J: Inspection History and Chronological Search
// Filter inspections by Report ID, Registration, Customer, Status, and Date.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Card, StatusBadge, ProgressBar } from '../components/common';
import { Inspection } from '../types';
import { LocalDB } from '../services/storage/localDatabase';

interface InspectionHistoryScreenProps {
  onSelectInspection: (inspectionId: string) => void;
  onBack: () => void;
}

export const InspectionHistoryScreen: React.FC<InspectionHistoryScreenProps> = ({
  onSelectInspection,
  onBack,
}) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'draft' | 'in_progress' | 'completed'>('ALL');

  const loadData = async () => {
    const list = await LocalDB.getInspections();
    setInspections(list);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = inspections.filter((i) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      i.reportId.toLowerCase().includes(query) ||
      (i.vehicle?.registrationNumber && i.vehicle.registrationNumber.toLowerCase().includes(query)) ||
      (i.vehicle?.make && i.vehicle.make.toLowerCase().includes(query)) ||
      (i.vehicle?.model && i.vehicle.model.toLowerCase().includes(query)) ||
      (i.customer?.name && i.customer.name.toLowerCase().includes(query)) ||
      (i.inspectorName && i.inspectorName.toLowerCase().includes(query));

    const matchesStatus = statusFilter === 'ALL' || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection History</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.slate400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Report ID, Reg No, Client, Model..."
            placeholderTextColor={Colors.slate400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color={Colors.slate400} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Status Filter Chips */}
        <View style={styles.filterRow}>
          {(['ALL', 'completed', 'in_progress', 'draft'] as const).map((st) => (
            <TouchableOpacity
              key={st}
              onPress={() => setStatusFilter(st)}
              style={[
                styles.filterChip,
                statusFilter === st && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === st && styles.filterChipTextActive,
                ]}
              >
                {st.replace('_', ' ').toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Chronological List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card onPress={() => onSelectInspection(item.id)} style={styles.itemCard}>
            <View style={styles.itemHeader}>
              <View>
                <Text style={styles.reportId}>{item.reportId}</Text>
                <Text style={styles.vehicleReg}>
                  {item.vehicle?.registrationNumber || 'VEHICLE'} • {item.vehicle?.make} {item.vehicle?.model}
                </Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <View style={styles.clientRow}>
              <Text style={styles.clientText}>
                👤 {item.customer?.name || 'Customer'} • 🔍 {item.inspectorName}
              </Text>
              <Text style={styles.dateText}>
                {new Date(item.inspectionDate).toLocaleDateString()}
              </Text>
            </View>

            {/* Score & Progress */}
            <View style={styles.progressRow}>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>
                  {item.scoredItems || 0} / {item.totalItems || 336} scored ({item.completionPercentage || 0}%)
                </Text>
                <Text style={styles.passScore}>
                  Pass: {item.passPercentage || 0}%
                </Text>
              </View>
              <ProgressBar
                percentage={item.completionPercentage || 0}
                height={6}
                color={item.passPercentage === 100 ? Colors.pass : Colors.primary}
              />
            </View>
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={48} color={Colors.slate300} />
            <Text style={styles.emptyTitle}>No matching inspections</Text>
            <Text style={styles.emptySub}>Try adjusting your search criteria or status filter.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.slate900,
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  backBtn: {
    padding: 6,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  searchContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
    gap: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.slate100,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.slate900,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  filterChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate600,
  },
  filterChipTextActive: {
    color: Colors.primaryText,
  },
  listContent: {
    padding: Spacing.md,
  },
  itemCard: {
    marginBottom: 8,
    padding: Spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reportId: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.primary,
  },
  vehicleReg: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
    marginTop: 2,
  },
  clientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  clientText: {
    fontSize: 11,
    color: Colors.slate600,
  },
  dateText: {
    fontSize: 11,
    color: Colors.slate400,
  },
  progressRow: {
    marginTop: 6,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: Colors.slate500,
  },
  passScore: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate700,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.slate700,
    marginTop: 8,
  },
  emptySub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
});

