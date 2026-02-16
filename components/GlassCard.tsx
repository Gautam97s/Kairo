// components/GlassCard.tsx
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

interface GlassCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "light" | "dark" | "accent" | "peach" | "purple" | "mint" | "blue";
  style?: StyleProp<ViewStyle>;
}

export default function GlassCard({
  children,
  onPress,
  variant = "light",
  style,
}: GlassCardProps) {
  const variantStyle = getVariantStyle(variant);

  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper
      onPress={onPress}
      style={[styles.base, variantStyle, style, onPress && styles.pressable]}
      activeOpacity={0.9}
    >
      <BlurView intensity={30} tint="light" style={StyleSheet.absoluteFillObject} />
      <LinearGradient
        colors={
          variant === "dark"
            ? ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
            : ["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]
        }
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.inner}>{children}</View>
    </Wrapper>
  );
}

function getVariantStyle(variant: string) {
  switch (variant) {
    case "dark":
      return {
        backgroundColor: "rgba(0,0,0,0.9)",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        borderRadius: 32,
      };

    case "peach":
      return {
        backgroundColor: "#ffccaa",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderRadius: 32,
        shadowColor: "#ff8866",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      };

    case "purple":
      return {
        backgroundColor: "#e0c3fc",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderRadius: 32,
        shadowColor: "#c084fc",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      };

    case "mint":
      return {
        backgroundColor: "#a7f3d0",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderRadius: 32,
        shadowColor: "#6ee7b7",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      };

    case "blue":
      return {
        backgroundColor: "#bfdbfe",
        borderColor: "rgba(255,255,255,0.2)",
        borderWidth: 1,
        borderRadius: 32,
        shadowColor: "#3b82f6",
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      };

    case "accent":
      return {
        backgroundColor: "rgba(80,120,255,0.2)",
        borderColor: "rgba(80,120,255,0.3)",
        borderWidth: 1,
        borderRadius: 32,
      };

    case "light":
    default:
      return {
        backgroundColor: "rgba(255,255,255,0.8)",
        borderColor: "rgba(255,255,255,0.4)",
        borderWidth: 1,
        borderRadius: 32,
      };
  }
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
  pressable: {
    transform: [{ scale: 1 }],
  },
  inner: {
    padding: 16,
    flex: 1,
  },
});
