// app/modal.tsx

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function AssistantModal() {
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);

  const router = useRouter();
  const inputRef = useRef<TextInput>(null);

  const lastMessage =
    useLocalSearchParams().lastMessage?.toString() || undefined;

  const onSend = async (text: string) => {
    if (!text.trim()) return;

    setThinking(true);

    setTimeout(() => {
      setThinking(false);
      router.back();
    }, 1000);
  };

  return (
    <BlurView intensity={40} tint="dark" style={styles.overlay}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => router.back()} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.panel}
      >
        {/* Handle Bar */}
        <View style={styles.handle} />

        <ScrollView style={{ maxHeight: 200 }}>
          {lastMessage ? (
            <View style={styles.aiBubble}>
              <Text style={styles.aiText}>{lastMessage}</Text>
            </View>
          ) : (
            <>
              <Text style={styles.heading}>How can KAIRO help?</Text>

              <View style={styles.suggestionRow}>
                {["Reschedule meetings", "Plan gym time", "Add deep work"].map(
                  (s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.suggestion}
                      onPress={() => onSend(s)}
                    >
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputWrap}>
          <TextInput
            ref={inputRef}
            placeholder="Ask KAIRO..."
            placeholderTextColor="#b0b4ba"
            style={styles.input}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => {
              if (input.trim()) {
                onSend(input);
                setInput("");
              }
            }}
          />

          <TouchableOpacity
            disabled={thinking || !input.trim()}
            style={[
              styles.sendBtn,
              (thinking || !input.trim()) && { opacity: 0.5 },
            ]}
            onPress={() => {
              onSend(input);
              setInput("");
            }}
          >
            {thinking ? (
              <View style={styles.loader} />
            ) : (
              <Feather name="arrow-right" size={18} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  panel: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    maxHeight: "80%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#cbd5e1",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  aiBubble: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  aiText: {
    fontSize: 14,
    color: "#0b1730",
    lineHeight: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0b1730",
    marginBottom: 12,
  },
  suggestionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  suggestion: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  suggestionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  inputWrap: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0b1730",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sendBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#0b1730",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loader: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#fff",
    borderTopColor: "transparent",
  },
});
