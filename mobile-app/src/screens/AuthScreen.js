import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors, fontSizes, fontWeights, spacing, borderRadius} from '../theme';
import Button from '../components/Button';
import Input from '../components/Input';
import {sendOTP, verifyOTP} from '../services/authService';
import {validateMobile, validateOTP} from '../utils/helpers';
import useAuth from '../hooks/useAuth';

const AuthScreen = ({navigation}) => {
  const {login} = useAuth();
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  const startResendTimer = () => {
    setResendTimer(30);
    timerRef.current = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async () => {
    setMobileError('');
    if (!validateMobile(mobile)) {
      setMobileError('Enter a valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    const result = await sendOTP(mobile);
    setLoading(false);
    if (result.success) {
      setStep('otp');
      startResendTimer();
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleVerifyOTP = async () => {
    setOtpError('');
    if (!validateOTP(otp)) {
      setOtpError('Enter the valid 6-digit OTP');
      return;
    }
    setLoading(true);
    const result = await verifyOTP(mobile, otp);
    setLoading(false);
    if (result.success) {
      login(result.data.user, result.data.token);
      navigation.replace('Main');
    } else {
      setOtpError(result.message);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) {
      return;
    }
    setLoading(true);
    const result = await sendOTP(mobile);
    setLoading(false);
    if (result.success) {
      startResendTimer();
      setOtp('');
    } else {
      Alert.alert('Error', result.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.logo}>🫧 BFS</Text>
        <Text style={styles.heading}>
          {step === 'mobile' ? 'Welcome Back!' : 'Verify OTP'}
        </Text>
        <Text style={styles.subheading}>
          {step === 'mobile'
            ? 'Enter your mobile number to continue'
            : `We sent a 6-digit OTP to +91 ${mobile}`}
        </Text>
      </View>

      <View style={styles.form}>
        {step === 'mobile' ? (
          <>
            <Input
              label="Mobile Number"
              placeholder="Enter 10-digit mobile"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              maxLength={10}
              error={mobileError}
            />
            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loading}
              size="lg"
              style={styles.btn}
            />
          </>
        ) : (
          <>
            <Input
              label="OTP"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              error={otpError}
            />
            <Button
              title="Verify & Login"
              onPress={handleVerifyOTP}
              loading={loading}
              size="lg"
              style={styles.btn}
            />
            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>Didn't receive OTP? </Text>
              <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
                <Text style={[styles.resendBtn, resendTimer > 0 && styles.resendDisabled]}>
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.changeNumber}
              onPress={() => {
                setStep('mobile');
                setOtp('');
                setOtpError('');
              }}>
              <Text style={styles.changeNumberText}>Change Number</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to our Terms of Service & Privacy Policy
      </Text>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logo: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing.md,
  },
  heading: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.extrabold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subheading: {
    fontSize: fontSizes.base,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  form: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  btn: {
    marginTop: spacing.sm,
  },
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
    alignItems: 'center',
  },
  resendLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.base,
  },
  resendBtn: {
    color: colors.primary,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold,
  },
  resendDisabled: {
    color: colors.textSecondary,
  },
  changeNumber: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  changeNumberText: {
    color: colors.accent,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  terms: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    paddingHorizontal: spacing.xl,
    paddingBottom: 32,
    lineHeight: 18,
  },
});

export default AuthScreen;
