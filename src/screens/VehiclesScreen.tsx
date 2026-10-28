// Screen D: Vehicles Registration & Profile
// Register vehicle, capture vehicle photo, view inspection history, and search vehicles.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Card, Button } from '../components/common';
import { Vehicle, Customer } from '../types';
import { LocalDB } from '../services/storage/localDatabase';
import { ImageService } from '../services/storage/imageService';

interface VehiclesScreenProps {
  onStartInspectionForVehicle?: (vehicle: Vehicle) => void;
}

export const VehiclesScreen: React.FC<VehiclesScreenProps> = ({
  onStartInspectionForVehicle,
}) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [make, setMake] = useState('HYUNDAI');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [fuelType, setFuelType] = useState<Vehicle['fuelType']>('Petrol');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>('Manual');
  const [vin, setVin] = useState('');
  const [engineNumber, setEngineNumber] = useState('');
  const [odometer, setOdometer] = useState('0');
  const [fuelLevel, setFuelLevel] = useState<Vehicle['fuelLevel']>('Empty');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadData = async () => {
    const vList = await LocalDB.getVehicles();
    const cList = await LocalDB.getCustomers();
    setVehicles(vList);
    setCustomers(cList);
    if (cList.length > 0 && !selectedCustomerId) {
      setSelectedCustomerId(cList[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCapturePhoto = async () => {
    const uri = await ImageService.takePhoto();
    if (uri) setPhotoUri(uri);
  };

  const handlePickPhoto = async () => {
    const uri = await ImageService.pickImage();
    if (uri) setPhotoUri(uri);
  };

  const handleCreateVehicle = async () => {
    if (!registrationNumber.trim() || !make.trim() || !model.trim()) {
      setErrorMsg('Registration number, make, and model are required.');
      return;
    }
    setErrorMsg('');

    const matchedCustomer = customers.find((c) => c.id === selectedCustomerId);

    await LocalDB.saveVehicle({
      organizationId: 'org-001',
      customerId: selectedCustomerId || (customers[0]?.id || 'cust-001'),
      customerName: matchedCustomer?.name,
      customerPhone: matchedCustomer?.phone,
      registrationNumber: registrationNumber.trim().toUpperCase(),
      make: make.trim().toUpperCase(),
      model: model.trim(),
      variant: variant.trim() || undefined,
      fuelType,
      transmission,
      vin: vin.trim() || undefined,
      engineNumber: engineNumber.trim() || undefined,
      odometer: parseInt(odometer, 10) || 0,
      fuelLevel,
      photoUrl: photoUri || undefined,
      notes: notes.trim() || undefined,
    });

    // Reset and reload
    setRegistrationNumber('');
    setModel('');
    setVariant('');
    setVin('');
    setEngineNumber('');
    setOdometer('0');
    setPhotoUri(null);
    setNotes('');
    setModalVisible(false);
    await loadData();
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (v.customerName && v.customerName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Top Search Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.slate400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by reg number, make, model..."
            placeholderTextColor={Colors.slate400}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Button
          title="Register Vehicle"
          onPress={() => setModalVisible(true)}
          icon={<Ionicons name="car-outline" size={16} color={Colors.white} />}
          size="sm"
          style={styles.addBtn}
        />
      </View>

      {/* Vehicles List */}
      <FlatList
        data={filteredVehicles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.vehicleCard}>
            <View style={styles.cardHeader}>
              <View style={styles.vehicleTitleRow}>
                <View style={styles.carIconBox}>
                  <Ionicons name="car-sport" size={24} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.regNumber}>{item.registrationNumber}</Text>
                  <Text style={styles.makeModel}>
                    {item.make} {item.model} {item.variant ? `• ${item.variant}` : ''}
                  </Text>
                </View>
              </View>

              {onStartInspectionForVehicle ? (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => onStartInspectionForVehicle(item)}
                  style={styles.inspectBtn}
                >
                  <Ionicons name="clipboard" size={16} color={Colors.white} />
                  <Text style={styles.inspectBtnText}>Inspect</Text>
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.specsRow}>
              <View style={styles.specBadge}>
                <Text style={styles.specText}>⛽ {item.fuelType}</Text>
              </View>
              <View style={styles.specBadge}>
                <Text style={styles.specText}>⚙️ {item.transmission}</Text>
              </View>
              <View style={styles.specBadge}>
                <Text style={styles.specText}>🛣️ {item.odometer} km</Text>
              </View>
              <View style={styles.specBadge}>
                <Text style={styles.specText}>🔋 Fuel: {item.fuelLevel}</Text>
              </View>
            </View>

            {item.vin ? <Text style={styles.vinText}>VIN: {item.vin}</Text> : null}
            {item.customerName ? (
              <Text style={styles.customerText}>
                Owner: {item.customerName} ({item.customerPhone})
              </Text>
            ) : null}
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={48} color={Colors.slate300} />
            <Text style={styles.emptyText}>No vehicles found</Text>
          </View>
        }
      />

      {/* Register Vehicle Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register Vehicle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.slate500} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              {/* Customer Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Select Owner / Customer *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.customerChips}>
                  {customers.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.7}
                      onPress={() => setSelectedCustomerId(c.id)}
                      style={[
                        styles.chip,
                        selectedCustomerId === c.id && styles.chipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedCustomerId === c.id && styles.chipTextActive,
                        ]}
                      >
                        {c.name} ({c.phone.slice(-4)})
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Registration Number *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. TS08EP9928"
                  placeholderTextColor={Colors.slate400}
                  autoCapitalize="characters"
                  value={registrationNumber}
                  onChangeText={setRegistrationNumber}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Make *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. HYUNDAI"
                    placeholderTextColor={Colors.slate400}
                    autoCapitalize="characters"
                    value={make}
                    onChangeText={setMake}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Model *</Text>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="e.g. VENUE"
                    placeholderTextColor={Colors.slate400}
                    value={model}
                    onChangeText={setModel}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Variant (Optional)</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. SX 1.2 Petrol"
                  placeholderTextColor={Colors.slate400}
                  value={variant}
                  onChangeText={setVariant}
                />
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Fuel Type</Text>
                  <View style={styles.chipRow}>
                    {(['Petrol', 'Diesel', 'CNG', 'Electric'] as const).map((ft) => (
                      <TouchableOpacity
                        key={ft}
                        onPress={() => setFuelType(ft)}
                        style={[styles.smallChip, fuelType === ft && styles.chipActive]}
                      >
                        <Text style={[styles.smallChipText, fuelType === ft && styles.chipTextActive]}>
                          {ft}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.rowInputs}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Odometer (km)</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    value={odometer}
                    onChangeText={setOdometer}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Fuel Level</Text>
                  <View style={styles.chipRow}>
                    {(['Empty', '1/4', '1/2', 'Full'] as const).map((fl) => (
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
                  </View>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>VIN / Chassis Number</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g. MALFG81FLTD130407"
                  placeholderTextColor={Colors.slate400}
                  autoCapitalize="characters"
                  value={vin}
                  onChangeText={setVin}
                />
              </View>

              {/* Photo capture */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vehicle Photo</Text>
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
                {photoUri ? (
                  <Image source={{ uri: photoUri }} style={styles.previewImage} />
                ) : null}
              </View>

              <View style={styles.modalButtons}>
                <Button
                  title="Cancel"
                  variant="outline"
                  onPress={() => setModalVisible(false)}
                  style={styles.modalBtn}
                />
                <Button
                  title="Save Vehicle"
                  onPress={handleCreateVehicle}
                  style={styles.modalBtn}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    padding: Spacing.md,
    backgroundColor: Colors.white,
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
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.sizes.sm,
    color: Colors.slate900,
  },
  addBtn: {
    alignSelf: 'flex-start',
  },
  listContent: {
    padding: Spacing.md,
  },
  vehicleCard: {
    marginBottom: 10,
    padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  vehicleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  carIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  regNumber: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  makeModel: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 1,
  },
  inspectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 4,
  },
  inspectBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
    color: Colors.white,
  },
  specsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  specBadge: {
    backgroundColor: Colors.slate100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  specText: {
    fontSize: 11,
    color: Colors.slate700,
    fontWeight: '500',
  },
  vinText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 4,
  },
  customerText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate600,
    fontWeight: '600',
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: Typography.sizes.sm,
    color: Colors.slate500,
    marginTop: 10,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.xl,
    maxHeight: '92%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  errorText: {
    color: Colors.fail,
    fontSize: Typography.sizes.xs,
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.slate700,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  modalInput: {
    backgroundColor: Colors.slate50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: Typography.sizes.sm,
    color: Colors.slate900,
  },
  customerChips: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primaryDark,
  },
  chipText: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate700,
  },
  chipTextActive: {
    color: Colors.primaryText,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 4,
  },
  smallChip: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.slate100,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallChipText: {
    fontSize: 10,
    color: Colors.slate700,
  },
  photoActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  previewImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginTop: 6,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
    marginBottom: 20,
  },
  modalBtn: {
    flex: 1,
  },
});

