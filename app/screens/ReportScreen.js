import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import Card from '../../components/Card';
import { CustomLineChart } from '../../components/Chart';

export default function ReportScreen() {
    const { user } = useContext(AuthContext);
    const [weekly, setWeekly] = useState(null);
    const [monthly, setMonthly] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            if (user && user.id) {
                const resWeekly = await API.get(`/weekly-report/${user.id}`);
                setWeekly(resWeekly.data);
                const resMonthly = await API.get(`/monthly-report/${user.id}`);
                setMonthly(resMonthly.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!weekly || !monthly) return <Text style={styles.loading}>Loading Reports...</Text>;

    return (
        <ScrollView style={styles.container}>
            <Card title="Weekly Improvement Analytics">
                <Text style={styles.percent}>+{weekly.improvement_percentage}% Improvement</Text>
                <Text style={styles.trendText}>Accuracy Trend (Last 5 days):</Text>
                <CustomLineChart
                    data={{
                        labels: ['M', 'T', 'W', 'Th', 'F'],
                        datasets: [{ data: weekly.accuracy_trend || [0, 0, 0, 0, 0] }]
                    }}
                />
                <Text style={styles.reduction}>
                    {weekly.mistake_reduction ? '✅ Mistake Reduction Noticed' : '⚠️ More mistakes than last week'}
                </Text>
            </Card>

            <Card title="Monthly Progress Graph">
                <Text style={styles.percent}>+{monthly.improvement_percentage}% Improvement</Text>
                <CustomLineChart
                    data={{
                        labels: ['W1', 'W2', 'W3', 'W4'],
                        datasets: [{ data: monthly.accuracy_trend || [0, 0, 0, 0] }]
                    }}
                />
                <Text style={styles.reduction}>
                    {monthly.mistake_reduction ? '✅ Consistent Monthly Reduction' : '⚠️ Need more practice'}
                </Text>
            </Card>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    loading: { flex: 1, textAlign: 'center', marginTop: 50 },
    percent: { fontSize: 20, fontWeight: 'bold', color: 'green', marginBottom: 10 },
    trendText: { fontSize: 16, marginBottom: 5 },
    reduction: { fontSize: 16, fontWeight: '500', marginTop: 10, color: '#333' }
});
