import React, {useRef, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  TextInput,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import {SERVICE_CATEGORIES, BANNERS, POPULAR_SERVICES} from '../utils/constants';
import CategoryCard from '../components/CategoryCard';
import ServiceCard from '../components/ServiceCard';
import useAuth from '../hooks/useAuth';

const {width} = Dimensions.get('window');
const BANNER_WIDTH = width - spacing.xl * 2;
const BANNER_HEIGHT = 160;

const HomeScreen = ({navigation}) => {
  const {user} = useAuth();
  const [searchText, setSearchText] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerRef = useRef(null);
  const bannerIntervalRef = useRef(null);

  // Auto-sliding banner
  useEffect(() => {
    bannerIntervalRef.current = setInterval(() => {
      setCurrentBanner(prev => {
        const next = (prev + 1) % BANNERS.length;
        bannerRef.current?.scrollTo({x: BANNER_WIDTH * next + spacing.xl * next, animated: true});
        return next;
      });
    }, 3000);
    return () => {
      if (bannerIntervalRef.current) {
        clearInterval(bannerIntervalRef.current);
      }
    };
  }, []);

  const handleCategoryPress = (category) => {
    navigation.navigate('ServiceListing', {category});
  };

  const handleServicePress = (service) => {
    navigation.navigate('ServiceDetail', {service});
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      navigation.navigate('Explore', {searchQuery: searchText});
    }
  };

  const renderBanner = (banner) => (
    <View key={banner.id} style={styles.bannerItem}>
      <View style={[styles.bannerGradient, {backgroundColor: banner.gradient[0]}]}>
        <View style={styles.bannerContent}>
          <View style={styles.bannerTag}>
            <Text style={styles.bannerTagText}>{banner.tag}</Text>
          </View>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
          <TouchableOpacity style={styles.bannerBtn}>
            <Text style={styles.bannerBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bannerEmoji}>
          {banner.id === 1 ? '🚗' : banner.id === 2 ? '🏍️' : '📋'}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      {/* Sticky Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.locationRow}>
            <Icon name="map-marker" size={18} color={colors.secondary} />
            <View style={styles.locationTexts}>
              <Text style={styles.locationLabel}>Your Location</Text>
              <Text style={styles.locationValue} numberOfLines={1}>
                Bengaluru, Karnataka
              </Text>
            </View>
            <Icon name="chevron-down" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifBtn}>
              <Icon name="bell-outline" size={22} color={colors.white} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate('Profile')}>
              <Icon name="account-circle" size={36} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.greetingText}>
          Hello, {user?.name || 'there'} 👋
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Search Bar - overlapping header */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Icon name="magnify" size={22} color={colors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search car wash, PUC, insurance..."
              placeholderTextColor={colors.textSecondary}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')}>
                <Icon name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryGrid}>
            {SERVICE_CATEGORIES.map(cat => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onPress={() => handleCategoryPress(cat)}
              />
            ))}
          </View>
        </View>

        {/* Banner Carousel */}
        <View style={styles.bannerSection}>
          <ScrollView
            ref={bannerRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={e => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_WIDTH + spacing.md));
              setCurrentBanner(idx);
            }}
            contentContainerStyle={styles.bannerScrollContent}>
            {BANNERS.map(renderBanner)}
          </ScrollView>
          <View style={styles.bannerDots}>
            {BANNERS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.bannerDot,
                  i === currentBanner && styles.bannerDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Services</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}>
            {POPULAR_SERVICES.map(service => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => handleServicePress(service)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recommended For You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}>
            {[...POPULAR_SERVICES].reverse().map(service => (
              <ServiceCard
                key={`rec-${service.id}`}
                service={service}
                onPress={() => handleServicePress(service)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Promo Card */}
        <View style={styles.promoCard}>
          <View style={styles.promoContent}>
            <Text style={styles.promoTitle}>First Booking?</Text>
            <Text style={styles.promoSubtitle}>Use code BFSFIRST for 30% off</Text>
            <TouchableOpacity style={styles.promoBtn}>
              <Text style={styles.promoBtnText}>Claim Offer</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.promoEmoji}>🎉</Text>
        </View>

        <View style={{height: spacing.xl}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingBottom: 36,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationTexts: {
    marginLeft: spacing.sm,
    marginRight: spacing.sm,
    flex: 1,
  },
  locationLabel: {
    fontSize: fontSizes.xs,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: fontWeights.medium,
  },
  locationValue: {
    fontSize: fontSizes.md,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifBtn: {
    position: 'relative',
    marginRight: spacing.sm,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingText: {
    color: colors.white,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    marginTop: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: -24,
    marginBottom: spacing.md,
    zIndex: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  section: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  seeAll: {
    fontSize: fontSizes.sm,
    color: colors.secondary,
    fontWeight: fontWeights.semibold,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: spacing.md,
  },
  bannerSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  bannerScrollContent: {
    paddingHorizontal: spacing.lg,
  },
  bannerItem: {
    width: BANNER_WIDTH,
    marginRight: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    height: BANNER_HEIGHT,
  },
  bannerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTag: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bannerTagText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  bannerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.sm,
  },
  bannerBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  bannerBtnText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
  },
  bannerEmoji: {
    fontSize: 56,
    marginLeft: spacing.sm,
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  bannerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginHorizontal: 3,
  },
  bannerDotActive: {
    backgroundColor: colors.primary,
    width: 18,
  },
  horizontalList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  promoCard: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
  },
  promoBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: colors.white,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
  },
  promoEmoji: {
    fontSize: 48,
    marginLeft: spacing.sm,
  },
});

export default HomeScreen;
