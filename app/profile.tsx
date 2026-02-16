import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const { colors } = useTheme();
    const { tasks } = useTasks();

    // Initialize with existing metadata name or default
    const [name, setName] = useState(user?.user_metadata?.full_name || 'Gautam');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        if (!name.trim()) {
            Alert.alert('Error', 'Name cannot be empty');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: name }
            });

            if (error) throw error;

            Alert.alert('Success', 'Profile updated successfully!');
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Stack.Screen options={{
                title: 'Profile',
                headerStyle: { backgroundColor: colors.background },
                headerTintColor: colors.text,
            }}
            />

            <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <Text style={[styles.avatarText, { color: colors.text }]}>
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </Text>
                </View>
                <Text style={[styles.email, { color: colors.secondary }]}>{user?.email}</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: colors.text }]}>Display Name</Text>
                    <TextInput
                        style={[styles.input, {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.text
                        }]}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <ActivityHeatmap tasks={tasks} />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    <Text style={[styles.buttonText, { color: colors.background }]}>
                        {loading ? 'Saving...' : 'Update Profile'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.signOutButton]}
                    onPress={signOut}
                >
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 16,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    button: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    signOutButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    signOutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
});
