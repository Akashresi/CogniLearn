import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import * as Progress from 'react-native-progress'; // Ensure you install react-native-progress if using actual progress bars

export default function CognitiveScreen() {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchCognitiveResults();
    }, []);

    const fetchCognitiveResults = async () => {
        try {
            if (user && user.id) {
                const res = await API.get(`/cognitive/${user.id}`);
                setData(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!data) return <Text style={styles.loading}>Analyzing cognitive data...</Text>;

    return (
        <ScrollView style={styles.container}>
            <Card title="Cognitive AI Analysis">
                <Text style={styles.label}>Learning Style:</Text>
                <Text style={styles.value}>{data.learning_type}</Text>

                <Text style={styles.label}>Focus Score:</Text>
                {/* <Progress.Bar progress={data.focus_score / 100} width={200} /> */}
                <Text style={styles.value}>{data.focus_score}/100</Text>

                <Text style={styles.label}>Curiosity Index:</Text>
                <Text style={styles.value}>{data.curiosity_index}/100</Text>
            </Card>

            <Card title="Personalized AI Recommendations">
                {data.recommendations?.map((rec, i) => (
                    <Text key={i} style={styles.rec}>💡 {rec}</Text>
                ))}
            </Card>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    loading: { flex: 1, textAlign: 'center', marginTop: 50 },
    label: { fontSize: 16, color: '#666', marginTop: 10 },
    value: { fontSize: 22, fontWeight: 'bold', color: '#1a73e8', marginBottom: 10 },
    rec: { fontSize: 16, marginTop: 8, padding: 8, backgroundColor: '#eef', borderRadius: 4 }
});
