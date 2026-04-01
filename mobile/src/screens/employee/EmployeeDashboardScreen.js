import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import { useAuth } from '../../context/AuthContext';
import { getEmployeeDashboard, getEmployeeAssignments, markAssignmentComplete } from '../../api/admin';
import Colors from '../../theme/colors';
import { Spacing, Radius, Shadows } from '../../theme/styles';
import { StatCard } from '../../components/Cards';

const STATUS_COLOR = {
  pending: Colors.statusPending,
  assigned: Colors.statusConfirmed,
  'in-progress': Colors.statusInProgress,
  completed: Colors.statusCompleted,
  cancelled: Colors.statusCancelled,
};

export default function EmployeeDashboardScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { employeeToken, employeeUser, empLogout, isEmployee } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    if (isEmployee) fetchData();
    else setLoading(false);
  }, [isEmployee]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dashRes, assignRes] = await Promise.allSettled([
        getEmployeeDashboard(employeeToken),
        getEmployeeAssignments(employeeToken),
      ]);
      if (dashRes.status === 'fulfilled') setStats(dashRes.value);
      if (assignRes.status === 'fulfilled') {
        const list = assignRes.value?.assignments || assignRes.value;
        setAssignments(Array.isArray(list) ? list : []);
      }
    } catch {} finally { setLoading(false); }
  };

  const handleComplete = async (assignmentId) => {
    Alert.alert('Mark Complete', 'Mark this assignment as completed?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete', onPress: async () => {
          setCompleting(assignmentId);
          try {
            await markAssignmentComplete(employeeToken, assignmentId);
            Toast.show({ type: 'success', text1: 'Assignment marked complete!' });
            fetchData();
          } catch {
            Toast.show({ type: 'error', text1: 'Failed to update assignment' });
          } finally { setCompleting(null); }
        },
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Log out from employee portal?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: async () => {
        await empLogout();
        navigation.replace('Profile');
      }},
    ]);
  };

  if (!isEmployee) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}><Text style={styles.headerTitle}>Employee Dashboard</Text></View>
        <View style={styles.center}>
          <Text style={styles.centerEmoji}>👷</Text>
          <Text style={styles.centerText}>Employee access required</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.replace('EmployeeLogin')}>
            <Text style={styles.loginBtnText}>Employee Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const todaysWork = assignments.filter(a => {
    const today = new Date().toDateString();
    return a.scheduledDate && new Date(a.scheduledDate).toDateString() === today;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>My Dashboard</Text>
          <Text style={styles.headerSub}>{employeeUser?.name || 'Employee'}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color={Colors.error} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color={Colors.primary} /></View>
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats */}
          <Text style={styles.sectionTitle}>Today's Stats</Text>
          <View style={styles.statsRow}>
            <StatCard label="Today's Jobs" value={todaysWork.length} icon="📅" color={Colors.info} style={styles.statCard} />
            <StatCard label="Completed" value={stats?.completedToday ?? 0} icon="✅" color={Colors.success} style={styles.statCard} />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Total Done" value={stats?.totalCompleted ?? assignments.filter(a => a.status === 'completed').length} icon="🏆" color={Colors.warning} style={styles.statCard} />
            <StatCard label="Earnings" value={`₹${stats?.earnings ?? 0}`} icon="💰" color={Colors.success} style={styles.statCard} />
          </View>

          {/* Assignments */}
          <Text style={styles.sectionTitle}>Assignments</Text>
          {assignments.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>No assignments yet</Text>
              <Text style={styles.emptySub}>Check back soon for new tasks</Text>
            </View>
          ) : (
            assignments.map((a) => (
              <AssignmentCard
                key={a._id}
                assignment={a}
                onComplete={() => handleComplete(a._id)}
                completing={completing === a._id}
              />
            ))
          )}
          <View style={{ height: insets.bottom + 20 }} />
        </ScrollView>
      )}
    </View>
  );
}

function AssignmentCard({ assignment, onComplete, completing }) {
  const status = assignment.status?.toLowerCase() || 'pending';
  const color = STATUS_COLOR[status] || Colors.textMuted;
  const canComplete = ['assigned', 'in-progress'].includes(status);

  return (
    <View style={styles.assignCard}>
      <View style={styles.assignHeader}>
        <View>
          <Text style={styles.assignId}>#{assignment._id?.slice(-6).toUpperCase()}</Text>
          <Text style={styles.assignService}>{assignment.serviceName || 'Service'}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: color + '22', borderColor: color }]}>
          <Text style={[styles.statusText, { color }]}>{status}</Text>
        </View>
      </View>

      {assignment.customer && (
        <View style={styles.assignInfo}>
          <Text style={styles.infoIcon}>👤</Text>
          <Text style={styles.infoText}>{assignment.customer?.name || 'Customer'}</Text>
        </View>
      )}
      {assignment.address && (
        <View style={styles.assignInfo}>
          <Text style={styles.infoIcon}>📍</Text>
          <Text style={styles.infoText} numberOfLines={1}>
            {assignment.address?.street || assignment.address}
          </Text>
        </View>
      )}
      {assignment.scheduledDate && (
        <View style={styles.assignInfo}>
          <Text style={styles.infoIcon}>🕐</Text>
          <Text style={styles.infoText}>
            {new Date(assignment.scheduledDate).toLocaleString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </Text>
        </View>
      )}

      {canComplete && (
        <TouchableOpacity
          style={styles.completeBtn}
          onPress={onComplete}
          disabled={completing}
          activeOpacity={0.8}
        >
          {completing ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.completeBtnText}>✓ Mark Complete</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: 14,
    backgroundColor: Colors.white, ...Shadows.card,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary },
  headerSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  logoutBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.error + '15', alignItems: 'center', justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  centerEmoji: { fontSize: 54, marginBottom: 16 },
  centerText: { fontSize: 18, fontWeight: '700', color: Colors.textSecondary, marginBottom: 24 },
  loginBtn: {
    backgroundColor: Colors.primary, borderRadius: Radius.full,
    paddingVertical: 12, paddingHorizontal: 28, ...Shadows.button,
  },
  loginBtnText: { fontSize: 15, fontWeight: '700', color: Colors.secondary },
  content: { padding: Spacing.base },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.md, marginTop: Spacing.sm },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  statCard: { flex: 1 },
  emptyCard: {
    backgroundColor: Colors.white, borderRadius: Radius.xl,
    padding: Spacing.xl, alignItems: 'center', ...Shadows.card,
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textSecondary },
  emptySub: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  assignCard: {
    backgroundColor: Colors.white, borderRadius: Radius.lg,
    padding: Spacing.base, marginBottom: Spacing.md, ...Shadows.card,
  },
  assignHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  assignId: { fontSize: 12, fontWeight: '700', color: Colors.textMuted },
  assignService: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginTop: 2 },
  statusBadge: { borderRadius: Radius.full, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  assignInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  infoIcon: { fontSize: 14, marginRight: 6 },
  infoText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  completeBtn: {
    backgroundColor: Colors.success, borderRadius: Radius.full,
    paddingVertical: 10, alignItems: 'center', marginTop: Spacing.sm,
  },
  completeBtnText: { fontSize: 14, fontWeight: '700', color: Colors.white },
});
