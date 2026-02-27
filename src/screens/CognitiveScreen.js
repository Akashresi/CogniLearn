import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

export default function CognitiveScreen() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [expandedRec, setExpandedRec] = useState(null);

    useEffect(() => {
        fetchCognitiveResults();
    }, []);

    const fetchCognitiveResults = async () => {
        try {
            if (user?.id) {
                const res = await API.get(`/cognitive/${user.id}`);
                setData(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!data) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
                <Text style={styles.loadingText}>Synthesizing Cognitive Data...</Text>
            </View>
        );
    }

    const typeIcons = {
        'Visual': 'eye',
        'Auditory': 'volume-medium',
        'Kinesthetic': 'hand-right',
        'Mixed': 'layers'
    };

    const MetricItem = ({ label, value, color, icon }) => (
        <View style={styles.metricCard}>
            <View style={[styles.metricIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View>
                <Text style={styles.metricLabel}>{label}</Text>
                <Text style={[styles.metricValue, { color }]}>{value}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.heroSection}>
                <View style={[styles.typeBadge, { backgroundColor: Theme.colors.primary }]}>
                    <Ionicons name={typeIcons[data.learning_type] || 'brain'} size={32} color="#fff" />
                    <Text style={styles.typeText}>{data.learning_type} Learner</Text>
                </View>
                <Text style={styles.heroTitle}>Your Cognitive Architecture</Text>
                <Text style={styles.heroSub}>Based on your recent problem-solving patterns</Text>
            </View>

            <View style={styles.metricsGrid}>
                <MetricItem label="Focus Depth" value={`${data.focus_score}%`} color={Theme.colors.primary} icon="disc" />
                <MetricItem label="Curiosity Index" value={`${data.curiosity_index}/100`} color={Theme.colors.secondary} icon="bulb" />
                <MetricItem label="Retention Rank" value="High" color={Theme.colors.accent} icon="ribbon" />
                <MetricItem label="Risk Level" value={data.at_risk ? "High" : "Low"} color={data.at_risk ? Theme.colors.error : Theme.colors.success} icon="shield-checkmark" />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Smart Recommendations</Text>
                <View style={styles.aiTag}>
                    <Text style={styles.aiTagText}>AI POWERED</Text>
                </View>
            </View>

            {data.recommendations?.map((rec, i) => (
                <TouchableOpacity
                    key={i}
                    style={styles.recCard}
                    onPress={() => setExpandedRec(expandedRec === i ? null : i)}
                    activeOpacity={0.7}
                >
                    <View style={styles.recHeader}>
                        <View style={styles.recIcon}>
                            <Ionicons name="sparkles" size={18} color={Theme.colors.accent} />
                        </View>
                        <Text style={styles.recText}>{rec}</Text>
                        <Ionicons
                            name={expandedRec === i ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={Theme.colors.border}
                        />
                    </View>
                    {expandedRec === i && (
                        <View style={styles.recDetail}>
                            <Text style={styles.detailText}>
                                Implementing this suggestion can improve your retention by up to 15% based on your current focus spikes.
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}

            <Card title="Engagement Mastery" style={styles.progressCard}>
                <Text style={styles.progLabel}>Current focus level for visual tasks</Text>
                <Progress.Bar
                    progress={data.focus_score / 100}
                    width={null}
                    height={12}
                    color={Theme.colors.primary}
                    unfilledColor={Theme.colors.border}
                    borderWidth={0}
                    borderRadius={6}
                    style={{ marginVertical: 12 }}
                />
                <Text style={styles.progSub}>Target: 90% for optimal cognitive load management.</Text>
            </Card>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: Theme.colors.textSecondary, fontWeight: '600' },

    heroSection: { alignItems: 'center', padding: Theme.spacing.xl, backgroundColor: Theme.colors.surface, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, ...Theme.shadows.sm },
    typeBadge: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.md, ...Theme.shadows.md },
    typeText: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginTop: 8 },
    heroTitle: { fontSize: 24, fontWeight: '800', color: Theme.colors.text, textAlign: 'center' },
    heroSub: { fontSize: 13, color: Theme.colors.textSecondary, marginTop: 4, textAlign: 'center' },

    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Theme.spacing.md, gap: Theme.spacing.md },
    metricCard: { flex: 1, minWidth: '45%', backgroundColor: Theme.colors.surface, padding: Theme.spacing.md, borderRadius: Theme.roundness.lg, flexDirection: 'row', alignItems: 'center', gap: 12, ...Theme.shadows.sm },
    metricIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    metricLabel: { fontSize: 10, fontWeight: '700', color: Theme.colors.textSecondary, textTransform: 'uppercase' },
    metricValue: { fontSize: 18, fontWeight: '800' },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.lg, marginBottom: Theme.spacing.md },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Theme.colors.text },
    aiTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, backgroundColor: Theme.colors.accent + '20' },
    aiTagText: { fontSize: 10, fontWeight: 'bold', color: Theme.colors.accent },

    recCard: { marginHorizontal: Theme.spacing.md, backgroundColor: Theme.colors.surface, borderRadius: Theme.roundness.md, marginBottom: Theme.spacing.sm, padding: Theme.spacing.md, ...Theme.shadows.sm },
    recHeader: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md },
    recIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: Theme.colors.accent + '10', justifyContent: 'center', alignItems: 'center' },
    recText: { flex: 1, fontSize: 14, fontWeight: '600', color: Theme.colors.text },
    recDetail: { marginTop: 12, borderTopWidth: 1, borderTopColor: Theme.colors.border, paddingTop: 12 },
    detailText: { fontSize: 13, color: Theme.colors.textSecondary, lineHeight: 18, fontStyle: 'italic' },

    progressCard: { marginHorizontal: Theme.spacing.md, marginTop: Theme.spacing.lg },
    progLabel: { fontSize: 14, color: Theme.colors.text, fontWeight: '600' },
    progSub: { fontSize: 11, color: Theme.colors.textSecondary }
});
