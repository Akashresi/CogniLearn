import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Theme } from '../src/theme/Theme';

const Card = ({ title, children, style }) => {
    return (
        <View style={[styles.card, Theme.shadows.md, style]}>
            {title && <Text style={styles.title}>{title}</Text>}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Theme.colors.surface,
        borderRadius: Theme.roundness.lg,
        padding: Theme.spacing.md,
        marginVertical: Theme.spacing.sm,
        marginHorizontal: Theme.spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: Theme.spacing.sm,
        color: Theme.colors.text,
        letterSpacing: -0.5,
    },
    content: {
        // Additional content spacing if needed
    }
});

export default Card;
