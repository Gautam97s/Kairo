import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

export default function KairoLogo({
  size = "large",
  color = "#0b1730", // Default dark color
}: {
  size?: "small" | "large";
  color?: string;
}) {
  const dotScale = useRef(new Animated.Value(1)).current;

  // Pulse animation for the dot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dotScale, {
          toValue: 0.6,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(dotScale, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const isSmall = size === "small";

  return (
    <View style={[styles.wrap, isSmall && styles.smallScale]}>
      <Text style={[styles.text, isSmall ? styles.textSmall : styles.textLarge, { color }]}>
        <Text style={[styles.boldK, { color }]}>K</Text>
        <Text style={[styles.fadeAIRO, { color }]}>AIRO</Text>
      </Text>

      <Animated.View
        style={[
          styles.dot,
          isSmall ? styles.dotSmall : styles.dotLarge,
          { transform: [{ scale: dotScale }], backgroundColor: color },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallScale: {
    transform: [{ scale: 0.75 }],
  },

  text: {
    fontFamily: "System",
    letterSpacing: 3,
    fontWeight: "300",
  },

  textSmall: {
    fontSize: 16,
  },

  textLarge: {
    fontSize: 26,
  },

  boldK: {
    fontWeight: "600",
  },

  fadeAIRO: {
    opacity: 0.8,
  },

  dot: {
    marginLeft: 6,
    borderRadius: 50,
  },

  dotSmall: {
    width: 4,
    height: 4,
  },

  dotLarge: {
    width: 6,
    height: 6,
  },
});
