// components/TaskCard.tsx
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import type { Task } from "../constants/types";

export default function TaskCard({
  task,
  index = 0,
  onToggleComplete,
  onDelete,
  accentColor = "#cbd5e1",
}: {
  task: Task;
  index?: number;
  onToggleComplete: () => void;
  onDelete?: () => void;
  accentColor?: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 380, delay: index * 40, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
        },
      ]}
    >
      <View style={[styles.accent, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.title, task.completed && styles.completed]} numberOfLines={2}>
            {task.title}
          </Text>

          {task.priority === "URGENT" && <View style={styles.urgent} />}
        </View>

        <View style={styles.metaRow}>
          <View style={styles.catPill}>
            <Text style={styles.catText}>{task.category}</Text>
          </View>

          <View style={styles.timeRow}>
            <Feather name="clock" size={12} color="#94a3b8" />
            <Text style={styles.timeText}>
              {new Date(task.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        </View>

        {!task.completed && (
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <TouchableOpacity onPress={onToggleComplete} style={styles.completeBtn}>
              <Feather name="check" size={14} color="#fff" />
            </TouchableOpacity>
            {onDelete && (
              <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                <Feather name="x" size={14} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    marginVertical: 6,
  },
  accent: { width: 6, borderTopRightRadius: 6, borderBottomRightRadius: 6, height: "90%", marginLeft: 6 },
  content: { flex: 1, paddingHorizontal: 12, paddingRight: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  title: { fontSize: 16, fontWeight: "700", color: "#0b1730", flex: 1 },
  completed: { textDecorationLine: "line-through", color: "#94a3b8" },
  urgent: { width: 10, height: 10, borderRadius: 6, backgroundColor: "#ef4444", marginLeft: 10 },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 10 },
  catPill: { backgroundColor: "#f1f5f9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 11, fontWeight: "700", color: "#475569" },
  timeRow: { flexDirection: "row", alignItems: "center", marginLeft: 8 },
  timeText: { marginLeft: 6, color: "#64748b" },
  completeBtn: {
    width: 44,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    marginTop: 0,
  },
  deleteBtn: {
    width: 44,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },
});
