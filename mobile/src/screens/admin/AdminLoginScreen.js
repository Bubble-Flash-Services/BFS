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
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { adminLogin as adminLoginApi } from '../../api/auth';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { PrimaryButton } from '../../components/Buttons';

export default function AdminLoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Toast.show({ type: 'error', text1: 'Please fill all fields' });
      return;
    }
    setLoading(true);
    try {
      const res = await adminLoginApi({ email: email.trim(), password });
      if (res.token && (res.admin || res.user)) {
        await adminLogin(res.token, res.admin || res.user);
        Toast.show({ type: 'success', text1: 'Admin login successful' });
        navigation.replace('AdminDashboard');
      } else {
        Toast.show({ type: 'error', text1: res.message || 'Invalid credentials' });
      }
    } catch {
      Toast.show({ type: 'error', text1: 'Login failed. Check your credentials.' });
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
        colors={['#1A1A1A', '#333', '#555']}
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
            <Text style={styles.logoEmoji}>🔐</Text>
            <Text style={styles.logoTitle}>Admin Portal</Text>
            <Text style={styles.logoSub}>Bubble Flash Services</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Admin Login</Text>
            <Text style={styles.cardSub}>Enter your administrator credentials</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="admin@bubbleflash.in"
                placeholderTextColor={Colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passRow}>
                <TextInput
                  style={[styles.input, styles.passInput]}
                  placeholder="Enter password"
                  placeholderTextColor={Colors.placeholder}
                  secureTextEntry={!showPass}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
                  <Text>{showPass ? '🙈' : '👁'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <PrimaryButton title="Login as Admin" onPress={handleLogin} loading={loading} />

            <View style={styles.warningBox}>
              <Text style={styles.warningText}>⚠️ This portal is for authorized administrators only. Unauthorized access is prohibited.</Text>
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
  container: { flexGrow: 1, padding: Spacing.base },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  backIcon: { fontSize: 20, color: Colors.white, fontWeight: '600' },
  logoArea: { alignItems: 'center', paddingVertical: Spacing.xl },
  logoEmoji: { fontSize: 54, marginBottom: 8 },
  logoTitle: { fontSize: 26, fontWeight: '900', color: Colors.primary },
  logoSub: { fontSize: 13, color: '#ccc', marginTop: 3 },
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
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.inputBorder,
    paddingHorizontal: Spacing.base,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  passRow: { position: 'relative' },
  passInput: { paddingRight: 48 },
  eyeBtn: {
    position: 'absolute', right: 12, top: 10, width: 32, height: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFEEBA',
  },
  warningText: { fontSize: 12, color: '#856404', lineHeight: 17 },
});
