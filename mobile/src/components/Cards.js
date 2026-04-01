import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Colors from '../theme/colors';
import { Spacing, Radius, Shadows } from '../theme/styles';
import { PrimaryButton } from './Buttons';

// ─── Service Category Card ────────────────────────────────────────────────────
export function CategoryCard({ title, subtitle, emoji, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: color || Colors.primaryLight }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={styles.categoryEmoji}>{emoji}</Text>
      <Text style={styles.categoryTitle}>{title}</Text>
      {subtitle && <Text style={styles.categorySubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
}

// ─── Service Package Card ─────────────────────────────────────────────────────
export function PackageCard({ name, price, originalPrice, features, popular, onAddToCart, loading }) {
  return (
    <View style={[styles.packageCard, popular && styles.packageCardPopular]}>
      {popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>⭐ Most Popular</Text>
        </View>
      )}
      <Text style={styles.packageName}>{name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.packagePrice}>₹{price}</Text>
        {originalPrice && originalPrice > price && (
          <Text style={styles.originalPrice}>₹{originalPrice}</Text>
        )}
      </View>
      {features && features.length > 0 && (
        <View style={styles.featureList}>
          {features.map((f, i) => (
            <View key={i} style={styles.featureItem}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      )}
      <PrimaryButton
        title="Add to Cart"
        onPress={onAddToCart}
        loading={loading}
        style={styles.addCartBtn}
      />
    </View>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
export function OrderCard({ order, onPress }) {
  const statusColor = {
    pending: Colors.statusPending,
    confirmed: Colors.statusConfirmed,
    'in-progress': Colors.statusInProgress,
    completed: Colors.statusCompleted,
    cancelled: Colors.statusCancelled,
  };
  const status = order.status?.toLowerCase() || 'pending';
  const color = statusColor[status] || Colors.textMuted;

  return (
    <TouchableOpacity style={styles.orderCard} onPress={() => onPress && onPress(order)} activeOpacity={0.85}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>#{order._id?.slice(-8).toUpperCase()}</Text>
          <Text style={styles.orderDate}>
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            }) : ''}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.statusText, { color }]}>{order.status || 'Pending'}</Text>
        </View>
      </View>

      {order.items && order.items.length > 0 && (
        <View style={styles.orderItemsRow}>
          {order.items.slice(0, 2).map((item, i) => (
            <Text key={i} style={styles.orderItem}>
              {item.serviceName || item.name || 'Service'}{i < Math.min(order.items.length, 2) - 1 ? ', ' : ''}
            </Text>
          ))}
          {order.items.length > 2 && (
            <Text style={styles.orderItem}> +{order.items.length - 2} more</Text>
          )}
        </View>
      )}

      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>₹{order.totalAmount || order.total || 0}</Text>
        <Text style={styles.viewDetails}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Cart Item Card ───────────────────────────────────────────────────────────
export function CartItemCard({ item, onRemove, onIncrement, onDecrement }) {
  const qty = item.quantity || 1;
  return (
    <View style={styles.cartCard}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName} numberOfLines={2}>{item.serviceName || item.name}</Text>
        {item.packageName && (
          <Text style={styles.cartItemPkg}>{item.packageName}</Text>
        )}
        <Text style={styles.cartItemPrice}>₹{(item.price || 0) * qty}</Text>
      </View>
      <View style={styles.cartQtyRow}>
        <TouchableOpacity style={styles.qtyBtn} onPress={onDecrement}>
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyText}>{qty}</Text>
        <TouchableOpacity style={styles.qtyBtn} onPress={onIncrement}>
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
          <Text style={styles.removeBtnText}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Stat Card (for admin/employee dashboards) ────────────────────────────────
export function StatCard({ label, value, icon, color, style }) {
  return (
    <View style={[styles.statCard, style]}>
      <View style={[styles.statIcon, { backgroundColor: (color || Colors.primary) + '22' }]}>
        <Text style={styles.statIconText}>{icon}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Category card
  categoryCard: {
    borderRadius: Radius.xl,
    padding: Spacing.base,
    marginRight: Spacing.md,
    width: 130,
    alignItems: 'center',
    ...Shadows.card,
  },
  categoryEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  categorySubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },

  // Package card
  packageCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  packageCardPopular: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  popularBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  packageName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.md,
  },
  packagePrice: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  originalPrice: {
    fontSize: 15,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  featureList: {
    marginBottom: Spacing.base,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  featureCheck: {
    color: Colors.success,
    fontWeight: '700',
    marginRight: 8,
    fontSize: 14,
  },
  featureText: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  addCartBtn: {
    marginTop: 4,
  },

  // Order card
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    ...Shadows.card,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  orderId: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  orderItemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Spacing.sm,
  },
  orderItem: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  viewDetails: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },

  // Cart item card
  cartCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.card,
  },
  cartItemInfo: {
    flex: 1,
    marginRight: Spacing.md,
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  cartItemPkg: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cartQtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.sectionBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  qtyText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    minWidth: 22,
    textAlign: 'center',
  },
  removeBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    fontSize: 17,
  },

  // Stat card
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    flex: 1,
    alignItems: 'center',
    ...Shadows.card,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statIconText: {
    fontSize: 22,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
