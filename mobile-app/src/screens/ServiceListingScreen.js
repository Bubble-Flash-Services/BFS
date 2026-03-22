import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import {SERVICE_CATEGORIES, POPULAR_SERVICES} from '../utils/constants';
import ServiceCard from '../components/ServiceCard';
import Loader from '../components/Loader';

const ServiceListingScreen = ({navigation, route}) => {
  const {category} = route.params || {};
  const [selectedCategory, setSelectedCategory] = useState(category?.id || null);
  const [services, setServices] = useState(POPULAR_SERVICES);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('popular'); // popular | price | rating

  const filteredServices = services.filter(s => {
    const matchCat = !selectedCategory || s.category.toLowerCase().replace(' ', '-') === selectedCategory;
    const matchSearch = !searchText || s.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCat && matchSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    return b.reviews - a.reviews;
  });

  const renderCategoryFilter = ({item}) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        selectedCategory === item.id && styles.filterChipActive,
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}>
      <Text
        style={[
          styles.filterChipText,
          selectedCategory === item.id && styles.filterChipTextActive,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderService = ({item}) => (
    <View style={styles.serviceRow}>
      <TouchableOpacity
        style={styles.serviceItem}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('ServiceDetail', {service: item})}>
        <View style={styles.serviceImagePlaceholder}>
          <Text style={styles.serviceEmoji}>🚗</Text>
        </View>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceCategory}>{item.category}</Text>
          <Text style={styles.serviceName}>{item.name}</Text>
          <View style={styles.serviceMeta}>
            <Text style={styles.serviceRating}>⭐ {item.rating}</Text>
            <Text style={styles.serviceDot}> · </Text>
            <Text style={styles.serviceDuration}>⏱ {item.duration}</Text>
          </View>
          <View style={styles.servicePriceRow}>
            <Text style={styles.servicePrice}>
              ₹{Number(item.price).toLocaleString('en-IN')}
            </Text>
            <TouchableOpacity
              style={styles.bookBtn}
              onPress={() => navigation.navigate('Booking', {service: item})}>
              <Text style={styles.bookBtnText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <FlatList
        ListHeaderComponent={
          <>
            <FlatList
              data={SERVICE_CATEGORIES}
              renderItem={renderCategoryFilter}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterList}
            />
            <View style={styles.sortRow}>
              <Text style={styles.resultCount}>{sortedServices.length} services</Text>
              <View style={styles.sortBtns}>
                {['popular', 'price', 'rating'].map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.sortBtn, sortBy === s && styles.sortBtnActive]}
                    onPress={() => setSortBy(s)}>
                    <Text
                      style={[styles.sortBtnText, sortBy === s && styles.sortBtnTextActive]}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        }
        data={sortedServices}
        renderItem={renderService}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No services found</Text>
            <Text style={styles.emptySubtext}>Try a different filter or search</Text>
          </View>
        }
      />
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
    marginRight: spacing.sm,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
  filterList: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.card,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  filterChipTextActive: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  resultCount: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  sortBtns: {
    flexDirection: 'row',
  },
  sortBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    marginLeft: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sortBtnText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  sortBtnTextActive: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  list: {
    paddingBottom: spacing.xl,
  },
  serviceRow: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  serviceItem: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  serviceImagePlaceholder: {
    width: 100,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: {
    fontSize: 40,
  },
  serviceInfo: {
    flex: 1,
    padding: spacing.md,
  },
  serviceCategory: {
    fontSize: fontSizes.xs,
    color: colors.secondary,
    fontWeight: fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  serviceName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  serviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  serviceRating: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  serviceDot: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  serviceDuration: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  servicePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  servicePrice: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.extrabold,
    color: colors.primary,
  },
  bookBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  bookBtnText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 56,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
  },
});

export default ServiceListingScreen;
