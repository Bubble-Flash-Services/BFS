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
import { sendEmployeeOtp } from '../../api/auth';
import apiClient from '../../api/config';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { PrimaryButton } from '../../components/Buttons';

export default function EmployeeLoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { empLogin } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      Toast.show({ type: 'error', text1: 'Enter a valid 10-digit phone number' });
      return;
    }
    setLoading(true);
    try {
      const res = await sendEmployeeOtp({ phone });
      if (res.success) {
        setOtpSent(true);
        Toast.show({ type: 'success', text1: 'OTP sent to your phone' });
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Failed to send OTP' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Error sending OTP' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      Toast.show({ type: 'error', text1: 'Enter the OTP' });
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/employee/auth/verify-otp', { phone, otp });
      if (res.token && (res.employee || res.user)) {
        await empLogin(res.token, res.employee || res.user);
        Toast.show({ type: 'success', text1: 'Employee login successful' });
        navigation.replace('EmployeeDashboard');
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Invalid OTP' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'OTP verification failed' });
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
        colors={['#1A3A2A', '#2D6A4F', '#52B788']}
        style={[styles.gradient, { paddingTop: insets.top }]}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 40 }]}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <Text style={styles.logoEmoji}>👷</Text>
            <Text style={styles.logoTitle}>Employee Portal</Text>
            <Text style={styles.logoSub}>Bubble Flash Services</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Employee Login</Text>
            <Text style={styles.cardSub}>Login with your registered phone number</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
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
                  value={phone}
                  onChangeText={setPhone}
                  editable={!otpSent}
                />
              </View>
            </View>

            {otpSent && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>OTP</Text>
                <TextInput
                  style={[styles.input, styles.otpInput]}
                  placeholder="Enter OTP"
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
              <PrimaryButton title="Send OTP" onPress={handleSendOtp} loading={loading} />
            ) : (
              <>
                <PrimaryButton title="Verify & Login" onPress={handleVerifyOtp} loading={loading} />
                <TouchableOpacity onPress={() => { setOtpSent(false); setOtp(''); }} style={styles.retryLink}>
                  <Text style={styles.retryText}>Change phone number</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  gradient: { flex: 1 },
  container: { flexGrow: 1, padding: Spacing.base },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg,
  },
  backIcon: { fontSize: 20, color: Colors.white, fontWeight: '600' },
  logoArea: { alignItems: 'center', paddingVertical: Spacing.xl },
  logoEmoji: { fontSize: 54, marginBottom: 8 },
  logoTitle: { fontSize: 26, fontWeight: '900', color: Colors.white },
  logoSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 3 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadows.cardHeavy,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary, marginBottom: 3 },
  cardSub: { fontSize: 13, color: Colors.textMuted, marginBottom: Spacing.lg },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, marginBottom: 6 },
  input: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.inputBorder,
    paddingHorizontal: Spacing.base, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary,
  },
  phoneRow: { flexDirection: 'row', gap: 8 },
  countryCode: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.inputBorder,
    paddingHorizontal: 12, paddingVertical: 12, justifyContent: 'center',
  },
  countryCodeText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  phoneInput: { flex: 1 },
  otpInput: { textAlign: 'center', fontSize: 22, fontWeight: '700', letterSpacing: 8 },
  retryLink: { alignItems: 'center', marginTop: 12 },
  retryText: { fontSize: 13, color: Colors.textMuted, textDecorationLine: 'underline' },
});
