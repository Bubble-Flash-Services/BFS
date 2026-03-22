import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import Button from '../components/Button';

const {width, height} = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    emoji: '🚗',
    title: 'Premium Vehicle\nWash Services',
    subtitle:
      'Experience professional car, bike & helmet wash at your doorstep. Sparkling clean, every time.',
    bg: colors.primary,
    accent: colors.secondary,
  },
  {
    id: 2,
    emoji: '📋',
    title: 'PUC & Insurance\nMade Simple',
    subtitle:
      'Get your PUC certificate and vehicle insurance sorted in minutes. Hassle-free and at your convenience.',
    bg: '#1A3A6B',
    accent: colors.accent,
  },
  {
    id: 3,
    emoji: '⚡',
    title: 'Book in Seconds,\nTrack Live',
    subtitle:
      'Schedule any vehicle service with a few taps. Real-time tracking and instant confirmations.',
    bg: '#0D2B55',
    accent: colors.secondary,
  },
];

const OnboardingScreen = ({navigation}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      scrollRef.current?.scrollTo({x: width * next, animated: true});
      setCurrentIndex(next);
    } else {
      navigation.replace('Auth');
    }
  };

  const skip = () => {
    navigation.replace('Auth');
  };

  const handleScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(idx);
  };

  const slide = SLIDES[currentIndex];

  return (
    <View style={[styles.container, {backgroundColor: slide.bg}]}>
      <StatusBar barStyle="light-content" backgroundColor={slide.bg} />
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}>
        {SLIDES.map((s, i) => (
          <View key={s.id} style={styles.slide}>
            <View style={[styles.emojiContainer, {borderColor: s.accent + '40'}]}>
              <Text style={styles.emoji}>{s.emoji}</Text>
            </View>
            <Text style={styles.title}>{s.title}</Text>
            <Text style={styles.subtitle}>{s.subtitle}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && [styles.activeDot, {backgroundColor: slide.accent}],
              ]}
            />
          ))}
        </View>
        <Button
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={goNext}
          variant="secondary"
          size="lg"
          style={styles.nextBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: spacing.lg,
    zIndex: 10,
    padding: spacing.sm,
  },
  skipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
  },
  scroll: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 80,
  },
  emojiContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 48,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    borderRadius: 4,
  },
  nextBtn: {
    width: '100%',
  },
});

export default OnboardingScreen;
