// components/NavBar.tsx
import { BlurView } from "expo-blur";
import { Calendar, CheckSquare, Clock, Home, Sparkles } from "lucide-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ViewState } from "../constants/types";

interface NavBarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  onMicPress: () => void;
}

export default function NavBar({ currentView, setView, onMicPress }: NavBarProps) {
  const NavItem = ({ view, Icon }: { view: ViewState; Icon: any }) => (
    <TouchableOpacity
      onPress={() => setView(view)}
      style={[
        styles.navItem,
        currentView === view ? styles.navItemActive : styles.navItemInactive,
      ]}
      activeOpacity={0.8}
    >
      <Icon
        size={22}
        strokeWidth={currentView === view ? 2.5 : 2}
        color={currentView === view ? "#000" : "#9ca3af"}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.navBar}>
      <BlurView intensity={80} style={StyleSheet.absoluteFill} tint="light" />
      <View style={styles.navContent}>
        <NavItem view="HOME" Icon={Home} />
        <NavItem view="TASKS" Icon={CheckSquare} />

        {/* Center Floating Action Button */}
        <TouchableOpacity
          onPress={onMicPress}
          style={styles.fab}
          activeOpacity={0.9}
        >
          <Sparkles size={28} color="#fff" fill="#fff" />
        </TouchableOpacity>

        <NavItem view="CALENDAR" Icon={Calendar} />
        <NavItem view="FOCUS" Icon={Clock} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    zIndex: 50,
  },
  navContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  navItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  navItemActive: {
    backgroundColor: "rgba(0,0,0,0.08)",
    transform: [{ scale: 1.1 }],
  },
  navItemInactive: {},
  fab: {
    width: 74,
    height: 74,
    borderRadius: 40,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#fff",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
});
