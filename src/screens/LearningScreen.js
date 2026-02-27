import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient';

export default function LearningScreen() {
    const { user, role } = useContext(AuthContext);
    const [startTime, setStartTime] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [timer, setTimer] = useState(0);

    const questions = [
        { id: 1, title: 'QUANTUM ARITHMETIC', text: 'Determine the product: 15 * 6', options: ['80', '90', '105'], correct: 1 },
        { id: 2, title: 'SPATIAL LOGIC', text: 'If a particle velocity is 60 units, distance at T=2 is?', options: ['90 units', '120 units', '150 units'], correct: 1 },
        { id: 3, title: 'ASTROPHYSICS', text: 'Approximate speed of light C in vacuum?', options: ['300k km/s', '150k km/s', '500k km/s'], correct: 0 },
    ];

    useEffect(() => {
        setStartTime(Date.now());
        setTimer(0);
        const interval = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [activeQuestion]);

    const submitAnswer = async (index) => {
        const isCorrect = index === questions[activeQuestion].correct;

        if (!isCorrect) {
            setMistakes((prev) => prev + 1);
            setRetryCount((prev) => prev + 1);
            return;
        }

        const responseTime = (Date.now() - startTime) / 1000;

        try {
            await API.post('/behavior-log', {
                user_id: user.id,
                action: 'quiz_completed',
                response_time: responseTime,
                retry_count: retryCount,
                mistakes: mistakes,
                lesson_id: questions[activeQuestion].id.toString(),
                focus_score: Math.max(0, 100 - (mistakes * 5) - (retryCount * 2)),
                study_duration: responseTime
            });

            if (activeQuestion < questions.length - 1) {
                setActiveQuestion(prev => prev + 1);
                setRetryCount(0);
                setMistakes(0);
                setTimer(0);
            } else {
                alert('COGNITIVE SYNC COMPLETE: All neural modules verified.');
                setActiveQuestion(0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (role === 'parent') {
        return (
            <View style={styles.center}>
                <Ionicons name="lock-closed" size={60} color="rgba(255,255,255,0.1)" />
                <Text style={styles.roleText}>RESTRICTED ACCESS</Text>
                <Text style={styles.roleSub}>Parent clearance required for active learning. Access neural logs in Progress tab.</Text>
            </View>
        );
    }

    if (role === 'teacher') {
        return (
            <View style={styles.teacherPane}>
                <View style={styles.teacherHeader}>
                    <Text style={styles.teacherTitle}>COMMAND CENTER</Text>
                    <Text style={styles.teacherSub}>Initiate and monitor neural learning sequences</Text>
                </View>
                <Card glass title="NEURAL ASSIGNMENTS">
                    <TouchableOpacity style={styles.assignBtn}>
                        <LinearGradient colors={Theme.colors.primaryGradient} style={styles.assignGradient}>
                            <Ionicons name="add-circle" size={24} color="#fff" />
                            <Text style={styles.assignText}>DEPLOY NEW MATH MODULE</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.assignBtn, { marginTop: 15 }]}>
                        <LinearGradient colors={Theme.colors.secondaryGradient} style={styles.assignGradient}>
                            <Ionicons name="analytics" size={24} color="#fff" />
                            <Text style={styles.assignText}>INITIATE LOGIC SYNC</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }

    const currentQ = questions[activeQuestion];
    const progress = (activeQuestion + 1) / questions.length;

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.learningHeader}>
                <View style={styles.progressHeader}>
                    <Text style={styles.moduleTitle}>ENABLING NEURAL SYNC</Text>
                    <Text style={styles.qCount}>INDEX {activeQuestion + 1} OF {questions.length}</Text>
                </View>
                <Progress.Bar
                    progress={progress}
                    width={null}
                    height={6}
                    color={Theme.colors.primary}
                    unfilledColor="rgba(255,255,255,0.05)"
                    borderWidth={0}
                    borderRadius={3}
                />
            </View>

            <Card glass style={styles.questionCard}>
                <View style={styles.cardInfo}>
                    <LinearGradient colors={Theme.colors.primaryGradient} style={styles.tag}>
                        <Text style={styles.tagText}>{currentQ.title}</Text>
                    </LinearGradient>
                    <View style={styles.timerBox}>
                        <Ionicons name="pulse" size={16} color={Theme.colors.error} />
                        <Text style={[styles.timerText, { color: Theme.colors.error }]}>{timer}S SYNCING</Text>
                    </View>
                </View>

                <Text style={styles.questionText}>{currentQ.text}</Text>

                <View style={styles.optionsGrid}>
                    {currentQ.options.map((option, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.optionBtn}
                            onPress={() => submitAnswer(idx)}
                            activeOpacity={0.7}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                                style={styles.optionGradient}
                            >
                                <Text style={styles.optionText}>{option}</Text>
                                <Ionicons name="flash-outline" size={18} color="rgba(255,255,255,0.3)" />
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>
            </Card>

            <View style={styles.aiTipContainer}>
                <LinearGradient
                    colors={['rgba(99,102,241,0.1)', 'rgba(168,85,247,0.1)']}
                    style={styles.aiTip}
                >
                    <Ionicons name="sparkles" size={24} color={Theme.colors.primary} />
                    <Text style={styles.aiTipText}>
                        <Text style={{ fontWeight: '900', color: Theme.colors.primary }}>AI NEURAL TIP: </Text>
                        Focus on spatial reasoning to decrease response time by 12%.
                    </Text>
                </LinearGradient>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl, backgroundColor: Theme.colors.background },
    roleText: { fontSize: 24, fontWeight: '900', color: '#fff', marginTop: 20 },
    roleSub: { fontSize: 13, color: Theme.colors.textSecondary, textAlign: 'center', marginTop: 10, lineHeight: 20 },

    teacherPane: { flex: 1, padding: Theme.spacing.lg },
    teacherHeader: { marginBottom: 30 },
    teacherTitle: { fontSize: 28, fontWeight: '900', color: '#fff' },
    teacherSub: { fontSize: 13, color: Theme.colors.textSecondary, fontWeight: '600' },
    assignBtn: { borderRadius: Theme.roundness.lg, overflow: 'hidden' },
    assignGradient: { height: 60, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    assignText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 1 },

    learningHeader: { padding: Theme.spacing.lg, marginBottom: 10 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 },
    moduleTitle: { fontSize: 10, fontWeight: '900', color: Theme.colors.primary, letterSpacing: 2 },
    qCount: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },

    questionCard: { marginHorizontal: Theme.spacing.md, paddingVertical: 30, paddingHorizontal: 20 },
    cardInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    tag: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 6 },
    tagText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1.5 },
    timerBox: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(239, 68, 68, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    timerText: { fontSize: 9, fontWeight: '900', letterSpacing: 1 },
    questionText: { fontSize: 24, fontWeight: '900', color: '#fff', lineHeight: 34, textAlign: 'center', marginBottom: 40 },

    optionsGrid: { gap: 12 },
    optionBtn: { borderRadius: Theme.roundness.lg, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
    optionGradient: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    optionText: { fontSize: 17, fontWeight: '800', color: '#fff' },

    aiTipContainer: { paddingHorizontal: Theme.spacing.md, marginTop: 20 },
    aiTip: { flexDirection: 'row', padding: 18, borderRadius: Theme.roundness.xl, gap: 15, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(99,102,241,0.2)' },
    aiTipText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 19, fontWeight: '500' }
});
