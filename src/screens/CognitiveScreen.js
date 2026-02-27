import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';

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
                <Text style={styles.loadingText}>Synthesizing cognitive neural pathways...</Text>
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
            <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View>
                <Text style={styles.metricLabel}>{label}</Text>
                <Text style={[styles.metricValue, { color: '#fff' }]}>{value}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={['#1e293b', '#0f172a']}
                style={styles.heroSection}
            >
                <LinearGradient
                    colors={Theme.colors.primaryGradient}
                    style={styles.typeBadge}
                >
                    <Ionicons name={typeIcons[data.learning_type] || 'brain'} size={44} color="#fff" />
                    <Text style={styles.typeText}>{data.learning_type.toUpperCase()} LEARNER</Text>
                </LinearGradient>
                <Text style={styles.heroTitle}>Cognitive Analysis</Text>
                <Text style={styles.heroSub}>Your neural learning profile is 98% complete</Text>
            </LinearGradient>

            <View style={styles.metricsGrid}>
                <MetricItem label="FOCUS DEPTH" value={`${data.focus_score}%`} color={Theme.colors.primary} icon="disc" />
                <MetricItem label="CURIOSITY" value={`${data.curiosity_index}/100`} color={Theme.colors.secondary} icon="bulb" />
                <MetricItem label="RETENTION" value="HIGH" color={Theme.colors.accent} icon="ribbon" />
                <MetricItem label="SYSTEM RISK" value={data.at_risk ? "CRITICAL" : "STABLE"} color={data.at_risk ? Theme.colors.error : Theme.colors.success} icon="shield-checkmark" />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Smart Insights</Text>
                <View style={styles.aiTag}>
                    <Text style={styles.aiTagText}>PROMPT AI</Text>
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
                        <LinearGradient colors={['rgba(255,173,96,0.2)', 'rgba(255,95,95,0.2)']} style={styles.recIcon}>
                            <Ionicons name="sparkles" size={18} color={Theme.colors.accent} />
                        </LinearGradient>
                        <Text style={styles.recText}>{rec}</Text>
                        <Ionicons
                            name={expandedRec === i ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="rgba(255,255,255,0.3)"
                        />
                    </View>
                    {expandedRec === i && (
                        <View style={styles.recDetail}>
                            <Text style={styles.detailText}>
                                AI Logic: Your neural fatigue is lowest in the morning. Switching to intensive math modules now will increase long-term retention by 20%.
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>
            ))}

            <Card glass title="NEURAL LOAD MANAGEMENT" style={styles.progressCard}>
                <Text style={styles.progLabel}>Current focus optimization level</Text>
                <Progress.Bar
                    progress={data.focus_score / 100}
                    width={null}
                    height={10}
                    color={Theme.colors.primary}
                    unfilledColor="rgba(255,255,255,0.1)"
                    borderWidth={0}
                    borderRadius={5}
                    style={{ marginVertical: 15 }}
                />
                <Text style={styles.progSub}>Maintain focus above 85% to trigger "Elite Learner" status.</Text>
            </Card>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Theme.colors.background },
    loadingText: { marginTop: 12, color: Theme.colors.textSecondary, fontWeight: '700', fontSize: 12 },

    heroSection: { alignItems: 'center', padding: Theme.spacing.xl, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, ...Theme.shadows.lg },
    typeBadge: { width: 140, height: 140, borderRadius: 70, justifyContent: 'center', alignItems: 'center', marginBottom: Theme.spacing.lg, ...Theme.shadows.md, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
    typeText: { color: '#fff', fontWeight: '900', fontSize: 10, marginTop: 10, letterSpacing: 1 },
    heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center' },
    heroSub: { fontSize: 12, color: Theme.colors.textSecondary, marginTop: 4, textAlign: 'center', fontWeight: '600' },

    metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: Theme.spacing.md, gap: Theme.spacing.md },
    metricCard: { flex: 1, minWidth: '45%', backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: Theme.spacing.md, borderRadius: Theme.roundness.xl, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
    metricIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    metricLabel: { fontSize: 9, fontWeight: '800', color: Theme.colors.textSecondary, letterSpacing: 1 },
    metricValue: { fontSize: 18, fontWeight: '900' },

    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Theme.spacing.lg, marginTop: Theme.spacing.xl, marginBottom: Theme.spacing.md },
    sectionTitle: { fontSize: 18, fontWeight: '900', color: '#fff' },
    aiTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6, backgroundColor: Theme.colors.primary + '20' },
    aiTagText: { fontSize: 9, fontWeight: '900', color: Theme.colors.primary, letterSpacing: 1 },

    recCard: { marginHorizontal: Theme.spacing.md, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: Theme.roundness.lg, marginBottom: Theme.spacing.sm, padding: Theme.spacing.lg, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
    recHeader: { flexDirection: 'row', alignItems: 'center', gap: Theme.spacing.md },
    recIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
    recText: { flex: 1, fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.9)' },
    recDetail: { marginTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', paddingTop: 15 },
    detailText: { fontSize: 13, color: Theme.colors.textSecondary, lineHeight: 20, fontStyle: 'italic' },

    progressCard: { marginHorizontal: Theme.spacing.md, marginTop: Theme.spacing.lg },
    progLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
    progSub: { fontSize: 11, color: Theme.colors.textSecondary, fontWeight: '500' }
});
