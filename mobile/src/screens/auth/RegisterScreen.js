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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { signup, getProfile } from '../../api/auth';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { PrimaryButton } from '../../components/Buttons';

export default function RegisterScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { updateAuth } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const handleRegister = async () => {
    const { name, email, phone, password, confirm } = form;
    if (!name.trim() || !email.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all required fields' });
      return;
    }
    if (password !== confirm) {
      Toast.show({ type: 'error', text1: 'Passwords do not match' });
      return;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    try {
      const res = await signup({ name: name.trim(), email: email.trim(), phone: phone.trim(), password });
      if (res.token && res.user) {
        const fresh = await getProfile(res.token).catch(() => res.user);
        await updateAuth(res.token, fresh?.error ? res.user : fresh);
        Toast.show({ type: 'success', text1: `Welcome to BFS, ${res.user.name}!` });
        navigation.goBack();
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Registration failed' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Registration failed. Try again.' });
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
        end={{ x: 0, y: 0.35 }}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.headerArea}>
            <Text style={styles.headerEmoji}>🫧</Text>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSub}>Join thousands of happy customers</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.placeholder}
                autoCapitalize="words"
                value={form.name}
                onChangeText={set('name')}
              />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor={Colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onChangeText={set('email')}
              />
            </View>

            {/* Phone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone (optional)</Text>
              <View style={styles.phoneRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  placeholder="10-digit number"
                  placeholderTextColor={Colors.placeholder}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={form.phone}
                  onChangeText={set('phone')}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password *</Text>
              <View style={styles.passWrapper}>
                <TextInput
                  style={[styles.input, styles.passInput]}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry={!showPass}
                  value={form.password}
                  onChangeText={set('password')}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                  <Text style={styles.eyeIcon}>{showPass ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password *</Text>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                placeholderTextColor={Colors.placeholder}
                secureTextEntry={!showPass}
                value={form.confirm}
                onChangeText={set('confirm')}
              />
            </View>

            <PrimaryButton
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              style={styles.submitBtn}
            />

            {/* Terms */}
            <Text style={styles.terms}>
              By creating an account, you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>

            {/* Login Link */}
            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Log In</Text>
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
  container: { flexGrow: 1, paddingHorizontal: Spacing.base },
  topBar: { paddingTop: 12, paddingBottom: 4 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: { fontSize: 20, color: Colors.textPrimary, fontWeight: '600' },
  headerArea: { alignItems: 'center', paddingVertical: Spacing.lg },
  headerEmoji: { fontSize: 44, marginBottom: 6 },
  headerTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, letterSpacing: -0.5 },
  headerSub: { fontSize: 14, color: Colors.textSecondary, marginTop: 3 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.cardHeavy,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
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
  phoneRow: { flexDirection: 'row', gap: 8 },
  countryCode: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  countryCodeText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  phoneInput: { flex: 1 },
  passWrapper: { position: 'relative' },
  passInput: { paddingRight: 48 },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyeIcon: { fontSize: 18 },
  submitBtn: { marginTop: 8, marginBottom: Spacing.md },
  terms: { fontSize: 12, color: Colors.textMuted, textAlign: 'center', lineHeight: 18, marginBottom: Spacing.md },
  termsLink: { color: Colors.primary, fontWeight: '600' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14, color: Colors.textSecondary },
  loginLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
