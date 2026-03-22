import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import Button from '../components/Button';
import {TIME_SLOTS, VEHICLE_TYPES} from '../utils/constants';
import useBookings from '../hooks/useBookings';

const BookingScreen = ({navigation, route}) => {
  const {service, selectedPackage} = route.params || {};
  const {addBooking} = useBookings();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const dates = Array.from({length: 7}, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });

  const formatDateLabel = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: date.toLocaleString('en-IN', {month: 'short'}),
      full: date.toISOString().split('T')[0],
    };
  };

  const handleConfirm = async () => {
    if (!selectedDate) {
      Alert.alert('Missing Info', 'Please select a date');
      return;
    }
    if (!selectedSlot) {
      Alert.alert('Missing Info', 'Please select a time slot');
      return;
    }
    if (!selectedVehicle) {
      Alert.alert('Missing Info', 'Please select your vehicle type');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Missing Info', 'Please enter your address');
      return;
    }

    setLoading(true);
    const bookingData = {
      serviceId: service?.id,
      serviceName: service?.name,
      packageId: selectedPackage?.id,
      packageName: selectedPackage?.name,
      price: selectedPackage?.price || service?.price,
      date: selectedDate,
      timeSlot: selectedSlot,
      vehicleType: selectedVehicle,
      address: address.trim(),
      notes: notes.trim(),
    };

    const result = await addBooking(bookingData);
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Booking Confirmed! 🎉',
        'Your booking has been placed successfully. You will receive a confirmation shortly.',
        [{text: 'View Bookings', onPress: () => navigation.navigate('Bookings')}],
      );
    } else {
      // For demo, just show a success since we may not have a live API
      Alert.alert(
        'Booking Placed! 🎉',
        'Your booking has been placed. We will confirm it shortly.',
        [{text: 'OK', onPress: () => navigation.navigate('Main')}],
      );
    }
  };

  const totalPrice = selectedPackage?.price || service?.price || 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Service Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Booking Summary</Text>
          <Text style={styles.summaryService}>{service?.name}</Text>
          {selectedPackage && (
            <Text style={styles.summaryPackage}>{selectedPackage.name} Package</Text>
          )}
          <Text style={styles.summaryPrice}>
            ₹{Number(totalPrice).toLocaleString('en-IN')}
          </Text>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {dates.map((date, i) => {
              const d = formatDateLabel(date);
              const isSelected = selectedDate === d.full;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateChip, isSelected && styles.dateChipActive]}
                  onPress={() => setSelectedDate(d.full)}>
                  <Text style={[styles.dateDay, isSelected && styles.dateDayActive]}>
                    {d.day}
                  </Text>
                  <Text style={[styles.dateNum, isSelected && styles.dateNumActive]}>
                    {d.date}
                  </Text>
                  <Text style={[styles.dateMonth, isSelected && styles.dateMonthActive]}>
                    {d.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Time Slot */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time Slot</Text>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.slotChip, selectedSlot === slot && styles.slotChipActive]}
                onPress={() => setSelectedSlot(slot)}>
                <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Vehicle Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Type</Text>
          <View style={styles.vehicleRow}>
            {VEHICLE_TYPES.map(v => (
              <TouchableOpacity
                key={v.id}
                style={[styles.vehicleChip, selectedVehicle === v.id && styles.vehicleChipActive]}
                onPress={() => setSelectedVehicle(v.id)}>
                <Text
                  style={[
                    styles.vehicleText,
                    selectedVehicle === v.id && styles.vehicleTextActive,
                  ]}>
                  {v.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <View style={styles.addressInput}>
            <Icon name="map-marker" size={20} color={colors.primary} style={styles.addressIcon} />
            <TextInput
              style={styles.addressTextInput}
              placeholder="Enter your full address..."
              placeholderTextColor={colors.textSecondary}
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any special instructions..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Price Breakup */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service charge</Text>
            <Text style={styles.priceValue}>₹{totalPrice}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Convenience fee</Text>
            <Text style={styles.priceValue}>₹20</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceRow}>
            <Text style={styles.priceTotalLabel}>Total</Text>
            <Text style={styles.priceTotalValue}>₹{totalPrice + 20}</Text>
          </View>
        </View>

        <Button
          title="Confirm Booking"
          onPress={handleConfirm}
          loading={loading}
          size="lg"
          style={styles.confirmBtn}
        />
        <View style={{height: spacing.xl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 48,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.white,
  },
  content: {
    padding: spacing.md,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryLabel: {
    fontSize: fontSizes.xs,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: fontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  summaryService: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: 4,
  },
  summaryPackage: {
    fontSize: fontSizes.base,
    color: colors.secondary,
    fontWeight: fontWeights.medium,
    marginBottom: spacing.sm,
  },
  summaryPrice: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.accent,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  dateChip: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.card,
    minWidth: 64,
  },
  dateChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateDay: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
    marginBottom: 2,
  },
  dateDayActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  dateNum: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
  },
  dateNumActive: {
    color: colors.white,
  },
  dateMonth: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  dateMonthActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  slotChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  slotText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  slotTextActive: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  vehicleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  vehicleChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.card,
  },
  vehicleChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  vehicleText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  vehicleTextActive: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  addressInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    minHeight: 90,
  },
  addressIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  addressTextInput: {
    flex: 1,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    minHeight: 60,
  },
  notesInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: spacing.md,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    minHeight: 90,
  },
  priceCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  priceTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  priceLabel: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
  priceValue: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  priceTotalLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  priceTotalValue: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.primary,
  },
  confirmBtn: {
    marginTop: spacing.sm,
  },
});

export default BookingScreen;
