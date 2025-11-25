// components/NavBar.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import type { ViewState } from "../constants/types";

export default function NavBar({
  currentView,
  setView,
  onMicPress,
}: {
  currentView: ViewState;
  setView: (v: ViewState) => void;
  onMicPress: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <TouchableOpacity style={styles.btn} onPress={() => setView("HOME")}>
        <Ionicons name="home-outline" size={20} color={currentView === "HOME" ? "#0b1730" : "#94a3b8"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => setView("TASKS")}>
        <Feather name="check-square" size={18} color={currentView === "TASKS" ? "#0b1730" : "#94a3b8"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.fab} onPress={onMicPress} activeOpacity={0.9}>
        <View style={styles.fabInner}>
          <MaterialCommunityIcons name="star-four-points" size={20} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => setView("CALENDAR")}>
        <Feather name="calendar" size={18} color={currentView === "CALENDAR" ? "#0b1730" : "#94a3b8"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={() => setView("FOCUS")}>
        <Ionicons name="time-outline" size={20} color={currentView === "FOCUS" ? "#0b1730" : "#94a3b8"} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 18,
    left: 12,
    right: 12,
    height: 74,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 50,
  },
  btn: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    marginBottom: 8,
  },
  fabInner: {
    width: 64,
    height: 64,
    borderRadius: 36,
    backgroundColor: "#0b1730",
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
});
