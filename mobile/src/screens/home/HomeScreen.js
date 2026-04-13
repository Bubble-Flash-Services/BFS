import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Animated,
  Dimensions,
  TextInput,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { IconButton } from '../../components/Buttons';
import { SectionHeader } from '../../components/UI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Banner auto-scroll interval in milliseconds
const BANNER_SCROLL_INTERVAL_MS = 3500;

// ─── Service Categories ───────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  { id: 'car-wash', title: 'Car Wash', emoji: '🚗', color: '#E3F2FD', route: 'CarWash', sub: 'From ₹199' },
  { id: 'bike-wash', title: 'Bike Wash', emoji: '🏍', color: '#F3E5F5', route: 'BikeWash', sub: 'From ₹99' },
  { id: 'helmet', title: 'Helmet Care', emoji: '⛑', color: '#FFF8E1', route: 'HelmetWash', sub: 'From ₹49' },
  { id: 'laundry', title: 'Laundry', emoji: '👔', color: '#E8F5E9', route: 'ComingSoon', sub: 'Coming soon' },
  { id: 'autofix', title: 'AutoFix Pro', emoji: '🔧', color: '#FCE4EC', route: 'AutoFix', sub: 'Dent & scratch' },
  { id: 'green-clean', title: 'Green & Clean', emoji: '🏠', color: '#E0F7FA', route: 'GreenClean', sub: 'Home cleaning' },
  { id: 'puc', title: 'PUC Certificate', emoji: '📋', color: '#F9FBE7', route: 'PUC', sub: 'Doorstep visit' },
  { id: 'accessories', title: 'Accessories', emoji: '🛍', color: '#EDE7F6', route: 'Accessories', sub: 'Shop now' },
];

// ─── Promotional Banner Data ──────────────────────────────────────────────────
const BANNERS = [
  { id: 1, title: '50% OFF', subtitle: 'Car Wash today!', color: ['#FFCC00', '#FFE57F'], emoji: '🚗' },
  { id: 2, title: 'Free Pickup', subtitle: 'Laundry service', color: ['#4CAF50', '#81C784'], emoji: '👔' },
  { id: 3, title: 'New!', subtitle: 'AutoFix Pro available', color: ['#2196F3', '#64B5F6'], emoji: '🔧' },
];

