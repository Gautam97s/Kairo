// app/(tabs)/index.tsx
import React from "react";
import { View, ScrollView, Text, StyleSheet } from "react-native";
import KairoLogo from "../../components/KairoLogo";
import GlassCard from "../../components/GlassCard";
import { INITIAL_TASKS } from "../../constants/mockTasks";
import { Task } from "../../constants/types";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  const tasks: Task[] = INITIAL_TASKS;

  const nextTask =
    tasks.find((t) => !t.completed && new Date(t.endTime) > new Date()) ||
    tasks[0];

  const upcoming = tasks.filter((t) => t.id !== nextTask?.id);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <KairoLogo />
        <View style={styles.menuIcon}>
          <Feather name="menu" size={22} color="#0b1730" />
        </View>
      </View>

      <Text style={styles.date}>Oct 15, 2025 • Today</Text>
      <Text style={styles.greeting}>
        Hello, <Text style={styles.bold}>Samuel</Text>
      </Text>

      {/* Black main container */}
      <View style={styles.blackBox}>
        <View style={styles.row}>
          {/* Focus Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardIcon}>
              <Feather name="zap" size={18} color="#0b1730" />
            </View>

            <Text style={styles.small}>Now Focus</Text>
            <Text style={styles.cardTitle}>{nextTask.title}</Text>

            <View style={styles.infoRow}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{nextTask.category}</Text>
              </View>

              <Text style={styles.time}>
                {new Date(nextTask.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>

              <View style={styles.pill}>
                <Text style={styles.pillText}>High</Text>
              </View>
            </View>
          </GlassCard>

          {/* Up Next Card */}
          <GlassCard style={styles.card}>
            <View style={styles.cardIcon}>
              <Feather name="clock" size={18} color="#0b1730" />
            </View>

            <Text style={styles.small}>Up Next</Text>
            <Text style={styles.cardTitle}>{upcoming[0]?.title}</Text>

            <Text style={styles.bigTime}>
              {new Date(upcoming[0]?.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </GlassCard>
        </View>

        {/* Later Today */}
        <Text style={styles.later}>Later Today</Text>

        {upcoming.slice(1).map((task) => (
          <View key={task.id} style={styles.laterRow}>
            <View style={styles.dot} />
            <View>
              <Text style={styles.laterTitle}>{task.title}</Text>
              <Text style={styles.laterTime}>
                {new Date(task.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 120 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuIcon: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 40,
  },
  date: { marginTop: 12, color: "#94a3b8" },
  greeting: { fontSize: 26, marginTop: 4, color: "#0b1730" },
  bold: { fontWeight: "700" },

  blackBox: {
    marginTop: 20,
    backgroundColor: "#000",
    borderRadius: 30,
    padding: 20,
  },

  row: { flexDirection: "row", gap: 10 },

  card: { flex: 1, height: 180, justifyContent: "space-between" },
  small: { fontSize: 10, color: "#94a3b8", marginTop: 8, textTransform: "uppercase" },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#0b1730" },
  bigTime: { fontSize: 28, fontWeight: "900", color: "#fff" },

  infoRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },

  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },

  pill: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillText: { fontSize: 11, fontWeight: "700", color: "#0b1730" },

  time: { color: "#fff", fontWeight: "700" },

  later: { color: "#fff", opacity: 0.5, marginTop: 20 },
  laterRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#94a3b8" },
  laterTitle: { color: "#fff", fontSize: 15, fontWeight: "600" },
  laterTime: { color: "#94a3b8" },
});
