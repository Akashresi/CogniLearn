export const Theme = {
    colors: {
        primary: '#6366F1', // Indigo
        primaryGradient: ['#6366F1', '#A855F7'], // Indigo to Purple
        secondary: '#10B981', // Emerald
        secondaryGradient: ['#10B981', '#3B82F6'], // Emerald to Blue
        accent: '#F59E0B',
        background: '#0F172A', // Deep slate for dark mode feel
        surface: '#1E293B',
        glass: 'rgba(255, 255, 255, 0.05)',
        glassBorder: 'rgba(255, 255, 255, 0.1)',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        border: 'rgba(255, 255, 255, 0.1)',
        error: '#EF4444',
        success: '#10B981',
        student: '#6366F1',
        parent: '#8B5CF6',
        teacher: '#EC4899',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    roundness: {
        sm: 4,
        md: 8,
        lg: 16,
        xl: 24,
        full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
        },
        lg: {
            shadowColor: '#6366F1',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 12,
        },
    },
    glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    }
};
