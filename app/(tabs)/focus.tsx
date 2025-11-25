// app/(tabs)/focus.tsx
import { Pause, Play, RotateCcw, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { INITIAL_TASKS } from "../../constants/mockTasks";

import { SafeAreaView } from "react-native-safe-area-context";

export default function FocusScreen() {
  const currentTask = INITIAL_TASKS.find((t) => !t.completed) || INITIAL_TASKS[0];
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"FOCUS" | "BREAK">("FOCUS");

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === "FOCUS" ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    const newMode = mode === "FOCUS" ? "BREAK" : "FOCUS";
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(newMode === "FOCUS" ? 25 * 60 : 5 * 60);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Label */}
      <View style={styles.labelSection}>
        <Text style={styles.title}>Focus Session</Text>
        <Text style={styles.subtitle}>
          {mode === "FOCUS" ? "Flow State" : "Recharge Time"}
        </Text>
      </View>

      {/* Timer Circle */}
      <View style={[styles.timerCircle, isActive && styles.timerActive]}>
        <Text style={styles.timeText}>{formatTime(timeLeft)}</Text>
      </View>

      {/* Task Pill */}
      {currentTask ? (
        <View style={styles.taskPill}>
          <View style={styles.taskPillIcon}>
            <Zap size={22} color="#f97316" fill="#f97316" />
          </View>
          <View style={styles.taskPillContent}>
            <Text style={styles.taskPillLabel}>Current Objective</Text>
            <Text style={styles.taskPillTitle}>{currentTask.title}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.noTaskPill}>
          <Text style={styles.noTaskText}>No active task selected</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.smallBtn} onPress={resetTimer}>
          <RotateCcw size={20} color="#64748b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, isActive && styles.pauseBtn]}
          onPress={toggleTimer}
        >
          {isActive ? (
            <Pause size={32} color="#fff" fill="#fff" />
          ) : (
            <Play size={32} color="#fff" fill="#fff" style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.smallBtn} onPress={switchMode}>
          <Zap size={20} color="#64748b" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  labelSection: {
    alignItems: "center",
    marginBottom: 40,
    position: "absolute",
    top: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0b1730",
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 6,
  },
  timerCircle: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 12,
    borderColor: "#e0c3fc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
    marginTop: 120,
  },
  timerActive: {
    borderColor: "#fb923c",
  },
  timeText: {
    fontSize: 56,
    fontWeight: "700",
    color: "#0b1730",
    fontFamily: "monospace",
  },
  taskPill: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#fff7ed",
    borderWidth: 1,
    borderColor: "#fed7aa",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    gap: 12,
    marginBottom: 50,
  },
  taskPillIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#ffedd5",
    justifyContent: "center",
    alignItems: "center",
  },
  taskPillContent: {
    flex: 1,
  },
  taskPillLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ea580c",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  taskPillTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0b1730",
  },
  noTaskPill: {
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  noTaskText: {
    fontSize: 14,
    color: "#64748b",
  },
  controls: {
    flexDirection: "row",
    gap: 32,
    alignItems: "center",
  },
  smallBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
  },
  playBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fb923c",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#fb923c",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  pauseBtn: {
    backgroundColor: "#0b1730",
    shadowColor: "#0b1730",
  },
});
