// components/SideMenu.tsx
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import KairoLogo from "./KairoLogo";
import type { ViewState } from "../constants/types";

const PANEL_W = Math.min(320, Dimensions.get("window").width * 0.85);

export default function SideMenu({
  isOpen,
  onClose,
  setView,
  userName,
}: {
  isOpen: boolean;
  onClose: () => void;
  setView: (v: ViewState) => void;
  userName: string;
}) {
  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={styles.panel}>
        <View style={{ padding: 18 }}>
          <KairoLogo size="regular" />
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{`${userName.toLowerCase().replace(/\s/g, "")}@kairo.app`}</Text>
        </View>

        <View style={styles.items}>
          {[
            { label: "Dashboard", v: "HOME" as ViewState },
            { label: "Calendar", v: "CALENDAR" as ViewState },
            { label: "Tasks", v: "TASKS" as ViewState },
            { label: "Focus Mode", v: "FOCUS" as ViewState },
            { label: "Settings", v: "HOME" as ViewState },
          ].map((it) => (
            <TouchableOpacity
              key={it.label}
              style={styles.item}
              onPress={() => {
                setView(it.v);
                onClose();
              }}
            >
              <Text style={styles.itemText}>{it.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: PANEL_W,
    backgroundColor: "#fff",
    paddingTop: 44,
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    elevation: 8,
  },
  name: { marginTop: 12, fontSize: 18, fontWeight: "700", color: "#0b1730" },
  email: { marginTop: 6, color: "#7b8798" },
  items: { marginTop: 18 },
  item: { paddingVertical: 14, paddingHorizontal: 18 },
  itemText: { fontSize: 16 },
});
