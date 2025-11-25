import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

export default function GlassCard({ children, style, gradientColors }: { children?: React.ReactNode; style?: ViewStyle | any; gradientColors?: string[] }) {
  return (
    <BlurView intensity={30} tint="light" style={[styles.card, style]}>
      {/* subtle gradient layer */}
      <LinearGradient
        colors={gradientColors ?? ["rgba(255,255,255,0.06)", "rgba(255,255,255,0.03)"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>{children}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  inner: {
    padding: 12,
  },
});
