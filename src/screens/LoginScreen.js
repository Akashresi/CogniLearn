import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const { login, register, demoLogin, isLoading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [isLogin, setIsLogin] = useState(true);

    const handleSubmit = async () => {
        if (!email || !password) {
            alert('Please fill all fields');
            return;
        }
        if (isLogin) {
            await login(email, password);
        } else {
            await register(email, password, role);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.headerContainer}>
                    <View style={styles.logoCircle}>
                        <Ionicons name="school" size={40} color={Theme.colors.surface} />
                    </View>
                    <Text style={styles.title}>CogniLearn</Text>
                    <Text style={styles.subtitle}>Empowering Your Cognitive Journey</Text>
                </View>

                <View style={styles.formCard}>
                    <View style={styles.tabContainer}>
                        <TouchableOpacity
                            style={[styles.tab, isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(true)}
                        >
                            <Text style={[styles.tabText, isLogin && styles.activeTabText]}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, !isLogin && styles.activeTab]}
                            onPress={() => setIsLogin(false)}
                        >
                            <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>Register</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Email Address</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="mail-outline" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Password</Text>
                        <View style={styles.inputWrapper}>
                            <Ionicons name="lock-closed-outline" size={20} color={Theme.colors.textSecondary} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter password"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>

                    {!isLogin && (
                        <View style={styles.roleContainer}>
                            <Text style={styles.inputLabel}>Choose Your Role</Text>
                            <View style={styles.roleButtons}>
                                {['student', 'parent', 'teacher'].map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        style={[
                                            styles.roleBtn,
                                            role === r && { backgroundColor: Theme.colors[r], borderColor: Theme.colors[r] }
                                        ]}
                                        onPress={() => setRole(r)}
                                    >
                                        <Text style={[styles.roleBtnText, role === r && styles.roleBtnTextActive]}>
                                            {r.charAt(0).toUpperCase() + r.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.mainButton, { backgroundColor: Theme.colors.primary }]}
                        onPress={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.mainButtonText}>{isLogin ? 'Sign In' : 'Create Account'}</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>OR QUICK ACCESS</Text>
                    <View style={styles.dividerLine} />
                </View>

                <View style={styles.demoContainer}>
                    {['student', 'parent', 'teacher'].map((r) => (
                        <TouchableOpacity
                            key={`demo-${r}`}
                            style={[styles.demoBtn, { borderColor: Theme.colors[r] }]}
                            onPress={() => demoLogin(r)}
                        >
                            <Ionicons name="rocket-outline" size={18} color={Theme.colors[r]} style={{ marginRight: 6 }} />
                            <Text style={[styles.demoBtnText, { color: Theme.colors[r] }]}>{r.charAt(0).toUpperCase() + r.slice(1)} Demo</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Theme.spacing.lg,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: Theme.spacing.xl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.md,
        ...Theme.shadows.md,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: Theme.colors.text,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: Theme.colors.textSecondary,
        marginTop: 4,
    },
    formCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.roundness.xl,
        padding: Theme.spacing.lg,
        ...Theme.shadows.md,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: Theme.roundness.md,
        padding: 4,
        marginBottom: Theme.spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: Theme.roundness.sm,
    },
    activeTab: {
        backgroundColor: Theme.colors.surface,
        ...Theme.shadows.sm,
    },
    tabText: {
        fontWeight: '600',
        color: Theme.colors.textSecondary,
    },
    activeTabText: {
        color: Theme.colors.primary,
    },
    inputGroup: {
        marginBottom: Theme.spacing.md,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Theme.colors.text,
        marginBottom: 6,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Theme.colors.border,
        borderRadius: Theme.roundness.md,
        paddingHorizontal: Theme.spacing.md,
        backgroundColor: '#F9FAFB',
    },
    inputIcon: {
        marginRight: Theme.spacing.sm,
    },
    input: {
        flex: 1,
        height: 48,
        color: Theme.colors.text,
        fontSize: 16,
    },
    roleContainer: {
        marginBottom: Theme.spacing.lg,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: Theme.colors.border,
        borderRadius: Theme.roundness.md,
        marginHorizontal: 4,
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
    },
    roleBtnText: {
        color: Theme.colors.textSecondary,
        fontSize: 13,
        fontWeight: '700',
    },
    roleBtnTextActive: {
        color: '#fff',
    },
    mainButton: {
        height: 54,
        borderRadius: Theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Theme.spacing.md,
        ...Theme.shadows.sm,
    },
    mainButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Theme.spacing.xl,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Theme.colors.border,
    },
    dividerText: {
        marginHorizontal: Theme.spacing.md,
        color: Theme.colors.textSecondary,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
    },
    demoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
    },
    demoBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Theme.colors.surface,
        borderWidth: 1.5,
        borderRadius: Theme.roundness.full,
        paddingVertical: 8,
        paddingHorizontal: 16,
        ...Theme.shadows.sm,
    },
    demoBtnText: {
        fontWeight: '700',
        fontSize: 14,
    }
});
