// app/(tabs)/tasks.tsx
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TaskCard from "../../components/TaskCard";
import { INITIAL_TASKS } from "../../constants/mockTasks";
import { Task } from "../../constants/types";

export default function TasksScreen() {
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [filter, setFilter] = useState("All");

    const categories = [
        "All",
        "Today",
        "Scheduled",
        "High Priority",
        "Completed",
        "Work",
        "Personal",
        "Gym",
        "Study",
        "Meeting",
        "Errands",
        "Projects",
    ];

    const filtered = tasks.filter((task) => {
        if (filter === "All") return true;
        if (filter === "Completed") return task.completed;
        if (filter === "High Priority")
            return task.priority === "URGENT" || task.priority === "HIGH";
        if (filter === "Today")
            return (
                new Date(task.startTime).getDate() === new Date().getDate()
            );
        if (
            ["Work", "Personal", "Gym", "Study", "Meeting", "Errands", "Projects"].includes(filter)
        ) {
            return task.category === filter;
        }
        return true;
    });

    const toggleComplete = (id: string) => {
        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>Tasks</Text>
                        <Text style={styles.subtitle}>
                            Your tasks, organized intelligently
                        </Text>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity style={styles.headerIcon}>
                            <Feather name="search" size={18} color="#64748b" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.headerIcon}>
                            <Feather name="filter" size={18} color="#64748b" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* CATEGORY FILTERS — FIXED */}
                <View style={{ flexGrow: 0 }}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScroll}
                    >
                        {categories.map((cat) => {
                            const isActive = filter === cat;

                            return (
                                <TouchableOpacity
                                    key={cat}
                                    onPress={() => setFilter(cat)}
                                    style={[
                                        styles.filterBtn,
                                        isActive && styles.filterBtnActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.filterText,
                                            isActive && styles.filterTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* TASK LIST */}
                <ScrollView
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                >
                    <View>
                        {filtered.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                accentColor="#3b82f6"
                                onToggleComplete={() => toggleComplete(task.id)}
                            />
                        ))}
                    </View>
                </ScrollView>

                {/* FAB */}
                <TouchableOpacity style={styles.fab}>
                    <Feather name="plus" size={34} color="#0b1730" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },

    headerRow: {
        marginTop: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },

    title: {
        fontSize: 32,
        fontWeight: "700",
        color: "#0b1730",
    },

    subtitle: {
        marginTop: 4,
        color: "#64748b",
    },

    headerButtons: {
        flexDirection: "row",
        gap: 12,
    },

    headerIcon: {
        width: 44,
        height: 44,
        borderRadius: 50,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        justifyContent: "center",
        alignItems: "center",
    },

    filterScroll: {
        marginTop: 4,
        marginBottom: 12,
        paddingRight: 16,
        paddingBottom: 8,
    },

    filterBtn: {
        paddingVertical: 0,
        paddingHorizontal: 16,
        borderRadius: 22,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        marginRight: 8,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },

    filterBtnActive: {
        backgroundColor: "#0b1730",
        borderColor: "#0b1730",
    },

    filterText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#475569",

        // Prevent forcing the chip to stretch
        flexShrink: 1,
        textAlign: "center",
    },

    filterTextActive: {
        color: "#fff",
    },

    fab: {
        position: "absolute",
        bottom: 26,
        right: 20,
        width: 70,
        height: 70,
        borderRadius: 40,
        backgroundColor: "#e0c3fc",
        borderWidth: 2,
        borderColor: "#ffffff90",
        justifyContent: "center",
        alignItems: "center",
        elevation: 10,
    },
});
