import { Stack } from 'expo-router';
import { Bell, CircleHelp as HelpCircle, Shield } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function SettingsScreen() {
    const { colors, theme, toggleTheme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: 'Settings',
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
            }}
            />

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Preferences</Text>

                <View style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View style={styles.rowLeft}>
                        <Bell size={20} color={colors.text} />
                        <Text style={[styles.rowText, { color: colors.text }]}>Notifications</Text>
                    </View>
                    <Switch
                        value={true}
                        trackColor={{ false: '#767577', true: colors.primary }}
                    />
                </View>


            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.secondary }]}>Support</Text>

                <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View style={styles.rowLeft}>
                        <Shield size={20} color={colors.text} />
                        <Text style={[styles.rowText, { color: colors.text }]}>Privacy Policy</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]}>
                    <View style={styles.rowLeft}>
                        <HelpCircle size={20} color={colors.text} />
                        <Text style={[styles.rowText, { color: colors.text }]}>Help Center</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={[styles.version, { color: colors.secondary }]}>Version 1.0.0</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    rowText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
    },
    version: {
        fontSize: 12,
    },
});
