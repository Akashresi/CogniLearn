import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';

export default function LearningScreen() {
    const { user, role } = useContext(AuthContext);
    const [startTime, setStartTime] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [mistakes, setMistakes] = useState(0);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [timer, setTimer] = useState(0);

    const questions = [
        { id: 1, title: 'Basic Math', text: 'What is 15 * 6?', options: ['80', '90', '105'], correct: 1 },
        { id: 2, title: 'Logic', text: 'If a train is traveling at 60 mph, how far will it go in 2 hours?', options: ['90 miles', '120 miles', '150 miles'], correct: 1 },
        { id: 3, title: 'Physics', text: 'What is the speed of light approx?', options: ['300k km/s', '150k km/s', '500k km/s'], correct: 0 },
    ];

    useEffect(() => {
        setStartTime(Date.now());
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
            // Non-blocking feedback
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
                alert('Congratulations! You finished all modules.');
                setActiveQuestion(0);
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (role === 'parent') {
        return (
            <View style={styles.center}>
                <Ionicons name="lock-closed" size={60} color={Theme.colors.border} />
                <Text style={styles.roleText}>Parent View Only</Text>
                <Text style={styles.roleSub}>Check the Progress tab for your child's data.</Text>
            </View>
        );
    }

    if (role === 'teacher') {
        return (
            <View style={styles.teacherPane}>
                <View style={styles.teacherHeader}>
                    <Text style={styles.teacherTitle}>Task Management</Text>
                    <Text style={styles.teacherSub}>Assign new cognitive tasks to your class</Text>
                </View>
                <Card title="Quick Actions">
                    <TouchableOpacity style={styles.assignBtn}>
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.assignText}>Create New Math Quiz</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.assignBtn, { backgroundColor: Theme.colors.secondary, marginTop: 10 }]}>
                        <Ionicons name="add-circle" size={24} color="#fff" />
                        <Text style={styles.assignText}>Create Logic Challenge</Text>
                    </TouchableOpacity>
                </Card>
            </View>
        );
    }

    const currentQ = questions[activeQuestion];
    const progress = (activeQuestion + 1) / questions.length;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.progressContainer}>
                <View style={styles.progressBarWrapper}>
                    <Progress.Bar
                        progress={progress}
                        width={null}
                        height={10}
                        color={Theme.colors.primary}
                        unfilledColor={Theme.colors.border}
                        borderWidth={0}
                        borderRadius={5}
                    />
                </View>
                <Text style={styles.progressText}>Question {activeQuestion + 1} of {questions.length}</Text>
            </View>

            <Card style={styles.questionCard}>
                <View style={styles.cardHeader}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{currentQ.title}</Text>
                    </View>
                    <View style={styles.timer}>
                        <Ionicons name="timer-outline" size={16} color={Theme.colors.textSecondary} />
                        <Text style={styles.timerText}>{timer}s</Text>
                    </View>
                </View>
                <Text style={styles.questionText}>{currentQ.text}</Text>

                <View style={styles.optionsContainer}>
                    {currentQ.options.map((option, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.optionBtn}
                            onPress={() => submitAnswer(idx)}
                        >
                            <Text style={styles.optionText}>{option}</Text>
                            <Ionicons name="chevron-forward" size={20} color={Theme.colors.border} />
                        </TouchableOpacity>
                    ))}
                </View>
            </Card>

            <View style={styles.helpBox}>
                <Ionicons name="bulb-outline" size={24} color={Theme.colors.accent} />
                <Text style={styles.helpText}>Tip: Analyze the question before jumping to options. Accuracy boosts your focus score!</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Theme.colors.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Theme.spacing.xl },
    roleText: { fontSize: 20, fontWeight: 'bold', color: Theme.colors.text, marginTop: Theme.spacing.md },
    roleSub: { fontSize: 14, color: Theme.colors.textSecondary, textAlign: 'center', marginTop: 8 },

    teacherPane: { flex: 1, padding: Theme.spacing.md },
    teacherHeader: { marginBottom: Theme.spacing.lg, paddingHorizontal: Theme.spacing.sm },
    teacherTitle: { fontSize: 24, fontWeight: '800', color: Theme.colors.text },
    teacherSub: { fontSize: 14, color: Theme.colors.textSecondary },
    assignBtn: { height: 50, borderRadius: Theme.roundness.md, backgroundColor: Theme.colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    assignText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

    progressContainer: { padding: Theme.spacing.md },
    progressBarWrapper: { marginBottom: 8 },
    progressText: { fontSize: 12, fontWeight: '700', color: Theme.colors.textSecondary, textAlign: 'right' },

    questionCard: { marginHorizontal: Theme.spacing.md, padding: Theme.spacing.lg },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Theme.spacing.md },
    tag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: Theme.roundness.full, backgroundColor: Theme.colors.primary + '15' },
    tagText: { fontSize: 10, fontWeight: 'bold', color: Theme.colors.primary, textTransform: 'uppercase' },
    timer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    timerText: { fontSize: 12, fontWeight: '600', color: Theme.colors.textSecondary },
    questionText: { fontSize: 20, fontWeight: '700', color: Theme.colors.text, lineHeight: 28, marginBottom: Theme.spacing.xl },

    optionsContainer: { gap: Theme.spacing.sm },
    optionBtn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Theme.spacing.md,
        borderWidth: 1.5,
        borderColor: Theme.colors.border,
        borderRadius: Theme.roundness.md,
        backgroundColor: Theme.colors.surface
    },
    optionText: { fontSize: 16, fontWeight: '600', color: Theme.colors.text },

    helpBox: { flexDirection: 'row', margin: Theme.spacing.md, padding: Theme.spacing.md, backgroundColor: Theme.colors.accent + '10', borderRadius: Theme.roundness.md, gap: Theme.spacing.md, alignItems: 'center' },
    helpText: { flex: 1, fontSize: 13, color: Theme.colors.textSecondary, fontStyle: 'italic' }
});
