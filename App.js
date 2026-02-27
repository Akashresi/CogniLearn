import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
    console.log("App Booting: Initializing Auth and Navigation...");

    return (
        <AuthProvider>
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <AppNavigator />
            </View>
        </AuthProvider>
    );
}
