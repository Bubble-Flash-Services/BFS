import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { getAddresses, addAddress, deleteAddress } from '../../api/addresses';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { PrimaryButton } from '../../components/Buttons';
import { EmptyState } from '../../components/UI';

const LABEL_OPTIONS = ['Home', 'Work', 'Other'];

export default function AddressesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ label: 'Home', street: '', city: 'Bengaluru', state: 'Karnataka', pincode: '' });

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  useEffect(() => {
    if (isAuthenticated) fetchAddresses();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const data = await getAddresses();
      setAddresses(Array.isArray(data?.addresses) ? data.addresses : Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.street.trim() || !form.pincode.trim()) {
      Toast.show({ type: 'error', text1: 'Please enter street and pincode' });
      return;
    }
    setSaving(true);
    try {
      await addAddress(form);
      Toast.show({ type: 'success', text1: 'Address added!' });
      setShowModal(false);
      setForm({ label: 'Home', street: '', city: 'Bengaluru', state: 'Karnataka', pincode: '' });
      fetchAddresses();
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to add address' });
    } finally { setSaving(false); }
  };

  const handleDelete = (id) => {
    Alert.alert('Delete Address', 'Remove this address?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteAddress(id);
          Toast.show({ type: 'success', text1: 'Address removed' });
          fetchAddresses();
        } catch {
          Toast.show({ type: 'error', text1: 'Failed to delete address' });
        }
      }},
    ]);
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Saved Addresses</Text>
          <View style={{ width: 44 }} />
        </View>
        <EmptyState emoji="🔐" title="Sign in required" actionText="Log In" onAction={() => navigation.navigate('Login')} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingCenter}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : addresses.length === 0 ? (
        <EmptyState
          emoji="📍"
          title="No saved addresses"
          subtitle="Add your first delivery address"
          actionText="Add Address"
          onAction={() => setShowModal(true)}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {addresses.map((addr) => (
            <View key={addr._id} style={styles.addressCard}>
              <View style={styles.labelBadge}>
                <Text style={styles.labelText}>
                  {addr.label === 'Home' ? '🏠' : addr.label === 'Work' ? '🏢' : '📍'} {addr.label}
                </Text>
              </View>
              <Text style={styles.streetText}>{addr.street}</Text>
              <Text style={styles.cityText}>{addr.city}, {addr.state} – {addr.pincode}</Text>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(addr._id)}>
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
                <Text style={styles.deleteBtnText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      )}

      {/* Add Address Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { paddingTop: insets.top + 12 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Address</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
            {/* Label */}
            <Text style={styles.fieldLabel}>Label</Text>
            <View style={styles.labelRow}>
              {LABEL_OPTIONS.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={[styles.labelChip, form.label === l && styles.labelChipActive]}
                  onPress={() => set('label')(l)}
                >
                  <Text style={[styles.labelChipText, form.label === l && styles.labelChipTextActive]}>
                    {l === 'Home' ? '🏠 ' : l === 'Work' ? '🏢 ' : '📍 '}{l}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>Street / Area *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter street address, area"
              placeholderTextColor={Colors.placeholder}
              value={form.street}
              onChangeText={set('street')}
              multiline
            />

            <Text style={styles.fieldLabel}>City</Text>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={set('city')}
              placeholder="City"
              placeholderTextColor={Colors.placeholder}
            />

            <Text style={styles.fieldLabel}>Pincode *</Text>
            <TextInput
              style={styles.input}
              placeholder="6-digit pincode"
              placeholderTextColor={Colors.placeholder}
              keyboardType="number-pad"
              maxLength={6}
              value={form.pincode}
              onChangeText={set('pincode')}
            />

            <PrimaryButton title="Save Address" onPress={handleAdd} loading={saving} style={styles.saveBtn} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: 12,
    backgroundColor: Colors.white, ...Shadows.card,
  },
  backBtn: {
    width: 44, height: 44, alignItems: 'center', justifyContent: 'center',
    borderRadius: 22, backgroundColor: Colors.sectionBg,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  addBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.base },
  addressCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.base, marginBottom: Spacing.md, ...Shadows.card,
  },
  labelBadge: {
    backgroundColor: Colors.primaryLight, borderRadius: Radius.full,
    paddingHorizontal: 10, paddingVertical: 4,
    alignSelf: 'flex-start', marginBottom: 8,
  },
  labelText: { fontSize: 12, fontWeight: '700', color: Colors.textPrimary },
  streetText: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  cityText: { fontSize: 14, color: Colors.textSecondary, marginBottom: 10 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start' },
  deleteBtnText: { fontSize: 13, color: Colors.error, fontWeight: '600' },

  // Modal
  modal: { flex: 1, backgroundColor: Colors.white },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingBottom: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.divider,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  modalContent: { padding: Spacing.base },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6, marginTop: Spacing.md },
  labelRow: { flexDirection: 'row', gap: 8, marginBottom: 4 },
  labelChip: {
    borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: Colors.sectionBg, borderWidth: 1.5, borderColor: Colors.border,
  },
  labelChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  labelChipText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  labelChipTextActive: { color: Colors.textPrimary },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.inputBorder,
    paddingHorizontal: Spacing.base, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary,
  },
  saveBtn: { marginTop: Spacing.xl },
});
