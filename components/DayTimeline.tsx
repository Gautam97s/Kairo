import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "../constants/categoryColors";
import { Task } from "../constants/types";

interface DayTimelineProps {
    date: Date;
    tasks: Task[];
}

export default function DayTimeline({ date, tasks }: DayTimelineProps) {
    const isSameDay = (d1: Date, d2: Date) => {
        return (
            d1.getDate() === d2.getDate() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getFullYear() === d2.getFullYear()
        );
    };

    const todaysTasks = tasks.filter((t) =>
        isSameDay(new Date(t.startTime), date)
    );

    const getConflicts = (task: Task) => {
        return todaysTasks.filter(
            (t) =>
                t.id !== task.id &&
                !t.completed &&
                new Date(t.startTime) < new Date(task.endTime) &&
                new Date(t.endTime) > new Date(task.startTime)
        );
    };

    return (
        <View style={styles.container}>
            {/* Date Header for the Day */}
            <View style={styles.dateHeader}>
                <Text style={styles.dateTitle}>
                    {date.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                    })}
                </Text>
            </View>

            <View style={styles.timelineContainer}>
                <View style={styles.timeline} />

                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23].map(
                    (hour) => (
                        <View key={hour} style={styles.hourRow}>
                            <Text style={styles.hourLabel}>
                                {hour.toString().padStart(2, "0")}:00
                            </Text>
                            <View style={{ flex: 1 }}>
                                {todaysTasks
                                    .filter(
                                        (t) =>
                                            new Date(t.startTime).getHours() === hour && !t.completed
                                    )
                                    .map((task) => {
                                        const conflicts = getConflicts(task);
                                        const conflict = conflicts.length > 0;
                                        const start = new Date(task.startTime);
                                        const end = new Date(task.endTime);
                                        const duration =
                                            (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
                                        const height = duration * 70; // 70px per hour

                                        return (
                                            <View
                                                key={task.id}
                                                style={[
                                                    styles.taskBox,
                                                    conflict && styles.conflictBox,
                                                    {
                                                        top: (start.getMinutes() / 60) * 70,
                                                        height: height,
                                                        backgroundColor: getCategoryColor(
                                                            task.category as any,
                                                            "light"
                                                        ),
                                                    },
                                                ]}
                                            >
                                                <View style={styles.taskHeader}>
                                                    <Text style={styles.taskTitle} numberOfLines={1}>
                                                        {task.title}
                                                    </Text>
                                                    {conflict && (
                                                        <Feather
                                                            name="alert-triangle"
                                                            size={12}
                                                            color="#ef4444"
                                                        />
                                                    )}
                                                </View>

                                                <Text style={styles.taskTime}>
                                                    {start.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                    {" - "}
                                                    {end.toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </Text>
                                            </View>
                                        );
                                    })}
                            </View>
                        </View>
                    )
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 1800,
        paddingBottom: 40,
    },
    dateHeader: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        backgroundColor: "#f8fafc",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
    },
    dateTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: "#0f172a",
    },
    timelineContainer: {
        paddingTop: 16,
        paddingHorizontal: 20,
    },
    timeline: {
        position: "absolute",
        left: 70,
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: "#e2e8f0",
    },
    hourRow: { flexDirection: "row", minHeight: 70 },
    hourLabel: {
        width: 50,
        textAlign: "right",
        marginRight: 10,
        color: "#94a3b8",
        fontSize: 11,
        marginTop: -6, // Align with line
    },
    taskBox: {
        position: "absolute",
        left: 0,
        right: 10,
        padding: 8,
        borderRadius: 12,
        overflow: "hidden",
    },
    conflictBox: {
        borderWidth: 1,
        borderColor: "#ef4444",
        right: 20, // Stagger slightly
        zIndex: 10,
    },
    taskHeader: { flexDirection: "row", justifyContent: "space-between" },
    taskTitle: { fontSize: 12, fontWeight: "700", color: "#0b1730", flex: 1 },
    taskTime: { marginTop: 4, fontSize: 10, color: "#475569" },
});
