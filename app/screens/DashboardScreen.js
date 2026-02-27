import React, { useContext, useEffect, useState } from 'react';
import { ScrollView, View, Text, StyleSheet, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import Card from '../../components/Card';
import { CustomLineChart } from '../../components/Chart';

export default function DashboardScreen({ navigation }) {
    const { user, role, logout } = useContext(AuthContext);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            if (user && user.id) {
                const res = await API.get(`/dashboard/${user.id}`);
                setData(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (!data) return <Text style={styles.loading}>Loading Dashboard...</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Welcome, {role}</Text>

            {role === 'student' && (
                <View>
                    <Card title="Your Summary">
                        <Text style={styles.info}>Study Time: {data.study_time} mins</Text>
                        <Text style={styles.info}>Focus Score: {data.focus_score}%</Text>
                    </Card>
                    <Card title="Learning Progress">
                        <CustomLineChart
                            data={{
                                labels: ['M', 'T', 'W', 'th', 'F'],
                                datasets: [{ data: data.learning_progress || [0, 0, 0, 0, 0] }]
                            }}
                        />
                    </Card>
                    <View style={styles.btnRow}>
                        <Button title="Start Learning" onPress={() => navigation.navigate('Learning')} />
                        <Button title="Cognitive AI" onPress={() => navigation.navigate('Cognitive')} />
                        <Button title="Reports" onPress={() => navigation.navigate('Report')} />
                    </View>
                </View>
            )}

            {role === 'parent' && (
                <View>
                    <Card title="Child Performance">
                        <Text style={styles.info}>Summary: {data.child_performance}</Text>
                        <Text style={styles.desc}>{data.weekly_overview}</Text>
                    </Card>
                    {data.alerts && data.alerts.map((alert, i) => (
                        <Card key={i} title="Alert"><Text>{alert}</Text></Card>
                    ))}
                    <Button title="View Detailed Reports" onPress={() => navigation.navigate('Report')} />
                </View>
            )}

            {role === 'teacher' && (
                <View>
                    <Card title="Class Overview">
                        <Text style={styles.info}>{data.class_overview}</Text>
                    </Card>
                    <Card title="At-Risk Students">
                        {data.at_risk_students?.map((stu, i) => (
                            <Text key={i} style={styles.desc}>• {stu}</Text>
                        ))}
                    </Card>
                </View>
            )}

            <View style={styles.logoutBtn}>
                <Button title="Logout" color="red" onPress={logout} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f0f5' },
    header: { fontSize: 24, fontWeight: 'bold', margin: 16, textAlign: 'center' },
    loading: { flex: 1, textAlign: 'center', marginTop: 50 },
    info: { fontSize: 18, marginBottom: 8 },
    desc: { fontSize: 16, color: '#555', marginBottom: 4 },
    btnRow: { margin: 16, gap: 10 },
    logoutBtn: { margin: 16, marginTop: 40 }
});
