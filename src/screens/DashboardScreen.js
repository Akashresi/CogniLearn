import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import Card from '../../components/Card';
import { CustomLineChart } from '../../components/Chart';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }) {
    const { user, role, logout } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        if (!user?.id) {
            setError("Session lost. Please log in.");
            return;
        }
        setError(null);
        try {
            const res = await API.get(`/dashboard/${user.id}`);
            setData(res.data);
        } catch (e) {
            console.error(e);
            setError("Failed to fetch dashboard data.");
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchDashboard();
        setRefreshing(false);
    };

    if (error) {
        return (
            <View style={styles.center}>
                <Ionicons name="alert-circle-outline" size={60} color={Theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchDashboard}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.retryBtn, { backgroundColor: Theme.colors.error, marginTop: 10 }]} onPress={logout}>
                    <Text style={styles.retryText}>Log Out</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Loading your insights...</Text>
            </View>
        );
    }

    const StatItem = ({ icon, label, value, color }) => (
        <View style={styles.statBox}>
            <View style={[styles.iconBox, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} color={Theme.colors.primary} />}
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.welcomeText}>Hello, {user.email?.split('@')[0] || 'User'}</Text>
                    <View style={[styles.roleBadge, { backgroundColor: Theme.colors[role] + '20' }]}>
                        <Text style={[styles.roleBadgeText, { color: Theme.colors[role] }]}>{role.toUpperCase()}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.logoutIcon} onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color={Theme.colors.textSecondary} />
                </TouchableOpacity>
            </View>

            {role === 'student' && (
                <View style={styles.content}>
                    <View style={styles.statRow}>
                        <StatItem icon="time" label="Study Time" value={`${data.study_time ?? 0}m`} color={Theme.colors.primary} />
                        <StatItem icon="flash" label="Focus Score" value={`${data.focus_score ?? 0}%`} color={Theme.colors.accent} />
                    </View>

                    <Card title="Engagement Trend" style={styles.chartCard}>
                        {data.learning_progress && (
                            <CustomLineChart
                                data={{
                                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                                    datasets: [{ data: data.learning_progress }]
                                }}
                            />
                        )}
                    </Card>

                    <Card title="Action Required" style={styles.actionCard}>
                        <View style={styles.actionItem}>
                            <Ionicons name="notifications-circle" size={32} color={Theme.colors.primary} />
                            <Text style={styles.actionText}>{data.alerts?.[0] || 'Keep up the momentum! Study your next module.'}</Text>
                        </View>
                    </Card>

                    <View style={styles.quickLinks}>
                        <TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('Study')}>
                            <Ionicons name="play-circle" size={24} color="#fff" />
                            <Text style={styles.linkBtnText}>Resume</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.linkBtn, { backgroundColor: Theme.colors.secondary }]} onPress={() => navigation.navigate('Progress')}>
                            <Ionicons name="bar-chart" size={24} color="#fff" />
                            <Text style={styles.linkBtnText}>Reports</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {role === 'parent' && (
                <View style={styles.content}>
                    <Card title="Child Overview" style={styles.summaryCard}>
                        <Text style={styles.statusTitle}>Performance Status</Text>
                        <Text style={styles.statusDesc}>{data.child_performance}</Text>
                        <View style={styles.divider} />
                        <Text style={styles.weeklySummary}>{data.weekly_overview}</Text>
                    </Card>

                    <Text style={styles.sectionTitle}>Recent Alerts</Text>
                    {data.alerts?.map((alert, i) => (
                        <View key={i} style={styles.alertItem}>
                            <Ionicons name="notifications" size={20} color={Theme.colors.accent} />
                            <Text style={styles.alertText}>{alert}</Text>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.fullReportBtn} onPress={() => navigation.navigate('Progress')}>
                        <Text style={styles.fullReportText}>View Detailed Reports</Text>
                    </TouchableOpacity>
                </View>
            )}

            {role === 'teacher' && (
                <View style={styles.content}>
                    <View style={styles.statRow}>
                        <StatItem icon="people" label="Active Students" value="30" color={Theme.colors.primary} />
                        <StatItem icon="warning" label="At Risk" value={data.at_risk_students?.length || 0} color={Theme.colors.error} />
                    </View>

                    <Card title="Class Insights">
                        <Text style={styles.classInfo}>{data.class_overview}</Text>
                    </Card>

                    <Text style={styles.sectionTitle}>Students Needing Attention</Text>
                    {data.at_risk_students?.map((stu, i) => (
                        <Card key={i} style={styles.riskCard}>
                            <View style={styles.riskRow}>
                                <Ionicons name="person-circle" size={32} color={Theme.colors.error} />
                                <Text style={styles.riskName}>{stu}</Text>
                                <TouchableOpacity style={styles.contactBtn}>
                                    <Text style={styles.contactText}>View Result</Text>
                                </TouchableOpacity>
                            </View>
                        </Card>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.lg,
        backgroundColor: Theme.colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Theme.colors.border,
    },
    welcomeText: { fontSize: 22, fontWeight: '800', color: Theme.colors.text },
    roleBadge: {
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: Theme.roundness.full,
        alignSelf: 'flex-start',
        marginTop: 4
    },
    roleBadgeText: { fontSize: 10, fontWeight: 'bold' },
    logoutIcon: { padding: 4 },
    content: { paddingVertical: Theme.spacing.md },
    statRow: { flexDirection: 'row', paddingHorizontal: Theme.spacing.md, gap: Theme.spacing.md, marginBottom: Theme.spacing.md },
    statBox: {
        flex: 1,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.roundness.lg,
        padding: Theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Theme.spacing.md,
        ...Theme.shadows.sm
    },
    iconBox: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    statLabel: { fontSize: 12, color: Theme.colors.textSecondary, fontWeight: '600' },
    statValue: { fontSize: 18, fontWeight: '800', color: Theme.colors.text },
    chartCard: { marginHorizontal: Theme.spacing.md },
    actionCard: { marginHorizontal: Theme.spacing.md, backgroundColor: Theme.colors.primary + '05', borderColor: Theme.colors.primary, borderWidth: 1 },
    actionItem: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md },
    actionText: { flex: 1, fontSize: 14, color: Theme.colors.text, fontWeight: '500' },
    quickLinks: { flexDirection: 'row', paddingHorizontal: Theme.spacing.md, gap: Theme.spacing.md, marginTop: Theme.spacing.md },
    linkBtn: {
        flex: 1,
        height: 50,
        backgroundColor: Theme.colors.primary,
        borderRadius: Theme.roundness.md,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Theme.spacing.sm,
        ...Theme.shadows.sm
    },
    linkBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    // Parent Styles
    summaryCard: { marginHorizontal: Theme.spacing.md },
    statusTitle: { fontSize: 14, color: Theme.colors.textSecondary, marginBottom: 4 },
    statusDesc: { fontSize: 20, fontWeight: 'bold', color: Theme.colors.primary, marginBottom: Theme.spacing.md },
    divider: { height: 1, backgroundColor: Theme.colors.border, marginBottom: Theme.spacing.md },
    weeklySummary: { fontSize: 15, lineHeight: 22, color: Theme.colors.textSecondary },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.text, marginHorizontal: Theme.spacing.md, marginTop: Theme.spacing.lg, marginBottom: Theme.spacing.md },
    alertItem: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md, backgroundColor: Theme.colors.surface, marginHorizontal: Theme.spacing.md, padding: Theme.spacing.md, borderRadius: Theme.roundness.md, marginBottom: Theme.spacing.sm, ...Theme.shadows.sm },
    alertText: { fontSize: 14, color: Theme.colors.text, fontWeight: '500' },
    fullReportBtn: { margin: Theme.spacing.lg, height: 50, borderRadius: Theme.roundness.md, borderWidth: 1.5, borderColor: Theme.colors.primary, justifyContent: 'center', alignItems: 'center' },
    fullReportText: { color: Theme.colors.primary, fontWeight: 'bold', fontSize: 16 },

    // Teacher Styles
    classInfo: { fontSize: 16, lineHeight: 24, color: Theme.colors.textSecondary },
    riskCard: { marginHorizontal: Theme.spacing.md, marginTop: 0, marginBottom: Theme.spacing.sm },
    riskRow: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md },
    riskName: { flex: 1, fontSize: 16, fontWeight: 'bold', color: Theme.colors.text },
    contactBtn: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: Theme.roundness.full, backgroundColor: Theme.colors.primary + '10' },
    contactText: { fontSize: 12, color: Theme.colors.primary, fontWeight: 'bold' },

    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl, backgroundColor: Theme.colors.background },
    loadingText: { marginTop: Theme.spacing.md, color: Theme.colors.textSecondary, fontWeight: '600' },
    errorText: { color: Theme.colors.error, fontSize: 16, textAlign: 'center', marginVertical: Theme.spacing.lg, fontWeight: '500' },
    retryBtn: { paddingHorizontal: 40, paddingVertical: 12, backgroundColor: Theme.colors.primary, borderRadius: Theme.roundness.md },
    retryText: { color: '#fff', fontWeight: 'bold' }
});