// ─── Why Choose Us ────────────────────────────────────────────────────────────
const FEATURES = [
  { emoji: '🏠', title: 'Doorstep Service', desc: 'We come to you' },
  { emoji: '⚡', title: 'Quick Booking', desc: 'Book in 2 minutes' },
  { emoji: '✅', title: 'Verified Pros', desc: 'Background checked' },
  { emoji: '💳', title: 'Safe Payments', desc: 'Secure & encrypted' },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();
  const { totalItems } = useCart();
  const [searchText, setSearchText] = useState('');
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerScroll = useRef(null);

  // Auto-scroll banners
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (currentBanner + 1) % BANNERS.length;
      setCurrentBanner(next);
      bannerScroll.current?.scrollTo({ x: next * (SCREEN_WIDTH - Spacing.base * 2), animated: true });
    }, BANNER_SCROLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [currentBanner]);

  const handleSearch = () => {
    if (searchText.trim()) {
      navigation.navigate('Services', { query: searchText.trim() });
    }
  };

  const handleCategoryPress = (route, title) => {
    switch (route) {
      case 'CarWash':
        navigation.navigate('Services', { category: 'car' });
        break;
      case 'BikeWash':
        navigation.navigate('Services', { category: 'bike' });
        break;
      case 'HelmetWash':
        navigation.navigate('Services', { category: 'helmet' });
        break;
      case 'Accessories':
        navigation.navigate('Accessories');
        break;
      case 'PUC':
        navigation.navigate('PUCCertificate');
        break;
      case 'AutoFix':
        navigation.navigate('AutoFix');
        break;
      default:
        Toast.show({ type: 'info', text1: `${title} – Coming Soon!` });
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <View style={styles.container}>
      {/* Status bar area */}
      <View style={{ height: insets.top, backgroundColor: Colors.primary }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* ─── Header ─── */}
        <LinearGradient colors={['#FFCC00', '#FFE57F']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>
                {greeting()}, {isAuthenticated ? (user?.name?.split(' ')[0] || 'User') : 'Guest'} 👋
              </Text>
              <Text style={styles.headerTagline}>Doorstep cleaning services in Bengaluru</Text>
            </View>
            <View style={styles.headerIcons}>
              <IconButton
                icon={<Ionicons name="cart-outline" size={24} color={Colors.textPrimary} />}
                badge={totalItems}
                onPress={() => navigation.navigate('Cart')}
              />
              {isAuthenticated ? (
                <TouchableOpacity
                  style={styles.avatarBtn}
                  onPress={() => navigation.navigate('Profile')}
                >
                  <Text style={styles.avatarText}>
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.loginBtnText}>Log In</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search services…"
              placeholderTextColor={Colors.placeholder}
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>

        {/* ─── Promo Banners ─── */}
        <View style={styles.bannerContainer}>
          <ScrollView
            ref={bannerScroll}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - Spacing.base * 2));
              setCurrentBanner(idx);
            }}
          >
            {BANNERS.map((banner) => (
              <LinearGradient
                key={banner.id}
                colors={banner.color}
                style={styles.banner}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.bannerContent}>
                  <View>
                    <Text style={styles.bannerTitle}>{banner.title}</Text>
                    <Text style={styles.bannerSub}>{banner.subtitle}</Text>
                    <TouchableOpacity style={styles.bannerBtn} onPress={() => navigation.navigate('Services')}>
                      <Text style={styles.bannerBtnText}>Book Now →</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
          {/* Dots */}
          <View style={styles.dotsRow}>
            {BANNERS.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentBanner && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* ─── Service Categories ─── */}
        <SectionHeader
          title="Our Services"
          actionText="See All"
          onAction={() => navigation.navigate('Services')}
        />
        <FlatList
          data={SERVICE_CATEGORIES}
          keyExtractor={(i) => i.id}
          numColumns={4}
          scrollEnabled={false}
          contentContainerStyle={styles.categoriesGrid}
          columnWrapperStyle={styles.categoryRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.categoryItem}
              onPress={() => handleCategoryPress(item.route, item.title)}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
                <Text style={styles.categoryEmoji}>{item.emoji}</Text>
              </View>
              <Text style={styles.categoryTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.categorySub} numberOfLines={1}>{item.sub}</Text>
            </TouchableOpacity>
          )}
        />

        {/* ─── Popular Services ─── */}
        <SectionHeader
          title="Popular Packages"
          actionText="View All"
          onAction={() => navigation.navigate('Services')}
          style={styles.sectionMargin}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.popularList}>
          {[
            { name: 'Basic Car Wash', price: 199, emoji: '🚗', badge: '⭐ Popular' },
            { name: 'Bike Detailing', price: 249, emoji: '🏍', badge: '🔥 Hot' },
            { name: 'Helmet Sanitize', price: 99, emoji: '⛑', badge: '✨ New' },
            { name: 'Premium Car Wash', price: 499, emoji: '🚙', badge: '💎 Premium' },
          ].map((pkg, i) => (
            <TouchableOpacity
              key={i}
              style={styles.popularCard}
              onPress={() => navigation.navigate('Services')}
              activeOpacity={0.85}
            >
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>{pkg.badge}</Text>
              </View>
              <Text style={styles.popularEmoji}>{pkg.emoji}</Text>
              <Text style={styles.popularName}>{pkg.name}</Text>
              <Text style={styles.popularPrice}>₹{pkg.price}</Text>
              <TouchableOpacity
                style={styles.popularAddBtn}
                onPress={() => {
                  if (!isAuthenticated) {
                    navigation.navigate('Login');
                  } else {
                    navigation.navigate('Services');
                  }
                }}
              >
                <Text style={styles.popularAddText}>Book Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─── Why Choose Us ─── */}
        <View style={styles.whySection}>
          <Text style={styles.whyTitle}>Why Choose BFS?</Text>
          <View style={styles.whyGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ─── CTA Banner ─── */}
        {!isAuthenticated && (
          <LinearGradient colors={['#1A1A1A', '#333']} style={styles.ctaBanner}>
            <View style={styles.ctaContent}>
              <Text style={styles.ctaTitle}>Get ₹100 off your first wash!</Text>
              <Text style={styles.ctaSub}>Sign up now and use code FIRST100</Text>
              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={styles.ctaBtnText}>Create Account →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.ctaEmoji}>🎉</Text>
          </LinearGradient>
        )}

        {/* ─── Footer Spacer ─── */}
        <View style={{ height: insets.bottom + 20 }} />
      </ScrollView>
    </View>
  );
}

const CAT_SIZE = (SCREEN_WIDTH - Spacing.base * 2 - Spacing.xs * 6) / 4;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.lg,
    paddingTop: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.base,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerTagline: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  loginBtn: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  loginBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 11 : 8,
    ...Shadows.card,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  clearBtn: { padding: 2 },

  // Banners
  bannerContainer: {
    marginHorizontal: Spacing.base,
    marginVertical: Spacing.base,
  },
  banner: {
    width: SCREEN_WIDTH - Spacing.base * 2,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginRight: 0,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.white,
    letterSpacing: -0.5,
  },
  bannerSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: 12,
  },
  bannerBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: 13,
  },
  bannerEmoji: {
    fontSize: 56,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 18,
  },

  // Categories
  categoriesGrid: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
  },
  categoryRow: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  categoryItem: {
    width: CAT_SIZE,
    alignItems: 'center',
  },
  categoryIcon: {
    width: CAT_SIZE - 8,
    height: CAT_SIZE - 8,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryEmoji: {
    fontSize: CAT_SIZE * 0.38,
  },
  categoryTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  categorySub: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },

  sectionMargin: { marginTop: Spacing.md },

  // Popular packages
  popularList: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Spacing.sm,
    gap: Spacing.md,
  },
  popularCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    width: 150,
    ...Shadows.card,
    position: 'relative',
  },
  popularBadge: {
    backgroundColor: Colors.primaryLight,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  popularEmoji: { fontSize: 36, marginBottom: 6 },
  popularName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  popularPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  popularAddBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: 6,
    alignItems: 'center',
  },
  popularAddText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },

  // Why choose us
  whySection: {
    marginHorizontal: Spacing.base,
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    ...Shadows.card,
  },
  whyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  whyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  featureCard: {
    width: '46%',
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  featureEmoji: { fontSize: 28, marginBottom: 6 },
  featureTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },

  // CTA Banner
  ctaBanner: {
    marginHorizontal: Spacing.base,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ctaContent: { flex: 1 },
  ctaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 4,
  },
  ctaSub: {
    fontSize: 12,
    color: '#ccc',
    marginBottom: 12,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 9,
    alignSelf: 'flex-start',
  },
  ctaBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  ctaEmoji: { fontSize: 48 },
});
