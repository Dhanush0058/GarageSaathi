// Screen E: Create Inspection (Guided Workflow)
// Step-by-step workflow: Select Customer -> Select Vehicle -> Metadata & Photos -> Launch Checklist

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Card, Button } from '../components/common';
import { Customer, Vehicle, Inspection, UserProfile } from '../types';
import { LocalDB } from '../services/storage/localDatabase';
import { ImageService } from '../services/storage/imageService';
import { ALL_CHECKLIST_ITEMS } from '../data/checklistDefinition';
import { useSmartNavigation } from '../utils/useSmartNavigation';

interface CreateInspectionScreenProps {
  currentUser: UserProfile;
  preselectedVehicle?: Vehicle;
  onInspectionCreated: (inspectionId: string) => void;
  onCancel: () => void;
}

export const CreateInspectionScreen: React.FC<CreateInspectionScreenProps> = ({
  currentUser,
  preselectedVehicle,
  onInspectionCreated,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(preselectedVehicle ? 3 : 1);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  // Selected entities
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(
    preselectedVehicle || null
  );

  // Metadata
  const [reportId, setReportId] = useState('');
  const [odometer, setOdometer] = useState(
    preselectedVehicle ? String(preselectedVehicle.odometer) : '75'
  );
  const [fuelLevel, setFuelLevel] = useState<Inspection['fuelLevel']>(
    preselectedVehicle?.fuelLevel || 'Empty'
  );
  const [dealerSource, setDealerSource] = useState('KUN HYUNDAI MADINA GUDDA');
  const [inspectionType, setInspectionType] =
    useState<Inspection['inspectionType']>('PDI');
  const [notes, setNotes] = useState('');
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const panHandlers = useSmartNavigation(onCancel);

  useEffect(() => {
    async function init() {
      const cList = await LocalDB.getCustomers();
      const vList = await LocalDB.getVehicles();
      const nextReportId = await LocalDB.generateNextReportId();
      setCustomers(cList);
      setVehicles(vList);
      setReportId(nextReportId);

      if (preselectedVehicle) {
        const cust = cList.find((c) => c.id === preselectedVehicle.customerId);
        if (cust) setSelectedCustomer(cust);
      }
    }
    init();
  }, [preselectedVehicle]);

  const handleCapturePhoto = async () => {
    const uri = await ImageService.takePhoto();
    if (uri) setPhotoUris((prev) => [...prev, uri]);
  };

  const handlePickPhoto = async () => {
    const uri = await ImageService.pickImage();
    if (uri) setPhotoUris((prev) => [...prev, uri]);
  };

  const handleStartInspection = async () => {
    if (!selectedCustomer || !selectedVehicle) return;
    setLoading(true);

    const inspectionId = `insp-${Date.now()}`;
    const newInspection: Inspection = {
      id: inspectionId,
      organizationId: currentUser.organizationId,
      branchId: currentUser.branchId,
      reportId: reportId.trim() || `PDI-${Date.now().toString().slice(-6)}`,
      customerId: selectedCustomer.id,
      customer: selectedCustomer,
      vehicleId: selectedVehicle.id,
      vehicle: selectedVehicle,
      inspectorId: currentUser.id,
      inspectorName: currentUser.fullName,
      inspectionDate: new Date().toISOString(),
      status: 'draft',
      odometer: parseInt(odometer, 10) || 0,
      fuelLevel,
      dealerSource: dealerSource.trim() || undefined,
      inspectionType,
      notes: notes.trim() || undefined,
      totalItems: ALL_CHECKLIST_ITEMS.length,
      scoredItems: 0,
      passedItems: 0,
      failedItems: 0,
      pendingItems: ALL_CHECKLIST_ITEMS.length,
      passPercentage: 0,
      completionPercentage: 0,
      results: {},
      photos: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isOfflineDraft: true,
    };

    // Save newly created inspection
    await LocalDB.saveInspection(newInspection);

    // Attach initial photos if taken
    for (const uri of photoUris) {
      await ImageService.attachPhoto({
        inspectionId,
        localUri: uri,
        photoType: 'vehicle_front',
        caption: 'Vehicle exterior initial documentation',
      });
    }

    setLoading(false);
    onInspectionCreated(inspectionId);
  };

  return (
    <View style={styles.container} {...panHandlers}>
      {/* Z9 Themed Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} activeOpacity={0.7} style={styles.backBtn}>
          <Ionicons name="close" size={20} color="#FFB800" />
        </TouchableOpacity>
        <View style={styles.headerTitles}>
          <Text style={styles.headerBrandTag}>Z9 AUTOMOTIVE</Text>
          <Text style={styles.headerTitle}>New Vehicle Inspection</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* Step Tracker */}
      <View style={styles.stepper}>
        <View style={[styles.stepItem, step >= 1 && styles.stepItemActive]}>
          <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>1. Client</Text>
        </View>
        <View style={styles.stepDivider} />
        <View style={[styles.stepItem, step >= 2 && styles.stepItemActive]}>
          <Text style={[styles.stepText, step >= 2 && styles.stepTextActive]}>2. Vehicle</Text>
        </View>
        <View style={styles.stepDivider} />
        <View style={[styles.stepItem, step >= 3 && styles.stepItemActive]}>
          <Text style={[styles.stepText, step >= 3 && styles.stepTextActive]}>3. Details</Text>
        </View>
      </View>

      {/* STEP 1: SELECT CUSTOMER */}
      {step === 1 && (
        <Card style={styles.stepCard}>
          <Text style={styles.stepTitle}>Select Client / Customer</Text>
          <Text style={styles.stepSub}>Choose who owns or commissioned this inspection</Text>

          {customers.map((c) => (
            <TouchableOpacity
              key={c.id}
              activeOpacity={0.7}
              onPress={() => setSelectedCustomer(c)}
              style={[
                styles.selectRow,
                selectedCustomer?.id === c.id && styles.selectRowActive,
              ]}
            >
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>{c.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectRowTitle}>{c.name}</Text>
                <Text style={styles.selectRowSub}>
                  📞 {c.phone} {c.city ? `• ${c.city}` : ''}
                </Text>
              </View>
              {selectedCustomer?.id === c.id ? (
                <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              ) : null}
            </TouchableOpacity>
          ))}

          <View style={styles.btnRow}>
            <Button title="Cancel" variant="outline" onPress={onCancel} style={{ flex: 1 }} />
            <Button
              title="Next: Vehicle"
              disabled={!selectedCustomer}
              onPress={() => setStep(2)}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      )}

      {/* STEP 2: SELECT VEHICLE */}
      {step === 2 && (
        <Card style={styles.stepCard}>
          <Text style={styles.stepTitle}>Select Vehicle</Text>
          <Text style={styles.stepSub}>
            Assigned to client: {selectedCustomer?.name}
          </Text>

          {vehicles.map((v) => (
            <TouchableOpacity
              key={v.id}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedVehicle(v);
                setOdometer(String(v.odometer));
                setFuelLevel(v.fuelLevel);
              }}
              style={[
                styles.selectRow,
                selectedVehicle?.id === v.id && styles.selectRowActive,
              ]}
            >
              <View style={styles.avatarMini}>
                <Ionicons name="car-sport" size={18} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.selectRowTitle}>{v.registrationNumber}</Text>
                <Text style={styles.selectRowSub}>
                  {v.make} {v.model} • {v.fuelType}
                </Text>
              </View>
              {selectedVehicle?.id === v.id ? (
                <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
              ) : null}
            </TouchableOpacity>
          ))}

          <View style={styles.btnRow}>
            <Button title="Back" variant="outline" onPress={() => setStep(1)} style={{ flex: 1 }} />
            <Button
              title="Next: Details"
              disabled={!selectedVehicle}
              onPress={() => setStep(3)}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      )}

      {/* STEP 3: METADATA & PHOTO CAPTURE */}
      {step === 3 && (
        <Card style={styles.stepCard}>
          <Text style={styles.stepTitle}>Inspection Metadata</Text>
          <Text style={styles.stepSub}>Configure report identifier and workshop parameters</Text>

          {/* Assigned Summary Badge */}
          <View style={styles.summaryBadge}>
            <Text style={styles.summaryBadgeText}>
              Client: <Text style={styles.boldText}>{selectedCustomer?.name}</Text> | Vehicle:{' '}
              <Text style={styles.boldText}>
                {selectedVehicle?.make} {selectedVehicle?.model} ({selectedVehicle?.registrationNumber})
              </Text>
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Report Identifier</Text>
            <TextInput
              style={styles.input}
              value={reportId}
              onChangeText={setReportId}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dealer / Source</Text>
            <TextInput
              style={styles.input}
              value={dealerSource}
              onChangeText={setDealerSource}
              placeholder="e.g. KUN HYUNDAI MADINA GUDDA"
              placeholderTextColor={Colors.slate400}
            />
          </View>

          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Odometer (km)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={odometer}
                onChangeText={setOdometer}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Fuel Level</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsScroll}>
                {(['Empty', '1/4', '1/2', '3/4', 'Full'] as const).map((fl) => (
                  <TouchableOpacity
                    key={fl}
                    onPress={() => setFuelLevel(fl)}
                    style={[styles.smallChip, fuelLevel === fl && styles.chipActive]}
                  >
                    <Text style={[styles.smallChipText, fuelLevel === fl && styles.chipTextActive]}>
                      {fl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Inspection Type</Text>
            <View style={styles.chipsRow}>
              {(['PDI', 'General Inspection', 'Pre-Purchase Inspection'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setInspectionType(t)}
                  style={[styles.typeChip, inspectionType === t && styles.chipActive]}
                >
                  <Text style={[styles.typeChipText, inspectionType === t && styles.chipTextActive]}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Photo Capture Section */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Initial Vehicle Photos</Text>
            <View style={styles.photoActions}>
              <Button
                title="Camera"
                variant="outline"
                size="sm"
                onPress={handleCapturePhoto}
                icon={<Ionicons name="camera" size={16} color={Colors.primary} />}
              />
              <Button
                title="Gallery"
                variant="outline"
                size="sm"
                onPress={handlePickPhoto}
                icon={<Ionicons name="images" size={16} color={Colors.primary} />}
              />
            </View>

            {photoUris.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
                {photoUris.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={styles.thumbnail} />
                ))}
              </ScrollView>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Inspection Notes (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              multiline
              placeholder="Any special notes or pre-existing customer remarks..."
              placeholderTextColor={Colors.slate400}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          <View style={styles.btnRow}>
            <Button
              title="Back"
              variant="outline"
              onPress={() => setStep(2)}
              style={{ flex: 1 }}
            />
            <Button
              title="Launch Checklist"
              loading={loading}
              onPress={handleStartInspection}
              icon={<Ionicons name="clipboard" size={18} color={Colors.white} />}
              style={{ flex: 1.5 }}
            />
          </View>
        </Card>
      )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: '#080C14',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#FFB800',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#181E29',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  headerTitles: {
    flex: 1,
  },
  headerBrandTag: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFB800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  stepItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  stepItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  stepText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate400,
    fontWeight: '600',
  },
  stepTextActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  stepDivider: {
    width: 20,
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  stepCard: {
    padding: Spacing.lg,
  },
  stepTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  stepSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  selectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.slate50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectRowActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarMiniText: {
    fontSize: Typography.sizes.sm,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  selectRowTitle: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  selectRowSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  summaryBadge: {
    backgroundColor: Colors.primaryLight,
    padding: 10,
    borderRadius: 6,
    marginBottom: Spacing.md,
  },
  summaryBadgeText: {
    fontSize: Typography.sizes.xs,
    color: Colors.primaryDark,
  },
  boldText: {
    fontWeight: '700',
    color: Colors.slate900,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.slate700,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.slate50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: Typography.sizes.sm,
    color: Colors.slate900,
  },
  chipsScroll: {
    flexDirection: 'row',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  smallChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 4,
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  smallChipText: {
    fontSize: 11,
    color: Colors.slate700,
  },
  typeChipText: {
    fontSize: 11,
    color: Colors.slate700,
  },
  chipTextActive: {
    color: Colors.primaryText,
    fontWeight: '700',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  photoList: {
    flexDirection: 'row',
    marginTop: 6,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 6,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: Spacing.lg,
  },
});

