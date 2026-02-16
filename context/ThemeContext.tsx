import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colors: {
        background: string;
        text: string;
        card: string;
        border: string;
        primary: string;
        secondary: string;
        accent: string;
    };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const lightColors = {
    background: '#ffffff',
    text: '#0f172a',
    card: '#f8fafc',
    border: '#e2e8f0',
    primary: '#0f172a',
    secondary: '#64748b',
    accent: '#3b82f6',
};

export const darkColors = {
    background: '#0f172a',
    text: '#f8fafc',
    card: '#1e293b',
    border: '#334155',
    primary: '#f8fafc',
    secondary: '#94a3b8',
    accent: '#60a5fa',
};

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await SecureStore.getItemAsync('user_theme');
            if (savedTheme === 'dark' || savedTheme === 'light') {
                setTheme(savedTheme);
            }
        } catch (e) {
            console.log('Failed to load theme', e);
        }
    };

    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        await SecureStore.setItemAsync('user_theme', newTheme);
    };

    const colors = theme === 'light' ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a AppThemeProvider');
    }
    return context;
}
