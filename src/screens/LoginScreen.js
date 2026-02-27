import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { Theme } from '../theme/Theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

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
        <View style={styles.mainContainer}>
            <LinearGradient
                colors={['#0F172A', '#1E293B', '#0F172A']}
                style={styles.container}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.headerContainer}>
                            <LinearGradient
                                colors={Theme.colors.primaryGradient}
                                style={styles.logoCircle}
                            >
                                <Ionicons name="sparkles" size={44} color="#fff" />
                            </LinearGradient>
                            <Text style={styles.title}>CogniLearn</Text>
                            <Text style={styles.subtitle}>NEURAL LEARNING PLATFORM</Text>
                        </View>

                        <View style={styles.glassForm}>
                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[styles.tab, isLogin && styles.activeTab]}
                                    onPress={() => setIsLogin(true)}
                                >
                                    <Text style={[styles.tabText, isLogin && styles.activeTabText]}>SIGN IN</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tab, !isLogin && styles.activeTab]}
                                    onPress={() => setIsLogin(false)}
                                >
                                    <Text style={[styles.tabText, !isLogin && styles.activeTabText]}>ENLIST</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>NEURAL IDENTITY (EMAIL)</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="finger-print-outline" size={20} color="#6366F1" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter email"
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>ACCESS KEY (PASSWORD)</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="shield-checkmark-outline" size={20} color="#6366F1" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter password"
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry
                                        placeholderTextColor="rgba(255, 255, 255, 0.3)"
                                    />
                                </View>
                            </View>

                            {!isLogin && (
                                <View style={styles.roleContainer}>
                                    <Text style={styles.inputLabel}>SELECT YOUR DESIGNATION</Text>
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
                                                    {r.toUpperCase()}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={handleSubmit}
                                disabled={isLoading}
                                style={{ marginTop: 10 }}
                            >
                                <LinearGradient
                                    colors={Theme.colors.primaryGradient}
                                    style={styles.mainButton}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {isLoading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.mainButtonText}>{isLogin ? 'INITIATE SESSION' : 'ACTIVATE ACCOUNT'}</Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>QUICK OVERRIDE</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <View style={styles.demoContainer}>
                            {['student', 'parent', 'teacher'].map((r) => (
                                <TouchableOpacity
                                    key={`demo-${r}`}
                                    style={styles.demoBtn}
                                    onPress={() => demoLogin(r)}
                                >
                                    <LinearGradient
                                        colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.1)']}
                                        style={styles.demoGradient}
                                    >
                                        <Text style={[styles.demoBtnText, { color: '#fff' }]}>{r.toUpperCase()} CORE</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1 },
    container: { flex: 1 },
    scrollContent: {
        flexGrow: 1,
        padding: Theme.spacing.xl,
        justifyContent: 'center',
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Theme.spacing.lg,
        ...Theme.shadows.lg,
    },
    title: {
        fontSize: 34,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 12,
        color: Theme.colors.primary,
        marginTop: 4,
        fontWeight: '800',
        letterSpacing: 3,
    },
    glassForm: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: Theme.roundness.xl,
        padding: Theme.spacing.xl,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        ...Theme.shadows.md,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: Theme.roundness.lg,
        padding: 4,
        marginBottom: Theme.spacing.xl,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: Theme.roundness.md,
    },
    activeTab: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    tabText: {
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        letterSpacing: 1,
    },
    activeTabText: {
        color: '#fff',
    },
    inputGroup: {
        marginBottom: Theme.spacing.lg,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 8,
        letterSpacing: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: Theme.roundness.lg,
        paddingHorizontal: Theme.spacing.md,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    inputIcon: {
        marginRight: Theme.spacing.sm,
    },
    input: {
        flex: 1,
        height: 52,
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    roleContainer: {
        marginBottom: Theme.spacing.xl,
    },
    roleButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 8,
    },
    roleBtn: {
        flex: 1,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: Theme.roundness.md,
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    roleBtnText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 10,
        fontWeight: '900',
    },
    roleBtnTextActive: {
        color: '#fff',
    },
    mainButton: {
        height: 58,
        borderRadius: Theme.roundness.lg,
        justifyContent: 'center',
        alignItems: 'center',
        ...Theme.shadows.md,
    },
    mainButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 40,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dividerText: {
        marginHorizontal: Theme.spacing.md,
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    demoContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    demoBtn: {
        minWidth: 150,
        height: 44,
        borderRadius: Theme.roundness.full,
        overflow: 'hidden',
    },
    demoGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    demoBtnText: {
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 0.5,
    }
});
