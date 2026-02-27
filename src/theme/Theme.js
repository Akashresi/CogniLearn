export const Theme = {
    colors: {
        primary: '#4F46E5', // Indigo
        secondary: '#10B981', // Emerald
        accent: '#F59E0B', // Amber
        background: '#F9FAFB', // Cool gray
        surface: '#FFFFFF',
        text: '#111827',
        textSecondary: '#4B5563',
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#10B981',
        student: '#4F46E5',
        parent: '#8B5CF6',
        teacher: '#EC4899',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    roundness: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 20,
        full: 9999,
    },
    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 4,
        },
    }
};
