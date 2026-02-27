import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';

export default function LearningScreen() {
    const { user, role } = useContext(AuthContext);
    const [startTime, setStartTime] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [mistakes, setMistakes] = useState(0);

    useEffect(() => {
        setStartTime(Date.now());
    }, []);

    const submitAnswer = async (isCorrect) => {
        if (!isCorrect) {
            setMistakes((prev) => prev + 1);
            setRetryCount((prev) => prev + 1);
            alert("Incorrect, try again! Remember to read the question carefully.");
            return;
        }

        // correct answer behavior logging
        const responseTime = (Date.now() - startTime) / 1000;

        try {
            await API.post('/behavior-log', {
                user_id: user.id,
                action: 'quiz_completed',
                response_time: responseTime,
                retry_count: retryCount,
                mistakes: mistakes,
                lesson_id: 'lesson_1_math',
                focus_score: 100 - (mistakes * 5) - (retryCount * 2), // Simple dummy calculate
                study_duration: responseTime // Using responseTime as proxy for duration for now
            });
            alert('Great job! Answer correct and behavior logged.');

            // Reset for next question
            setStartTime(Date.now());
            setRetryCount(0);
            setMistakes(0);
        } catch (err) {
            console.error(err);
            alert('Error submitting log');
        }
    };

    if (role === 'parent') {
        return (
            <View style={styles.center}>
                <Text>Parents view only. You can see your child's progress in reports.</Text>
            </View>
        );
    }

    if (role === 'teacher') {
        return (
            <View style={styles.center}>
                <Text>Teacher Panel UI. Assign tasks here.</Text>
                <Button title="Assign Math Quiz" onPress={() => alert('Assigned!')} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Card title="Module 1: Basic Math">
                <Text style={styles.question}>What is 15 * 6?</Text>
                <View style={styles.btnRow}>
                    <Button title="80" onPress={() => submitAnswer(false)} />
                    <Button title="90" onPress={() => submitAnswer(true)} />
                    <Button title="105" onPress={() => submitAnswer(false)} />
                </View>
            </Card>
            <Card title="Module 2: Logic">
                <Text style={styles.question}>If a train is traveling at 60 mph, how far will it go in 2 hours?</Text>
                <View style={styles.btnRow}>
                    <Button title="90 miles" onPress={() => submitAnswer(false)} />
                    <Button title="120 miles" onPress={() => submitAnswer(true)} />
                </View>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    question: { fontSize: 18, marginBottom: 16 },
    btnRow: { gap: 10 }
});
