import React, {useEffect, useRef} from 'react';
import {View, Text, Animated, StyleSheet, StatusBar, Image} from 'react-native';
import {colors, fontSizes, fontWeights} from '../theme';

const SplashScreen = ({navigation}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <Animated.View
        style={[
          styles.content,
          {opacity: fadeAnim, transform: [{scale: scaleAnim}]},
        ]}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🫧</Text>
          </View>
        </View>
        <Text style={styles.brandName}>Bubble Flash</Text>
        <Text style={styles.brandSub}>Services</Text>
        <Text style={styles.tagline}>Your Vehicle, Our Care</Text>
      </Animated.View>
      <Animated.View style={[styles.footer, {opacity: fadeAnim}]}>
        <Text style={styles.footerText}>v1.0.0</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoEmoji: {
    fontSize: 60,
  },
  brandName: {
    fontSize: 36,
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    letterSpacing: 1,
  },
  brandSub: {
    fontSize: 24,
    fontWeight: fontWeights.light,
    color: colors.secondary,
    letterSpacing: 6,
    marginTop: -4,
    marginBottom: 12,
  },
  tagline: {
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
  },
  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: fontSizes.xs,
  },
});

export default SplashScreen;
