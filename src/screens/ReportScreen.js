import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { CustomLineChart } from '../../components/Chart';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function ReportScreen() {
    const { user } = useContext(AuthContext);
    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);
    const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'

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
                <Text style={styles.loadingText}>Compiling Progress Reports...</Text>
            </View>
        );
    }

    const currentData = viewMode === 'weekly' ? weekly : monthly;

    const Badge = ({ icon, label, achieved }) => (
        <View style={[styles.badgeItem, !achieved && { opacity: 0.3 }]}>
            <View style={[styles.badgeCircle, { backgroundColor: achieved ? Theme.colors.secondary + '20' : Theme.colors.border }]}>
                <Ionicons name={icon} size={28} color={achieved ? Theme.colors.secondary : Theme.colors.textSecondary} />
            </View>
            <Text style={styles.badgeLabel}>{label}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleBtn, viewMode === 'weekly' && styles.activeToggle]}
                    onPress={() => setViewMode('weekly')}
                >
                    <Text style={[styles.toggleText, viewMode === 'weekly' && styles.activeToggleText]}>Weekly</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, viewMode === 'monthly' && styles.activeToggle]}
                    onPress={() => setViewMode('monthly')}
                >
                    <Text style={[styles.toggleText, viewMode === 'monthly' && styles.activeToggleText]}>Monthly</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.summaryOverview}>
                <View style={styles.overviewItem}>
                    <Text style={styles.overviewValue}>{currentData.improvement_percentage}%</Text>
                    <Text style={styles.overviewLabel}>Growth</Text>
                    <Ionicons name="trending-up" size={16} color={Theme.colors.success} />
                </View>
                <View style={styles.overviewDivider} />
                <View style={styles.overviewItem}>
                    <Text style={styles.overviewValue}>{currentData.engagement_score}</Text>
                    <Text style={styles.overviewLabel}>Engagement</Text>
                    <Ionicons name="heart" size={16} color={Theme.colors.error} />
                </View>
                <View style={styles.overviewDivider} />
                <View style={styles.overviewItem}>
                    <Text style={styles.overviewValue}>{currentData.mistake_reduction ? "Yes" : "No"}</Text>
                    <Text style={styles.overviewLabel}>Accuracy Up</Text>
                    <Ionicons name="checkmark-circle" size={16} color={Theme.colors.primary} />
                </View>
            </View>

            <Card title={`${viewMode === 'weekly' ? 'Daily' : 'Weekly'} Accuracy Trend`} style={styles.chartCard}>
                <CustomLineChart
                    data={{
                        labels: viewMode === 'weekly' ? ['M', 'T', 'W', 'Th', 'F'] : ['W1', 'W2', 'W3', 'W4'],
                        datasets: [{ data: currentData.accuracy_trend || [0, 0, 0, 0, 0] }]
                    }}
                />
            </Card>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Achievements & Badges</Text>
            </View>

            <View style={styles.badgesGrid}>
                <Badge icon="ribbon" label="Early Bird" achieved={true} />
                <Badge icon="flame" label="Focus Pro" achieved={currentData.engagement_score > 80} />
                <Badge icon="trophy" label="Accuracy King" achieved={currentData.mistake_reduction} />
                <Badge icon="star" label="Top 10%" achieved={false} />
            </View>

            <Card title="Quick Analysis" style={styles.analysisCard}>
                <View style={styles.analysisItem}>
                    <Ionicons
                        name={currentData.mistake_reduction ? "happy-outline" : "sad-outline"}
                        size={32}
                        color={currentData.mistake_reduction ? Theme.colors.success : Theme.colors.error}
                    />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.analysisTitle}>
                            {currentData.mistake_reduction ? "Outstanding Accuracy!" : "Room for Improvement"}
                        </Text>
                        <Text style={styles.analysisSub}>
                            {currentData.mistake_reduction
                                ? "You've consistently reduced errors. Your cognitive focus is sharpening."
                                : "Try slowing down during the logic questions to reduce mistake rates."}
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: Theme.colors.textSecondary, fontWeight: '600' },

    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: Theme.colors.border + '50',
        borderRadius: Theme.roundness.md,
        margin: Theme.spacing.lg,
        padding: 4
    },
    toggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: Theme.roundness.sm },
    activeToggle: { backgroundColor: Theme.colors.surface, ...Theme.shadows.sm },
    toggleText: { fontWeight: '700', color: Theme.colors.textSecondary, fontSize: 14 },
    activeToggleText: { color: Theme.colors.primary },

    summaryOverview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Theme.colors.surface,
        marginHorizontal: Theme.spacing.lg,
        paddingVertical: Theme.spacing.lg,
        paddingHorizontal: Theme.spacing.md,
        borderRadius: Theme.roundness.xl,
        ...Theme.shadows.sm,
        marginBottom: Theme.spacing.lg
    },
    overviewItem: { flex: 1, alignItems: 'center' },
    overviewDivider: { width: 1, height: '80%', backgroundColor: Theme.colors.border, alignSelf: 'center' },
    overviewValue: { fontSize: 20, fontWeight: '800', color: Theme.colors.text },
    overviewLabel: { fontSize: 10, fontWeight: '700', color: Theme.colors.textSecondary, textTransform: 'uppercase', marginTop: 2 },

    chartCard: { marginHorizontal: Theme.spacing.lg },

    sectionHeader: { paddingHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.md },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Theme.colors.text },

    badgesGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Theme.spacing.lg,
        marginBottom: Theme.spacing.lg
    },
    badgeItem: { alignItems: 'center', gap: 6 },
    badgeCircle: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', ...Theme.shadows.sm },
    badgeLabel: { fontSize: 10, fontWeight: '700', color: Theme.colors.textSecondary, textAlign: 'center' },

    analysisCard: { marginHorizontal: Theme.spacing.lg, backgroundColor: '#fff' },
    analysisItem: { flexDirection: 'row', gap: Theme.spacing.md, alignItems: 'center' },
    analysisTitle: { fontSize: 16, fontWeight: '800', color: Theme.colors.text },
    analysisSub: { fontSize: 13, color: Theme.colors.textSecondary, lineHeight: 18, marginTop: 4 }
});
