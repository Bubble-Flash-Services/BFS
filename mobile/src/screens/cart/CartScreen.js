import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getAddresses } from '../../api/addresses';
import { createOrder } from '../../api/orders';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { CartItemCard } from '../../components/Cards';
import { PrimaryButton, SecondaryButton } from '../../components/Buttons';
import { EmptyState } from '../../components/UI';

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, token } = useAuth();
  const { cartItems, loading, totalItems, totalPrice, updateItem, removeItem, emptyCart, fetchCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [step, setStep] = useState('cart'); // 'cart' | 'address' | 'confirm'

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      const data = await getAddresses();
      const list = Array.isArray(data?.addresses) ? data.addresses : Array.isArray(data) ? data : [];
      setAddresses(list);
      if (list.length > 0) setSelectedAddress(list[0]);
    } catch {}
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Toast.show({ type: 'error', text1: 'Please select a delivery address' });
      return;
    }
    setCheckoutLoading(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          serviceId: item.serviceId,
          serviceName: item.serviceName || item.name,
          packageId: item.packageId,
          packageName: item.packageName,
          price: item.price,
          quantity: item.quantity || 1,
        })),
        addressId: selectedAddress._id,
        totalAmount: totalPrice - discount,
        scheduledDate: scheduledDate || undefined,
        couponCode: couponCode || undefined,
        paymentMethod: 'cod',
      };
      const result = await createOrder(orderData);
      if (result?.order || result?._id) {
        await emptyCart();
        Toast.show({ type: 'success', text1: 'Order placed successfully! 🎉' });
        navigation.replace('Orders');
      } else {
        Toast.show({ type: 'error', text1: result?.message || 'Order failed. Try again.' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Failed to place order. Please try again.' });
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <EmptyState
          emoji="🔐"
          title="Sign in to view cart"
          subtitle="Your cart items will be saved after sign in"
          actionText="Log In"
          onAction={() => navigation.navigate('Login')}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          subtitle="Browse our services and add something!"
          actionText="Browse Services"
          onAction={() => navigation.navigate('Services')}
        />
      </View>
    );
  }

  const finalTotal = totalPrice - discount;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart ({totalItems})</Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Clear Cart', 'Remove all items?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: emptyCart },
          ])}
        >
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        <Text style={styles.sectionTitle}>Items</Text>
        {cartItems.map((item) => (
          <CartItemCard
            key={item._id || item.serviceId}
            item={item}
            onRemove={() => removeItem(item._id)}
            onIncrement={() => updateItem(item._id, { quantity: (item.quantity || 1) + 1 })}
            onDecrement={() => {
              if ((item.quantity || 1) <= 1) {
                removeItem(item._id);
              } else {
                updateItem(item._id, { quantity: (item.quantity || 1) - 1 });
              }
            }}
          />
        ))}

        {/* Address selection */}
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        {addresses.length === 0 ? (
          <TouchableOpacity style={styles.addAddressBtn} onPress={() => navigation.navigate('Addresses')}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
            <Text style={styles.addAddressText}>Add Delivery Address</Text>
          </TouchableOpacity>
        ) : (
          addresses.map((addr) => (
            <TouchableOpacity
              key={addr._id}
              style={[styles.addressCard, selectedAddress?._id === addr._id && styles.addressSelected]}
              onPress={() => setSelectedAddress(addr)}
            >
              <View style={styles.addressRadio}>
                {selectedAddress?._id === addr._id && <View style={styles.radioFill} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.addressLabel}>{addr.label || 'Home'}</Text>
                <Text style={styles.addressText} numberOfLines={2}>
                  {addr.street}, {addr.city} – {addr.pincode}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
        <TouchableOpacity style={styles.manageAddressLink} onPress={() => navigation.navigate('Addresses')}>
          <Text style={styles.manageAddressText}>Manage addresses →</Text>
        </TouchableOpacity>

        {/* Coupon */}
        <Text style={styles.sectionTitle}>Coupon Code</Text>
        <View style={styles.couponRow}>
          <TextInput
            style={styles.couponInput}
            placeholder="Enter coupon code"
            placeholderTextColor={Colors.placeholder}
            value={couponCode}
            onChangeText={setCouponCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn} onPress={() => {
            if (couponCode.toUpperCase() === 'FIRST100') {
              setDiscount(100);
              Toast.show({ type: 'success', text1: '₹100 discount applied!' });
            } else {
              Toast.show({ type: 'error', text1: 'Invalid coupon code' });
            }
          }}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* Price Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.sectionTitle}>Price Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{totalPrice}</Text>
          </View>
          {discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: Colors.success }]}>Discount</Text>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>- ₹{discount}</Text>
            </View>
          )}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>FREE</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{finalTotal}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Checkout Bar */}
      <View style={[styles.checkoutBar, { paddingBottom: insets.bottom + 12 }]}>
        <View>
          <Text style={styles.checkoutTotal}>₹{finalTotal}</Text>
          <Text style={styles.checkoutItems}>{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
        </View>
        <PrimaryButton
          title="Place Order"
          onPress={handlePlaceOrder}
          loading={checkoutLoading}
          style={styles.checkoutBtn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  clearText: { fontSize: 14, color: Colors.error, fontWeight: '600' },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { padding: Spacing.base },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.md },

  // Address
  addAddressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  addAddressText: { fontSize: 14, fontWeight: '600', color: Colors.primary },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  addressSelected: { borderColor: Colors.primary, backgroundColor: Colors.primaryLight },
  addressRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioFill: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  addressLabel: { fontSize: 13, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  addressText: { fontSize: 13, color: Colors.textSecondary },
  manageAddressLink: { marginTop: 6, marginBottom: 4 },
  manageAddressText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },

  // Coupon
  couponRow: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  couponInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '700',
    letterSpacing: 1,
    ...Shadows.card,
  },
  applyBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: { fontSize: 14, fontWeight: '700', color: Colors.primary },

  // Summary
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadows.card,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  summaryLabel: { fontSize: 14, color: Colors.textSecondary },
  summaryValue: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  totalRow: { borderBottomWidth: 0, paddingTop: 12 },
  totalLabel: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  totalValue: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },

  // Checkout bar
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.base,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.cardHeavy,
  },
  checkoutTotal: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
  checkoutItems: { fontSize: 12, color: Colors.textMuted },
  checkoutBtn: { flex: 1, marginLeft: Spacing.base },
});
