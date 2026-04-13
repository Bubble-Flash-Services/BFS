import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { login, getProfile, googleTokenLogin, sendOtp, signinOtp } from '../../api/auth';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { PrimaryButton, GoogleButton } from '../../components/Buttons';

// Needed for expo-auth-session to properly dismiss the browser
WebBrowser.maybeCompleteAuthSession();

// ─── Google OAuth Config ──────────────────────────────────────────────────────
// Replace with your actual Google OAuth Client IDs from Google Cloud Console
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '';
const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
const GOOGLE_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';

// ─── OTP Login Tab ────────────────────────────────────────────────────────────
function OtpLogin({ onSuccess }) {
  const { updateAuth } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Invalid phone number' });
      return;
    }
    setLoading(true);
    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        Toast.show({ type: 'success', text1: 'OTP sent successfully!' });
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Failed to send OTP' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Failed to send OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await signinOtp({ phone, otp });
      if (res.token && res.user) {
        const fresh = await getProfile(res.token).catch(() => res.user);
        await updateAuth(res.token, fresh?.error ? res.user : fresh);
        Toast.show({ type: 'success', text1: `Welcome, ${res.user.name || 'User'}!` });
        onSuccess?.();
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Invalid OTP' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Invalid OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
          </View>
          <TextInput
            style={[styles.input, styles.phoneInput]}
            placeholder="10-digit mobile number"
            placeholderTextColor={Colors.placeholder}
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>
      </View>

      {otpSent && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enter OTP</Text>
          <TextInput
            style={[styles.input, styles.otpInput]}
            placeholder="6-digit OTP"
            placeholderTextColor={Colors.placeholder}
            keyboardType="number-pad"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
            textAlign="center"
          />
        </View>
      )}

      {!otpSent ? (
        <PrimaryButton title="Send OTP" onPress={handleSendOtp} loading={loading} style={styles.actionBtn} />
      ) : (
        <>
          <PrimaryButton title="Verify & Login" onPress={handleVerifyOtp} loading={loading} style={styles.actionBtn} />
          <TouchableOpacity onPress={() => setOtpSent(false)} style={styles.resendLink}>
            <Text style={styles.resendText}>Change phone number</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// ─── Main Login Screen ────────────────────────────────────────────────────────
export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { updateAuth } = useAuth();
  const [tab, setTab] = useState('email'); // 'email' | 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // ─── Expo Google Auth Session (in-app, no Chrome redirect) ───────────────
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,            // Web client ID (for Expo Go)
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    redirectUri: makeRedirectUri({ scheme: 'bubbleflash' }),
    scopes: ['openid', 'profile', 'email'],
  });

  // Handle Google auth response
  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      handleGoogleSuccess(access_token);
    } else if (response?.type === 'error') {
      Toast.show({ type: 'error', text1: 'Google sign-in failed' });
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleSuccess = async (accessToken) => {
    setGoogleLoading(true);
    try {
      const res = await googleTokenLogin(accessToken);
      if (res.token && res.user) {
        const fresh = await getProfile(res.token).catch(() => res.user);
        await updateAuth(res.token, fresh?.error ? res.user : fresh);
        Toast.show({ type: 'success', text1: `Welcome, ${res.user.name || 'User'}!` });
        navigation.goBack();
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Google sign-in failed' });
      }
    } catch (err) {
      console.error('Google login error:', err);
      Toast.show({ type: 'error', text1: 'Google sign-in failed. Please try again.' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    try {
      const res = await login({ email: email.trim(), password });
      if (res.token && res.user) {
        const fresh = await getProfile(res.token).catch(() => res.user);
        await updateAuth(res.token, fresh?.error ? res.user : fresh);
        Toast.show({ type: 'success', text1: `Welcome back, ${res.user.name || 'User'}!` });
        navigation.goBack();
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Invalid credentials' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={['#FFCC00', '#FFF3B0', '#FFFFFF']}
        style={[styles.gradient, { paddingTop: insets.top }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoArea}>
            <Text style={styles.logoEmoji}>🫧</Text>
            <Text style={styles.logoTitle}>Bubble Flash</Text>
            <Text style={styles.logoSubtitle}>Doorstep Services</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue</Text>

            {/* Tab Switcher */}
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tab, tab === 'email' && styles.tabActive]}
                onPress={() => setTab('email')}
              >
                <Text style={[styles.tabText, tab === 'email' && styles.tabTextActive]}>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, tab === 'otp' && styles.tabActive]}
                onPress={() => setTab('otp')}
              >
                <Text style={[styles.tabText, tab === 'otp' && styles.tabTextActive]}>OTP</Text>
              </TouchableOpacity>
            </View>

            {tab === 'email' ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your@email.com"
                    placeholderTextColor={Colors.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                      <Text style={styles.forgotLink}>Forgot?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.passwordRow}>
                    <TextInput
                      style={[styles.input, styles.passwordInput]}
                      placeholder="Enter password"
                      placeholderTextColor={Colors.placeholder}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity
                      style={styles.eyeBtn}
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <PrimaryButton
                  title="Log In"
                  onPress={handleEmailLogin}
                  loading={loading}
                  style={styles.actionBtn}
                />
              </>
            ) : (
              <OtpLogin onSuccess={() => navigation.goBack()} />
            )}

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign-In (in-app, no browser) */}
            {GOOGLE_CLIENT_ID ? (
              <GoogleButton
                onPress={() => {
                  setGoogleLoading(true);
                  promptAsync();
                }}
                loading={googleLoading}
                style={styles.googleBtn}
              />
            ) : null}

            {/* Sign Up Link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>New to BFS? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradient: { flex: 1 },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing.base,
  },
  topBar: {
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  logoArea: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  logoEmoji: {
    fontSize: 54,
    marginBottom: 6,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.cardHeavy,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.sectionBg,
    borderRadius: Radius.full,
    padding: 3,
    marginBottom: Spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: Radius.full,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    ...Shadows.card,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.textPrimary,
  },
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: {
    fontSize: 18,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCode: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  countryCodeText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
  },
  otpInput: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 8,
  },
  resendLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    fontSize: 13,
    color: Colors.textMuted,
    textDecorationLine: 'underline',
  },
  actionBtn: {
    marginTop: 4,
    marginBottom: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  googleBtn: {
    marginBottom: Spacing.md,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  signupText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
});
