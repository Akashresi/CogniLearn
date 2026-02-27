import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { CustomLineChart } from '../../components/Chart';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ReportScreen() {
    const { user } = useContext(AuthContext);
    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [viewMode, setViewMode] = useState('weekly');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            if (user?.id) {
                const resWeekly = await API.get(`/weekly-report/${user.id}`);
                setWeekly(resWeekly.data);
                const resMonthly = await API.get(`/monthly-report/${user.id}`);
                setMonthly(resMonthly.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!weekly || !monthly) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Generating multi-dimensional report...</Text>
            </View>
        );
    }

    const currentData = viewMode === 'weekly' ? weekly : monthly;

    const AchievementBadge = ({ icon, label, achieved, gradient }) => (
        <View style={[styles.badgeItem, !achieved && { opacity: 0.25 }]}>
            <LinearGradient
                colors={achieved ? gradient : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.1)']}
                style={styles.badgeCircle}
            >
                <Ionicons name={icon} size={28} color={achieved ? "#fff" : "rgba(255,255,255,0.3)"} />
            </LinearGradient>
            <Text style={styles.badgeLabel}>{label.toUpperCase()}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Neural Progress</Text>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, viewMode === 'weekly' && styles.activeToggle]}
                        onPress={() => setViewMode('weekly')}
                    >
                        <Text style={[styles.toggleText, viewMode === 'weekly' && styles.activeToggleText]}>WEEKLY</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, viewMode === 'monthly' && styles.activeToggle]}
                        onPress={() => setViewMode('monthly')}
                    >
                        <Text style={[styles.toggleText, viewMode === 'monthly' && styles.activeToggleText]}>MONTHLY</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.overviewGrid}>
                <View style={styles.overviewCard}>
                    <Text style={styles.overviewLabel}>GROWTH</Text>
                    <Text style={[styles.overviewValue, { color: Theme.colors.success }]}>+{currentData.improvement_percentage}%</Text>
                </View>
                <View style={styles.overviewCard}>
                    <Text style={styles.overviewLabel}>ENGAGEMENT</Text>
                    <Text style={[styles.overviewValue, { color: Theme.colors.primary }]}>{currentData.engagement_score}</Text>
                </View>
                <View style={styles.overviewCard}>
                    <Text style={styles.overviewLabel}>ACCURACY</Text>
                    <Text style={[styles.overviewValue, { color: Theme.colors.accent }]}>{currentData.mistake_reduction ? "ZEN" : "STABLE"}</Text>
                </View>
            </View>

            <Card glass title="NEURAL SYNC TREND" style={styles.chartCard}>
                <CustomLineChart
                    data={{
                        labels: viewMode === 'weekly' ? ['M', 'T', 'W', 'T', 'F'] : ['W1', 'W2', 'W3', 'W4'],
                        datasets: [{ data: currentData.accuracy_trend || [0, 0, 0, 0, 0] }]
                    }}
                />
            </Card>

            <Text style={styles.sectionTitle}>Neural Achievements</Text>
            <View style={styles.badgesGrid}>
                <AchievementBadge icon="rocket" label="Fast Orbit" achieved={true} gradient={['#F59E0B', '#FCD34D']} />
                <AchievementBadge icon="brain" label="Deep Sync" achieved={currentData.engagement_score > 80} gradient={['#6366F1', '#A855F7']} />
                <AchievementBadge icon="shield" label="Safe Logic" achieved={currentData.mistake_reduction} gradient={['#10B981', '#34D399']} />
                <AchievementBadge icon="diamond" label="Elite Tier" achieved={false} gradient={['#EC4899', '#F472B6']} />
            </View>

            <Card glass title="COGNITIVE SUMMARY" style={styles.analysisCard}>
                <View style={styles.analysisBox}>
                    <LinearGradient
                        colors={currentData.mistake_reduction ? ['#10B981', '#34D399'] : ['#EF4444', '#F87171']}
                        style={styles.analysisIcon}
                    >
                        <Ionicons name={currentData.mistake_reduction ? "checkmark-done" : "construct"} size={24} color="#fff" />
                    </LinearGradient>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.analysisTitle}>
                            {currentData.mistake_reduction ? "PATTERN MASTERED" : "LOGIC RE-SYNC REQUIRED"}
                        </Text>
                        <Text style={styles.analysisSub}>
                            {currentData.mistake_reduction
                                ? "Your neural mistake rates have plummeted by 30%. You are entering a state of high-accuracy flow."
                                : "A minor drift in logic detected. Engaging supplementary modules will stabilize your accuracy."}
                        </Text>
                    </View>
                </View>
            </Card>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
    loadingText: { marginTop: 12, color: Theme.colors.textSecondary, fontWeight: '700', fontSize: 12 },

    header: { padding: Theme.spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: '900', color: '#fff' },
    toggleContainer: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: 4 },
    toggleBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
    activeToggle: { backgroundColor: 'rgba(255,255,255,0.1)' },
    toggleText: { fontSize: 10, fontWeight: '900', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },
    activeToggleText: { color: Theme.colors.primary },

    overviewGrid: { flexDirection: 'row', paddingHorizontal: Theme.spacing.md, gap: 10, marginBottom: Theme.spacing.lg },
    overviewCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.03)', padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
    overviewLabel: { fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.5)', letterSpacing: 1, marginBottom: 4 },
    overviewValue: { fontSize: 20, fontWeight: '900' },

    chartCard: { marginHorizontal: Theme.spacing.md, backgroundColor: 'rgba(30, 41, 59, 0.7)' },

    sectionTitle: { fontSize: 16, fontWeight: '900', color: '#fff', marginHorizontal: Theme.spacing.lg, marginTop: 30, marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' },
    badgesGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: Theme.spacing.xl },
    badgeItem: { alignItems: 'center', gap: 8 },
    badgeCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', ...Theme.shadows.md, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
    badgeLabel: { fontSize: 8, fontWeight: '900', color: 'rgba(255,255,255,0.6)', textAlign: 'center' },

    analysisCard: { marginHorizontal: Theme.spacing.md },
    analysisBox: { flexDirection: 'row', gap: Theme.spacing.lg, alignItems: 'center' },
    analysisIcon: { width: 50, height: 50, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
    analysisTitle: { fontSize: 14, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
    analysisSub: { fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 18, marginTop: 6, fontStyle: 'italic' }
});
