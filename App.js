import React, { useEffect, useContext, useState } from 'react';
import { View, StyleSheet, Text, StatusBar, ActivityIndicator, LogBox } from 'react-native';
import { AuthProvider, AuthContext } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

LogBox.ignoreAllLogs();

export default function App() {
    return (
        <AuthProvider>
            <NeuralInterface />
        </AuthProvider>
    );
}

function NeuralInterface() {
    const auth = useContext(AuthContext);
    const [bootError, setBootError] = useState(null);

    useEffect(() => {
        console.log("NEURAL BOOT: Sequence initiated.");
        console.log("AUTH STATE:", auth ? "INITIALIZED" : "NULL");
        if (auth) {
            console.log("LOADING STATUS:", auth.isLoading);
        }
    }, [auth]);

    if (!auth) {
        return (
            <View style={styles.center}>
                <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>CRITICAL: AUTH CONTEXT MISSING</Text>
            </View>
        );
    }

    if (auth.isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={styles.loadingText}>Syncing Neural Pathways...</Text>
            </View>
        );
    }

    try {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
                <AppNavigator />
            </View>
        );
    } catch (e) {
        console.error("APP NAVIGATOR CRASH:", e);
        return (
            <View style={styles.center}>
                <Text style={{ color: '#EF4444' }}>System Navigation Failure</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
        padding: 20
    },
    loadingText: {
        color: '#94A3B8',
        marginTop: 15,
        fontWeight: '900',
        letterSpacing: 1,
        fontSize: 10
    }
});
