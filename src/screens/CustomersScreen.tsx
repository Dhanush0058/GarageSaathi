// Screen C: Customers Management
// Search customers, create customer, link multiple vehicles, and view inspection history.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from '../theme/colors';
import { Card, Button } from '../components/common';
import { Customer } from '../types';
import { LocalDB } from '../services/storage/localDatabase';

export const CustomersScreen: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // New Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const loadCustomers = async () => {
    const list = await LocalDB.getCustomers();
    setCustomers(list);
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleCreateCustomer = async () => {
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Customer name and phone number are required.');
      return;
    }
    setErrorMsg('');

    await LocalDB.saveCustomer({
      organizationId: 'org-001',
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      city: city.trim() || undefined,
      address: address.trim() || undefined,
    });

    // Reset and reload
    setName('');
    setPhone('');
    setEmail('');
    setCity('');
    setAddress('');
    setModalVisible(false);
    await loadCustomers();
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.city && c.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Search and Action Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={Colors.slate400} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, phone, city..."
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

        <Button
          title="Add Customer"
          onPress={() => setModalVisible(true)}
          icon={<Ionicons name="person-add" size={16} color={Colors.white} />}
          size="sm"
          style={styles.addBtn}
        />
      </View>

      {/* Customer List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card style={styles.customerCard}>
            <View style={styles.customerHeader}>
              <View style={styles.customerAvatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{item.name}</Text>
                <Text style={styles.customerPhone}>📞 {item.phone}</Text>
                {item.city ? <Text style={styles.customerCity}>📍 {item.city}</Text> : null}
              </View>
            </View>

            {item.email ? <Text style={styles.customerEmail}>✉️ {item.email}</Text> : null}
            {item.address ? (
              <Text style={styles.customerAddress}>🏠 {item.address}</Text>
            ) : null}
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={Colors.slate300} />
            <Text style={styles.emptyText}>No customers found</Text>
          </View>
        }
      />

      {/* Add Customer Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Register New Customer</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.slate500} />
              </TouchableOpacity>
            </View>

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. V Rajeev"
                placeholderTextColor={Colors.slate400}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number *</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. 7893650288"
                placeholderTextColor={Colors.slate400}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email (Optional)</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. rajeev@example.com"
                placeholderTextColor={Colors.slate400}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Hyderabad"
                placeholderTextColor={Colors.slate400}
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Jubilee Hills, Hyderabad"
                placeholderTextColor={Colors.slate400}
                value={address}
                onChangeText={setAddress}
              />
            </View>

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Save Customer"
                onPress={handleCreateCustomer}
                style={styles.modalBtn}
              />
            </View>
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
  customerCard: {
    marginBottom: 8,
    padding: Spacing.md,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.bold,
    color: Colors.primaryDark,
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: Typography.sizes.base,
    fontWeight: '900',
    color: '#000000',
  },
  customerPhone: {
    fontSize: Typography.sizes.xs,
    color: '#000000',
    fontWeight: '800',
    marginTop: 1,
  },
  customerCity: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: '#0F172A',
  },
  customerEmail: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 4,
  },
  customerAddress: {
    fontSize: Typography.sizes.xs,
    fontWeight: '700',
    color: '#1E293B',
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
    maxHeight: '90%',
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
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
  },
});

