import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import useBookings from '../hooks/useBookings';
import Loader from '../components/Loader';
import {getStatusColor, getStatusLabel, formatDate, formatPrice} from '../utils/helpers';

const FILTER_TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];

const MyBookingsScreen = ({navigation}) => {
  const {bookings, isLoading, fetchBookings, cancelBooking} = useBookings();
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = bookings.filter(b => {
    if (activeTab === 'All') {
      return true;
    }
    if (activeTab === 'Upcoming') {
      return b.status === 'pending' || b.status === 'confirmed';
    }
    if (activeTab === 'Completed') {
      return b.status === 'completed';
    }
    if (activeTab === 'Cancelled') {
      return b.status === 'cancelled';
    }
    return true;
  });

  const handleCancel = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            await cancelBooking(bookingId, 'User cancelled');
          },
        },
      ],
    );
  };

  const renderBooking = ({item}) => {
    const statusColor = getStatusColor(item.status);
    const canCancel = item.status === 'pending' || item.status === 'confirmed';

    return (
      <View style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.serviceName || 'Vehicle Service'}</Text>
            <Text style={styles.packageName}>{item.packageName || 'Standard'} Package</Text>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: statusColor + '20'}]}>
            <Text style={[styles.statusText, {color: statusColor}]}>
              {getStatusLabel(item.status || 'pending')}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon name="calendar" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {item.date ? formatDate(item.date) : 'Date TBD'}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="clock-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.timeSlot || 'Time TBD'}</Text>
          </View>
        </View>

        {item.vehicleType && (
          <View style={styles.detailItem}>
            <Icon name="car" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{item.vehicleType}</Text>
          </View>
        )}

        <View style={styles.cardFooter}>
          <Text style={styles.totalPrice}>
            {formatPrice((item.price || 0) + 20)}
          </Text>
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancel(item._id || item.id)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyEmoji}>📋</Text>
      <Text style={styles.emptyTitle}>No Bookings Yet</Text>
      <Text style={styles.emptySubtitle}>
        Book a service and it will appear here
      </Text>
      <TouchableOpacity
        style={styles.exploreBtn}
        onPress={() => navigation.navigate('Explore')}>
        <Text style={styles.exploreBtnText}>Explore Services</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      <View style={styles.tabRow}>
        {FILTER_TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <Loader fullScreen text="Loading bookings..." />
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBooking}
          keyExtractor={(item, i) => item._id || item.id || String(i)}
          contentContainerStyle={[
            styles.list,
            filteredBookings.length === 0 && styles.emptyList,
          ]}
          ListEmptyComponent={renderEmpty}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchBookings}
          refreshing={isLoading}
        />
      )}
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
    paddingTop: 56,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.white,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  activeTabText: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  list: {
    padding: spacing.md,
  },
  emptyList: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  packageName: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: 4,
  },
  detailText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  totalPrice: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.primary,
  },
  cancelBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  cancelBtnText: {
    fontSize: fontSizes.sm,
    color: colors.error,
    fontWeight: fontWeights.bold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  exploreBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  exploreBtnText: {
    color: colors.white,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.base,
  },
});

export default MyBookingsScreen;
