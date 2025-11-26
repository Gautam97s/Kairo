import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Category, Priority, Task } from "../constants/types";

interface AddTaskModalProps {
    visible: boolean;
    onClose: () => void;
    onAddTask: (task: Partial<Task>) => void;
}

export default function AddTaskModal({
    visible,
    onClose,
    onAddTask,
}: AddTaskModalProps) {
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [category, setCategory] = useState<Category>(Category.WORK);
    const [priority, setPriority] = useState<Priority>(Priority.NORMAL);

    const handleAdd = () => {
        if (!title.trim()) return;

        let startTime = new Date();
        const timeStr = time.trim();
        if (timeStr) {
            // Regex to match HH:MM optionally followed by AM/PM (case insensitive)
            const timeRegex = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i;
            const match = timeStr.match(timeRegex);

            if (match) {
                let hours = parseInt(match[1], 10);
                const minutes = parseInt(match[2], 10);
                const modifier = match[3]?.toUpperCase();

                if (modifier === "PM" && hours < 12) {
                    hours += 12;
                }
                if (modifier === "AM" && hours === 12) {
                    hours = 0;
                }

                if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                    startTime.setHours(hours, minutes, 0, 0);
                }
            }
        }

        onAddTask({
            title,
            category,
            priority,
            startTime: startTime.toISOString(),
            endTime: new Date(startTime.getTime() + 3600000).toISOString(), // +1 hour
            completed: false,
        });

        // Reset
        setTitle("");
        setTime("");
        setCategory(Category.WORK);
        setPriority(Priority.NORMAL);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.modalCard}>
                        <View style={styles.header}>
                            <Text style={styles.modalTitle}>New Task</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Feather name="x" size={20} color="#64748b" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.form}>
                            {/* Title Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>What needs to be done?</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Review Q3 Reports"
                                    placeholderTextColor="#94a3b8"
                                    value={title}
                                    onChangeText={setTitle}
                                    autoFocus
                                />
                            </View>

                            {/* Time Input */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Time (HH:MM)</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. 14:30 or 2:30 PM"
                                    placeholderTextColor="#94a3b8"
                                    value={time}
                                    onChangeText={setTime}
                                    keyboardType="numbers-and-punctuation"
                                />
                            </View>

                            {/* Category Selector */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Category</Text>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.chipContainer}
                                >
                                    {Object.values(Category).map((cat) => (
                                        <TouchableOpacity
                                            key={cat}
                                            style={[
                                                styles.chip,
                                                category === cat && styles.chipActive,
                                            ]}
                                            onPress={() => setCategory(cat)}
                                        >
                                            <Text
                                                style={[
                                                    styles.chipText,
                                                    category === cat && styles.chipTextActive,
                                                ]}
                                            >
                                                {cat}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Priority Selector */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Priority</Text>
                                <View style={styles.priorityRow}>
                                    {[Priority.LOW, Priority.NORMAL, Priority.HIGH, Priority.URGENT].map(
                                        (p) => (
                                            <TouchableOpacity
                                                key={p}
                                                style={[
                                                    styles.priorityChip,
                                                    priority === p && styles.priorityChipActive,
                                                    priority === p && {
                                                        backgroundColor: getPriorityColor(p),
                                                        borderColor: getPriorityColor(p),
                                                    },
                                                ]}
                                                onPress={() => setPriority(p)}
                                            >
                                                <Text
                                                    style={[
                                                        styles.priorityText,
                                                        priority === p && styles.priorityTextActive,
                                                    ]}
                                                >
                                                    {p}
                                                </Text>
                                            </TouchableOpacity>
                                        )
                                    )}
                                </View>
                            </View>

                            {/* Add Button */}
                            <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                                <Text style={styles.addBtnText}>Create Task</Text>
                                <Feather name="arrow-right" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </BlurView>
        </Modal>
    );
}

function getPriorityColor(p: Priority) {
    switch (p) {
        case Priority.URGENT:
            return "#ef4444";
        case Priority.HIGH:
            return "#f97316";
        case Priority.NORMAL:
            return "#3b82f6";
        case Priority.LOW:
            return "#10b981";
        default:
            return "#64748b";
    }
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    keyboardView: {
        width: "100%",
        alignItems: "center",
    },
    modalCard: {
        width: "90%",
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0f172a",
    },
    closeBtn: {
        padding: 4,
        backgroundColor: "#f1f5f9",
        borderRadius: 20,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    input: {
        fontSize: 16,
        color: "#0f172a",
        borderBottomWidth: 1,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 8,
    },
    chipContainer: {
        gap: 8,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#f1f5f9",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    chipActive: {
        backgroundColor: "#0f172a",
        borderColor: "#0f172a",
    },
    chipText: {
        fontSize: 13,
        color: "#64748b",
        fontWeight: "500",
    },
    chipTextActive: {
        color: "#fff",
    },
    priorityRow: {
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
    },
    priorityChip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    priorityChipActive: {
        // Color handled inline
    },
    priorityText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#64748b",
    },
    priorityTextActive: {
        color: "#fff",
    },
    addBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0f172a",
        paddingVertical: 16,
        borderRadius: 16,
        marginTop: 8,
        gap: 8,
    },
    addBtnText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#fff",
    },
});
