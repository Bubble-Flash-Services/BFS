import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import {SERVICE_CATEGORIES, POPULAR_SERVICES} from '../utils/constants';
import CategoryCard from '../components/CategoryCard';
import ServiceCard from '../components/ServiceCard';

const ExploreScreen = ({navigation, route}) => {
  const initialSearch = route.params?.searchQuery || '';
  const [searchText, setSearchText] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filtered = POPULAR_SERVICES.filter(s => {
    const matchSearch =
      !searchText || s.name.toLowerCase().includes(searchText.toLowerCase());
    const matchCat =
      !selectedCategory ||
      s.category.toLowerCase().replace(' ', '-') === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerSubtitle}>Find the perfect service for your vehicle</Text>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={22} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Icon name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.catChip, !selectedCategory && styles.catChipActive]}
              onPress={() => setSelectedCategory(null)}>
              <Text style={[styles.catChipText, !selectedCategory && styles.catChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {SERVICE_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catChip,
                  selectedCategory === cat.id && styles.catChipActive,
                ]}
                onPress={() =>
                  setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                }>
                <Icon
                  name={cat.icon}
                  size={16}
                  color={selectedCategory === cat.id ? colors.white : cat.color}
                  style={styles.catChipIcon}
                />
                <Text
                  style={[
                    styles.catChipText,
                    selectedCategory === cat.id && styles.catChipTextActive,
                  ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Category Cards Grid */}
        {!searchText && !selectedCategory && (
          <View style={styles.section}>
            <View style={styles.catGrid}>
              {SERVICE_CATEGORIES.map(cat => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  onPress={() => {
                    navigation.navigate('ServiceListing', {category: cat});
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Results */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchText || selectedCategory ? 'Results' : 'All Services'}
            </Text>
            <Text style={styles.resultCount}>{filtered.length} found</Text>
          </View>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>No services found</Text>
              <Text style={styles.emptySubtext}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.serviceList}>
              {filtered.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onPress={() => navigation.navigate('ServiceDetail', {service})}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Popular Categories */}
        <View style={[styles.section, styles.promoSection]}>
          <View style={styles.promoCard}>
            <Text style={styles.promoTitle}>🎁 Refer & Earn</Text>
            <Text style={styles.promoText}>
              Share Bubble Flash Services with friends and earn ₹100 for every referral!
            </Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Share Now</Text>
            </TouchableOpacity>
          </View>
        </View>

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
    paddingTop: 56,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  section: {
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  resultCount: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: spacing.sm,
    backgroundColor: colors.card,
    marginBottom: spacing.sm,
  },
  catChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catChipIcon: {
    marginRight: 4,
  },
  catChipText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  catChipTextActive: {
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  serviceList: {
    paddingBottom: spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  promoSection: {
    paddingBottom: spacing.md,
  },
  promoCard: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  promoTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  promoText: {
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  promoBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: colors.white,
    fontWeight: fontWeights.bold,
    fontSize: fontSizes.base,
  },
});

export default ExploreScreen;
