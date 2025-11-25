// app/(tabs)/index.tsx
import { Clock, Menu, Zap } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassCard from "../../components/GlassCard";
import KairoLogo from "../../components/KairoLogo";
import { INITIAL_TASKS } from "../../constants/mockTasks";
import { Task } from "../../constants/types";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const tasks: Task[] = INITIAL_TASKS;
  const userName = "Samuel";

  const nextTask = useMemo(() => {
    return (
      tasks.find((t) => !t.completed && new Date(t.endTime) > new Date()) ||
      tasks[0]
    );
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((t) => t.id !== nextTask?.id && !t.completed);
  }, [tasks, nextTask]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            <KairoLogo />
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Date & Greeting */}
        <View style={styles.headerText}>
          <Text style={styles.dateLabel}>Oct 15, 2025 • Today</Text>
          <Text style={styles.greeting}>
            Hello, <Text style={styles.greetingName}>{userName}</Text>
          </Text>
        </View>

        {/* Main Black Container */}
        <View style={styles.blackContainer}>
          {/* Top Row - Focus & Upcoming Cards */}
          <View style={styles.topRow}>
            {/* Focus Card (Peach) */}
            <GlassCard style={styles.focusCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Zap size={16} color="#0b1730" strokeWidth={2.5} />
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Now Focus</Text>
                {nextTask ? (
                  <>
                    <Text style={styles.cardTitle}>{nextTask.title}</Text>
                    <View style={styles.cardTimeRow}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>
                          {nextTask.category}
                        </Text>
                      </View>
                      <Text style={styles.timeText}>
                        {formatTime(nextTask.startTime)}
                      </Text>
                      <View style={styles.priorityBadge}>
                        <Text style={styles.priorityBadgeText}>High</Text>
                      </View>
                    </View>
                  </>
                ) : (
                  <Text style={styles.noTaskText}>No focus tasks</Text>
                )}
              </View>
            </GlassCard>

            {/* Upcoming Card (Purple) */}
            <GlassCard style={styles.upcomingCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardIconContainer}>
                  <Clock size={16} color="#0b1730" strokeWidth={2.5} />
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Up Next</Text>
                {upcomingTasks[0] ? (
                  <>
                    <Text style={styles.cardTitleSmall}>
                      {upcomingTasks[0].title}
                    </Text>
                    <Text style={styles.largeTime}>
                      {formatTime(upcomingTasks[0].startTime)}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.noTaskText}>Clear Schedule</Text>
                )}
              </View>
            </GlassCard>
          </View>

          {/* Later Today Section */}
          {upcomingTasks.length > 1 && (
            <View style={styles.laterSection}>
              <Text style={styles.laterLabel}>Later Today</Text>
              {upcomingTasks.slice(1).map((task) => (
                <View key={task.id} style={styles.laterTaskItem}>
                  <View style={styles.laterTaskDot} />
                  <View style={styles.laterTaskContent}>
                    <Text style={styles.laterTaskTitle}>{task.title}</Text>
                    <Text style={styles.laterTaskTime}>
                      {formatTime(task.startTime)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    marginBottom: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "300",
    color: "#0b1730",
  },
  greetingName: {
    fontWeight: "600",
  },
  blackContainer: {
    backgroundColor: "#000",
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 16,
    gap: 20,
  },
  topRow: {
    flexDirection: "row",
    gap: 16,
  },
  focusCard: {
    flex: 1,
    height: 240,
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 182, 193, 0.15)",
  },
  upcomingCard: {
    flex: 1,
    height: 240,
    justifyContent: "space-between",
    backgroundColor: "rgba(200, 150, 255, 0.15)",
  },
  cardHeader: {
    alignItems: "flex-start",
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    gap: 8,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0b1730",
    lineHeight: 22,
    textAlign: "center",
  },
  cardTitleSmall: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginTop: 4,
  },
  cardTimeRow: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0b1730",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(0, 0, 0, 0.8)",
  },
  priorityBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#0b1730",
  },
  noTaskText: {
    fontSize: 14,
    color: "rgba(0, 0, 0, 0.5)",
  },
  largeTime: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
  },
  laterSection: {
    marginTop: 8,
    gap: 12,
  },
  laterLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.4)",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingLeft: 4,
    marginBottom: 4,
  },
  laterTaskItem: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
  },
  laterTaskDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    backgroundColor: "transparent",
  },
  laterTaskContent: {
    flex: 1,
  },
  laterTaskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  laterTaskTime: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 4,
  },
});
