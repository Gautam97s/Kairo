import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function KairoLogo({
  size = "large",
}: {
  size?: "small" | "large";
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
      <Text style={[styles.text, isSmall ? styles.textSmall : styles.textLarge]}>
        <Text style={styles.boldK}>K</Text>
        <Text style={styles.fadeAIRO}>AIRO</Text>
      </Text>

      <Animated.View
        style={[
          styles.dot,
          isSmall ? styles.dotSmall : styles.dotLarge,
          { transform: [{ scale: dotScale }] },
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
    color: "#0b1730",
  },

  textSmall: {
    fontSize: 16,
  },

  textLarge: {
    fontSize: 26,
  },

  boldK: {
    fontWeight: "600",
    color: "#000",
  },

  fadeAIRO: {
    opacity: 0.8,
  },

  dot: {
    marginLeft: 6,
    backgroundColor: "#000",
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
