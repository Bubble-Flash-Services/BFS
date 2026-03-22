import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import Button from '../components/Button';

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299,
    features: ['Exterior wash', 'Rinse', 'Dry'],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 499,
    features: ['Exterior wash', 'Interior vacuum', 'Dashboard wipe', 'Tyre dressing'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 799,
    features: ['Full exterior', 'Deep interior', 'Engine bay', 'Wax coat', 'Odor removal'],
    popular: false,
  },
];

const ServiceDetailScreen = ({navigation, route}) => {
  const {service} = route.params || {};
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1]);

  const handleBookNow = () => {
    navigation.navigate('Booking', {service, selectedPackage});
  };

  if (!service) {
    return (
      <View style={styles.errorState}>
        <Text style={styles.errorText}>Service not found</Text>
        <Button title="Go Back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <TouchableOpacity style={styles.shareBtn}>
          <Icon name="share-variant" size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🚗</Text>
        </View>

        {/* Service Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoTop}>
            <View style={styles.infoLeft}>
              <Text style={styles.category}>{service.category}</Text>
              <Text style={styles.name}>{service.name}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingText}>⭐ {service.rating}</Text>
              <Text style={styles.reviewCount}>({service.reviews})</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="clock-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.metaText}>{service.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="shield-check" size={16} color={colors.success} />
              <Text style={styles.metaText}>Quality Assured</Text>
            </View>
            <View style={styles.metaItem}>
              <Icon name="home" size={16} color={colors.secondary} />
              <Text style={styles.metaText}>At Doorstep</Text>
            </View>
          </View>
        </View>

        {/* Packages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Package</Text>
          {PACKAGES.map(pkg => (
            <TouchableOpacity
              key={pkg.id}
              style={[
                styles.packageCard,
                selectedPackage.id === pkg.id && styles.packageCardActive,
              ]}
              onPress={() => setSelectedPackage(pkg)}
              activeOpacity={0.9}>
              {pkg.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              <View style={styles.packageHeader}>
                <View style={styles.packageLeft}>
                  <View
                    style={[
                      styles.radioCircle,
                      selectedPackage.id === pkg.id && styles.radioActive,
                    ]}>
                    {selectedPackage.id === pkg.id && <View style={styles.radioDot} />}
                  </View>
                  <Text
                    style={[
                      styles.packageName,
                      selectedPackage.id === pkg.id && styles.packageNameActive,
                    ]}>
                    {pkg.name}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.packagePrice,
                    selectedPackage.id === pkg.id && styles.packagePriceActive,
                  ]}>
                  ₹{pkg.price}
                </Text>
              </View>
              <View style={styles.featureList}>
                {pkg.features.map((f, i) => (
                  <View key={i} style={styles.featureItem}>
                    <Icon
                      name="check-circle"
                      size={14}
                      color={selectedPackage.id === pkg.id ? colors.primary : colors.textSecondary}
                    />
                    <Text style={styles.featureText}>{f}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* What's Included */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What to Expect</Text>
          <View style={styles.expectCard}>
            {[
              {icon: 'account-check', text: 'Verified professional technician'},
              {icon: 'water', text: 'Eco-friendly cleaning products'},
              {icon: 'clock-fast', text: 'On-time service guaranteed'},
              {icon: 'star', text: '30-day quality guarantee'},
            ].map((item, i) => (
              <View key={i} style={styles.expectItem}>
                <View style={styles.expectIconWrap}>
                  <Icon name={item.icon} size={20} color={colors.primary} />
                </View>
                <Text style={styles.expectText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{height: 120}} />
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Total Amount</Text>
          <Text style={styles.footerPrice}>₹{selectedPackage.price}</Text>
        </View>
        <Button
          title="Book Now"
          onPress={handleBookNow}
          size="lg"
          style={styles.footerBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginBottom: spacing.md,
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
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    height: 200,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  infoCard: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: -spacing.lg,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  infoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  infoLeft: {
    flex: 1,
  },
  category: {
    fontSize: fontSizes.xs,
    color: colors.secondary,
    fontWeight: fontWeights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  name: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.textPrimary,
    lineHeight: 30,
  },
  ratingBadge: {
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    marginLeft: spacing.sm,
  },
  ratingText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: '#F59E0B',
  },
  reviewCount: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  metaText: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginLeft: 4,
    fontWeight: fontWeights.medium,
  },
  section: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  packageCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  packageCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0F4FF',
  },
  popularBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderBottomLeftRadius: borderRadius.md,
  },
  popularText: {
    fontSize: fontSizes.xs,
    color: colors.white,
    fontWeight: fontWeights.bold,
  },
  packageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  packageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  packageName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textSecondary,
  },
  packageNameActive: {
    color: colors.primary,
  },
  packagePrice: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.extrabold,
    color: colors.textSecondary,
  },
  packagePriceActive: {
    color: colors.primary,
  },
  featureList: {
    marginTop: spacing.sm,
    paddingLeft: spacing.lg + spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  expectCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  expectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  expectIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  expectText: {
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    fontWeight: fontWeights.medium,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  footerLeft: {},
  footerLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    fontWeight: fontWeights.medium,
  },
  footerPrice: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.primary,
  },
  footerBtn: {
    flex: 1,
    marginLeft: spacing.lg,
  },
});

export default ServiceDetailScreen;
