import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme } from '../src/theme/Theme';

const Card = ({ title, children, style, glass = false }) => {
    return (
        <View style={[
            styles.card,
            glass ? styles.glassCard : styles.surfaceCard,
            Theme.shadows.md,
            style
        ]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: Theme.roundness.lg,
        padding: Theme.spacing.md,
        marginVertical: Theme.spacing.sm,
        marginHorizontal: Theme.spacing.md,
    },
    surfaceCard: {
        backgroundColor: Theme.colors.surface,
    },
    glassCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
    },
    title: {
        fontSize: 18,
        fontWeight: '800',
        marginBottom: Theme.spacing.sm,
        color: Theme.colors.text,
        letterSpacing: -0.5,
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    content: {
        // Additional content spacing if needed
    }
});

export default Card;
