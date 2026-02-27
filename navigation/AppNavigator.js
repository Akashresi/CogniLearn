import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../src/theme/Theme';

import LoginScreen from '../src/screens/LoginScreen';
import DashboardScreen from '../src/screens/DashboardScreen';
import LearningScreen from '../src/screens/LearningScreen';
import CognitiveScreen from '../src/screens/CognitiveScreen';
import ReportScreen from '../src/screens/ReportScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Study') iconName = focused ? 'book' : 'book-outline';
                    else if (route.name === 'AI Insights') iconName = focused ? 'analytics' : 'analytics-outline';
                    else if (route.name === 'Progress') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: Theme.colors.primary,
                tabBarInactiveTintColor: 'gray',
                headerStyle: { backgroundColor: Theme.colors.surface },
                headerTitleStyle: { fontWeight: 'bold', color: Theme.colors.text },
                tabBarStyle: { height: 60, paddingBottom: 10 },
            })}
        >
            <Tab.Screen name="Home" component={DashboardScreen} />
            <Tab.Screen name="Study" component={LearningScreen} />
            <Tab.Screen name="AI Insights" component={CognitiveScreen} />
            <Tab.Screen name="Progress" component={ReportScreen} />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={Theme.colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    <Stack.Screen name="Main" component={MainTabs} />
                ) : (
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
