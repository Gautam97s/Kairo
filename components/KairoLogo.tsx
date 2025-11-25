// components/KairoLogo.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function KairoLogo({ size = "small" }: { size?: "small" | "regular" }) {
  return (
    <View style={styles.wrap}>
      <Text style={[styles.text, size === "regular" && styles.textLarge]}>KAIRO</Text>
      <View style={styles.dot} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontWeight: "700",
    letterSpacing: 1.6,
    fontSize: 14,
    color: "#0b1730",
  },
  textLarge: {
    fontSize: 18,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: "#0b1730",
    marginLeft: 8,
  },
});
