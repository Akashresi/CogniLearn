import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');
            const storedRole = await AsyncStorage.getItem('role');

            if (storedToken && storedUser) {
                API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
                setUser(JSON.parse(storedUser));
                setRole(storedRole);
            }
        } catch (error) {
            console.log('Error loading data', error);
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await API.post('/login', { email, password });
            const { access_token, role: userRole, id } = response.data;

            const userData = { id, email };

            await AsyncStorage.setItem('token', access_token);
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('role', userRole);

            API.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
            setUser(userData);
            setRole(userRole);
            setIsLoading(false);
            return true;
        } catch (error) {
            setIsLoading(false);
            console.error('Login error', error);
            return false;
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('role');

            API.defaults.headers.common['Authorization'] = '';
            setUser(null);
            setRole(null);
        } catch (error) {
            console.log(`Logout Error ${error}`);
        }
        setIsLoading(false);
    };

    const register = async (email, password, role) => {
        setIsLoading(true);
        try {
            await API.post('/register', { email, password, role });
            // auto login after register
            return await login(email, password);
        } catch (error) {
            setIsLoading(false);
            if (error.response && error.response.data) {
                alert(error.response.data.detail || "Registration failed");
            } else {
                alert("Registration failed");
            }
            return false;
        }
    };

    const demoLogin = async (userRole) => {
        setIsLoading(true);
        const mockToken = "demo-token-123";
        const userData = { id: "demo-id", email: `demo@${userRole}.com` };

        await AsyncStorage.setItem('token', mockToken);
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        await AsyncStorage.setItem('role', userRole);

        API.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
        setUser(userData);
        setRole(userRole);
        setIsLoading(false);
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, role, isLoading, login, logout, register, demoLogin }}>
            {children}
        </AuthContext.Provider>
    );
};
