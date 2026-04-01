import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { getAllServices, getServiceCategories } from '../../api/services';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { EmptyState } from '../../components/UI';

// Static data fallback while API loads
const STATIC_SERVICES = [
  {
    _id: 'car-basic',
    name: 'Basic Car Wash',
    category: 'Car Wash',
    emoji: '🚗',
    price: 199,
    originalPrice: 299,
    description: 'Exterior wash, wheel cleaning, interior vacuum',
    popular: true,
    features: ['Exterior hand wash', 'Wheel cleaning', 'Interior vacuum', 'Dashboard wipe'],
  },
  {
    _id: 'car-premium',
    name: 'Premium Car Wash',
    category: 'Car Wash',
    emoji: '🚙',
    price: 499,
    originalPrice: 699,
    description: 'Full interior & exterior deep clean + wax polish',
    features: ['All Basic features', 'Shampoo wash', 'Wax polish', 'Interior deep clean', 'Tyre dressing'],
  },
  {
    _id: 'bike-basic',
    name: 'Bike Wash',
    category: 'Bike Wash',
    emoji: '🏍',
    price: 99,
    originalPrice: 149,
    description: 'Full bike exterior wash and shine',
    popular: true,
    features: ['Exterior wash', 'Chain clean', 'Tyre shine'],
  },
  {
    _id: 'bike-detail',
    name: 'Bike Detailing',
    category: 'Bike Wash',
    emoji: '🏍',
    price: 249,
    originalPrice: 349,
    description: 'Complete detailing with foam wash and wax',
    features: ['All Bike Wash features', 'Foam wash', 'Wax polish', 'Engine clean'],
  },
  {
    _id: 'helmet-basic',
    name: 'Helmet Sanitize',
    category: 'Helmet',
    emoji: '⛑',
    price: 99,
    originalPrice: 149,
    description: 'Deep sanitization and deodorization',
    popular: true,
    features: ['Interior sanitize', 'Exterior clean', 'Deodorize', 'UV disinfect'],
  },
  {
    _id: 'puc',
    name: 'PUC Certificate',
    category: 'PUC',
    emoji: '📋',
    price: 150,
    description: 'Doorstep PUC emission test',
    features: ['Doorstep visit', 'On-spot certificate', 'All vehicle types'],
  },
];

const CATEGORY_FILTERS = ['All', 'Car Wash', 'Bike Wash', 'Helmet', 'PUC', 'AutoFix', 'Laundry'];

export default function ServicesScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [services, setServices] = useState(STATIC_SERVICES);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [searchText, setSearchText] = useState(route.params?.query || '');
  const [activeFilter, setActiveFilter] = useState(
    route.params?.category === 'car' ? 'Car Wash' :
    route.params?.category === 'bike' ? 'Bike Wash' :
    route.params?.category === 'helmet' ? 'Helmet' : 'All'
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const data = await getAllServices();
      if (Array.isArray(data) && data.length > 0) {
        setServices(data);
      }
    } catch {
      // Use static fallback
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (service) => {
    if (!isAuthenticated) {
      navigation.navigate('Login');
      return;
    }
    setAddingId(service._id);
    const result = await addItem({
      serviceId: service._id,
      serviceName: service.name,
      price: service.price,
      quantity: 1,
    });
    setAddingId(null);
    if (result.success) {
      Toast.show({ type: 'success', text1: `${service.name} added to cart!` });
    } else {
      Toast.show({ type: 'error', text1: 'Could not add to cart. Please try again.' });
    }
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = !searchText || 
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      s.category?.toLowerCase().includes(searchText.toLowerCase());
    const matchesFilter = activeFilter === 'All' || s.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const renderServiceCard = ({ item }) => (
    <View style={styles.serviceCard}>
      {item.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>⭐ Popular</Text>
        </View>
      )}
      <View style={styles.cardHeader}>
        <Text style={styles.serviceEmoji}>{item.emoji || '✨'}</Text>
        <View style={styles.cardTitleArea}>
          <Text style={styles.serviceName}>{item.name}</Text>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{item.category}</Text>
          </View>
        </View>
      </View>

      {item.description && (
        <Text style={styles.serviceDesc} numberOfLines={2}>{item.description}</Text>
      )}

      {item.features && item.features.length > 0 && (
        <View style={styles.features}>
          {item.features.slice(0, 3).map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureCheck}>✓</Text>
              <Text style={styles.featureText} numberOfLines={1}>{f}</Text>
            </View>
          ))}
          {item.features.length > 3 && (
            <Text style={styles.moreFeatures}>+{item.features.length - 3} more</Text>
          )}
        </View>
      )}

      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.servicePrice}>₹{item.price}</Text>
          {item.originalPrice && item.originalPrice > item.price && (
            <Text style={styles.originalPrice}>₹{item.originalPrice}</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.addBtn, addingId === item._id && styles.addBtnLoading]}
          onPress={() => handleAddToCart(item)}
          disabled={addingId === item._id}
          activeOpacity={0.8}
        >
          {addingId === item._id ? (
            <ActivityIndicator size="small" color={Colors.secondary} />
          ) : (
            <Text style={styles.addBtnText}>+ Add</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Services</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={Colors.placeholder}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {CATEGORY_FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results count */}
      <Text style={styles.resultsCount}>
        {filteredServices.length} service{filteredServices.length !== 1 ? 's' : ''} found
      </Text>

      {/* Services List */}
      {loading ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading services…</Text>
        </View>
      ) : filteredServices.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="No services found"
          subtitle="Try adjusting your search or filters"
          actionText="Clear filters"
          onAction={() => { setSearchText(''); setActiveFilter('All'); }}
        />
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item._id}
          renderItem={renderServiceCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    ...Shadows.card,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: Colors.sectionBg,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  filtersRow: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    gap: 8,
  },
  filterChip: {
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  filterTextActive: { color: Colors.textPrimary },
  resultsCount: {
    fontSize: 13,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  loadingCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { fontSize: 14, color: Colors.textMuted },
  list: { padding: Spacing.base, gap: Spacing.md },

  // Service card
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    ...Shadows.card,
  },
  popularBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.textPrimary },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  serviceEmoji: { fontSize: 38, marginRight: 12 },
  cardTitleArea: { flex: 1 },
  serviceName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  categoryTag: {
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  categoryTagText: { fontSize: 11, fontWeight: '600', color: Colors.textSecondary },
  serviceDesc: { fontSize: 13, color: Colors.textMuted, marginBottom: Spacing.sm, lineHeight: 18 },
  features: { marginBottom: Spacing.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  featureCheck: { color: Colors.success, fontWeight: '700', marginRight: 6, fontSize: 12 },
  featureText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  moreFeatures: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  servicePrice: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  originalPrice: { fontSize: 13, color: Colors.textMuted, textDecorationLine: 'line-through' },
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 10,
    paddingHorizontal: 22,
    minWidth: 80,
    alignItems: 'center',
    ...Shadows.button,
  },
  addBtnLoading: { opacity: 0.7 },
  addBtnText: { fontSize: 14, fontWeight: '700', color: Colors.secondary },
});
