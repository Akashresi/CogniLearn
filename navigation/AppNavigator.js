import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../src/screens/LoginScreen';
import DashboardScreen from '../src/screens/DashboardScreen';
import LearningScreen from '../src/screens/LearningScreen';
import CognitiveScreen from '../src/screens/CognitiveScreen';
import ReportScreen from '../src/screens/ReportScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    const { user, isLoading } = useContext(AuthContext);
    console.log("AppNavigator render - user:", !!user, "isLoading:", isLoading);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {user ? (
                    <>
                        <Stack.Screen name="Dashboard" component={DashboardScreen} />
                        <Stack.Screen name="Learning" component={LearningScreen} />
                        <Stack.Screen name="Cognitive" component={CognitiveScreen} />
                        <Stack.Screen name="Report" component={ReportScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
