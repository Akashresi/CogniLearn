import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';

export default function LoginScreen() {
    const { login, register, demoLogin, isLoading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleLogin = async () => {
        const success = await login(email, password);
        if (!success) {
            alert("Login failed! Please check credentials.");
        }
    };

    const handleSignup = async () => {
        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }
        await register(email, password, role);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>CogniLearn</Text>

            <View style={styles.card}>
                <Text style={styles.subtitle}>Sign In / Register</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <View style={styles.roleContainer}>
                    <Text style={styles.pickerLabel}>Select Role for Signup:</Text>
                    <View style={styles.roleButtons}>
                        {['student', 'parent', 'teacher'].map((r) => (
                            <TouchableOpacity
                                key={r}
                                style={[styles.roleBtn, role === r && styles.roleBtnActive]}
                                onPress={() => setRole(r)}
                            >
                                <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <View style={styles.authButtons}>
                        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                            <Text style={styles.btnText}>Log In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                            <Text style={styles.signupBtnText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.demoCard}>
                <Text style={styles.demoTitle}>Quick Demo Logins (For Devs)</Text>
                <View style={styles.demoRow}>
                    <Button title="Student" color="#3b5998" onPress={() => demoLogin('student')} />
                    <Button title="Parent" color="#ff7b25" onPress={() => demoLogin('parent')} />
                    <Button title="Teacher" color="#800080" onPress={() => demoLogin('teacher')} />
                </View>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#e9ecef',
        minHeight: '100%',
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#2c3e50',
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#34495e',
    },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 20,
    },
    input: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        marginBottom: 16,
        backgroundColor: '#fafafa',
    },
    roleContainer: {
        marginBottom: 20,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: 'center',
        backgroundColor: '#fafafa',
    },
    roleBtnActive: {
        backgroundColor: '#007bff',
        borderColor: '#007bff',
    },
    roleBtnText: {
        color: '#555',
        fontSize: 12,
        fontWeight: '500',
    },
    roleBtnTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    authButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    loginBtn: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    signupBtn: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#007bff',
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    signupBtnText: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    demoCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    demoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#7f8c8d'
    },
    demoRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    }
});
