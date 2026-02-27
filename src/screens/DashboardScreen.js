import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import Card from '../../components/Card';
import { CustomLineChart } from '../../components/Chart';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

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
            </View>
        );
    }

    if (!data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Syncing with AI neural engine...</Text>
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
        <View style={styles.mainContainer}>
            <ScrollView
                style={styles.container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Theme.colors.primary} />}
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={Theme.colors.primaryGradient}
                    style={styles.headerGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.welcomeText}>Hello, {user.email?.split('@')[0] || 'User'}</Text>
                            <Text style={styles.headerSub}>Ready to optimize your cognitive load today?</Text>
                        </View>
                        <TouchableOpacity style={styles.profileBtn} onPress={logout}>
                            <Ionicons name="person-circle-outline" size={40} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.quickStatsRow}>
                        <View style={styles.quickStat}>
                            <Text style={styles.quickStatValue}>{data.study_time ?? 0}m</Text>
                            <Text style={styles.quickStatLabel}>ACTIVE STUDY</Text>
                        </View>
                        <View style={styles.quickStatDivider} />
                        <View style={styles.quickStat}>
                            <Text style={styles.quickStatValue}>{data.focus_score ?? 0}%</Text>
                            <Text style={styles.quickStatLabel}>FOCUS DEPTH</Text>
                        </View>
                        <View style={styles.quickStatDivider} />
                        <View style={styles.quickStat}>
                            <Text style={styles.quickStatValue}>92</Text>
                            <Text style={styles.quickStatLabel}>IQ INDEX</Text>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Cognitive Momentum</Text>
                        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Progress')}>
                            <Text style={styles.seeAllText}>VIEW ANALYTICS</Text>
                        </TouchableOpacity>
                    </View>

                    <Card glass title="Real-time Performance" style={styles.chartCard}>
                        {data.learning_progress && (
                            <CustomLineChart
                                data={{
                                    labels: ['M', 'T', 'W', 'T', 'F'],
                                    datasets: [{ data: data.learning_progress }]
                                }}
                            />
                        )}
                    </Card>

                    <Text style={styles.sectionTitle}>Smart Recommendations</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
                        <TouchableOpacity style={styles.suggestionCard}>
                            <LinearGradient colors={['#FFAD60', '#FF5F5F']} style={styles.suggestionIcon}>
                                <Ionicons name="flash" size={24} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.suggestionTitle}>Boost Focus</Text>
                            <Text style={styles.suggestionDesc}>Detected fatigue spikes. Take a 5-min break.</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.suggestionCard}>
                            <LinearGradient colors={['#4facfe', '#00f2fe']} style={styles.suggestionIcon}>
                                <Ionicons name="book" size={24} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.suggestionTitle}>Master Math</Text>
                            <Text style={styles.suggestionDesc}>Logic modules are your strongest suit.</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <Card glass title="Neural Status" style={styles.actionCard}>
                        <View style={styles.actionItem}>
                            <View style={styles.pulseContainer}>
                                <View style={styles.pulseInner} />
                            </View>
                            <Text style={styles.actionText}>{data.alerts?.[0] || 'Neural patterns stable. Ready for advanced modules.'}</Text>
                        </View>
                    </Card>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Floating AI Assistant Button */}
            <TouchableOpacity style={styles.floatingAI} activeOpacity={0.8}>
                <LinearGradient
                    colors={['#6366F1', '#A855F7']}
                    style={styles.floatingAIGradient}
                >
                    <Ionicons name="sparkles" size={28} color="#fff" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: Theme.colors.background },
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
    headerGradient: {
        paddingTop: 60,
        paddingBottom: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        ...Theme.shadows.lg
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
        marginBottom: Theme.spacing.xl
    },
    welcomeText: { fontSize: 26, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    headerSub: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 4, fontWeight: '500' },
    profileBtn: { padding: 2 },

    quickStatsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 20
    },
    quickStat: { alignItems: 'center' },
    quickStatValue: { fontSize: 22, fontWeight: '900', color: '#fff' },
    quickStatLabel: { fontSize: 9, color: 'rgba(255, 255, 255, 0.7)', marginTop: 4, fontWeight: '700', letterSpacing: 1 },
    quickStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255, 255, 255, 0.2)' },

    content: { paddingVertical: Theme.spacing.lg },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.lg,
        marginBottom: Theme.spacing.md
    },
    sectionTitle: { fontSize: 20, fontWeight: '900', color: Theme.colors.text, paddingHorizontal: Theme.spacing.lg, marginTop: 10, marginBottom: 15 },
    seeAllBtn: { paddingVertical: 4 },
    seeAllText: { fontSize: 11, fontWeight: '800', color: Theme.colors.primary, letterSpacing: 0.5 },

    chartCard: { marginHorizontal: Theme.spacing.md, backgroundColor: 'rgba(30, 41, 59, 0.7)' },

    horizontalScroll: { paddingLeft: Theme.spacing.lg, marginBottom: Theme.spacing.lg },
    suggestionCard: {
        width: 160,
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.roundness.xl,
        padding: Theme.spacing.md,
        marginRight: Theme.spacing.md,
        ...Theme.shadows.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)'
    },
    suggestionIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    suggestionTitle: { fontSize: 15, fontWeight: '800', color: Theme.colors.text },
    suggestionDesc: { fontSize: 11, color: Theme.colors.textSecondary, marginTop: 4, lineHeight: 15 },

    actionCard: { marginHorizontal: Theme.spacing.md, borderColor: Theme.colors.primary + '30', borderWidth: 1 },
    actionItem: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md },
    pulseContainer: { width: 12, height: 12, borderRadius: 6, backgroundColor: Theme.colors.primary + '30', justifyContent: 'center', alignItems: 'center' },
    pulseInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: Theme.colors.primary },
    actionText: { flex: 1, fontSize: 14, color: Theme.colors.text, fontWeight: '600' },

    floatingAI: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        width: 64,
        height: 64,
        borderRadius: 32,
        ...Theme.shadows.lg,
        zIndex: 999
    },
    floatingAIGradient: {
        flex: 1,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },

    loadingText: { marginTop: Theme.spacing.md, color: Theme.colors.textSecondary, fontWeight: '600' },
    errorText: { color: Theme.colors.error, fontSize: 16, textAlign: 'center', marginVertical: Theme.spacing.lg },
    retryBtn: { paddingHorizontal: 40, paddingVertical: 12, backgroundColor: Theme.colors.primary, borderRadius: Theme.roundness.md },
    retryText: { color: '#fff', fontWeight: 'bold' }
});
