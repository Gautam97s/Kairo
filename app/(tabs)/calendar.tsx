// app/(tabs)/calendar.tsx
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { getCategoryColor } from "../../constants/categoryColors";
import { INITIAL_TASKS } from "../../constants/mockTasks";
import { Task } from "../../constants/types";

import { SafeAreaView } from "react-native-safe-area-context";

export default function CalendarScreen() {
  const tasks = INITIAL_TASKS;

  const getConflicts = (task: Task) => {
    return tasks.filter(
      (t) =>
        t.id !== task.id &&
        !t.completed &&
        new Date(t.startTime) < new Date(task.endTime) &&
        new Date(t.endTime) > new Date(task.startTime)
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <View style={styles.button}>
          <Feather name="more-horizontal" size={18} />
        </View>
      </View>

      {/* Day Selector */}
      <View style={styles.days}>
        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
          <View
            key={i}
            style={[
              styles.day,
              i === 2 && styles.dayActive, // Wednesday
            ]}
          >
            <Text style={[styles.dayLabel, i === 2 && styles.dayLabelActive]}>
              {day}
            </Text>
            <Text style={[styles.dayNumber, i === 2 && styles.dayNumberActive]}>
              {12 + i}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.timeline} />

        {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((hour) => (
          <View key={hour} style={styles.hourRow}>
            <Text style={styles.hourLabel}>{hour}:00</Text>
            <View style={{ flex: 1 }}>
              {tasks
                .filter(
                  (t) =>
                    new Date(t.startTime).getHours() === hour && !t.completed
                )
                .map((task, index) => {
                  const conflicts = getConflicts(task);
                  const conflict = conflicts.length > 0;

                  return (
                    <View
                      key={task.id}
                      style={[
                        styles.taskBox,
                        conflict && styles.conflictBox,
                        {
                          top:
                            (new Date(task.startTime).getMinutes() / 60) * 60,
                          backgroundColor: getCategoryColor(task.category as any, "light"),
                        },
                      ]}
                    >
                      <View style={styles.taskHeader}>
                        <Text style={styles.taskTitle}>{task.title}</Text>
                        {conflict && (
                          <Feather name="alert-triangle" size={12} color="#ef4444" />
                        )}
                      </View>

                      <Text style={styles.taskTime}>
                        {new Date(task.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" - "}
                        {new Date(task.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    </View>
                  );
                })}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------------------------------------

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#0b1730" },

  button: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 14,
  },

  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  day: {
    alignItems: "center",
    padding: 8,
  },
  dayActive: {
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 14,
  },
  dayLabel: { fontSize: 10, color: "#94a3b8", fontWeight: "700" },
  dayLabelActive: { color: "#fff" },
  dayNumber: { fontSize: 16, fontWeight: "600", color: "#475569" },
  dayNumberActive: { color: "#fff" },

  timeline: {
    position: "absolute",
    left: 70,
    top: 120,
    bottom: 100,
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
  },

  taskBox: {
    position: "absolute",
    left: 0,
    right: 50,
    padding: 10,
    borderRadius: 14,
  },
  conflictBox: {
    borderWidth: 1,
    borderColor: "#ef4444",
  },

  taskHeader: { flexDirection: "row", justifyContent: "space-between" },
  taskTitle: { fontSize: 12, fontWeight: "700", color: "#0b1730", flex: 1 },
  taskTime: { marginTop: 6, fontSize: 10, color: "#475569" },
});
