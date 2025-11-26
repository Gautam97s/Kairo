// app/(tabs)/calendar.tsx
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DayTimeline from "../../components/DayTimeline";
import { useTasks } from "../../context/TaskContext";

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const viewabilityConfig = {
  itemVisiblePercentThreshold: 10,
};

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const flatListRef = useRef<FlatList>(null);

  // Generate a large range of dates (e.g., -30 to +365 days)
  const dates = useMemo(() => {
    const dts = [];
    const current = new Date();
    const start = new Date(current);
    start.setDate(current.getDate() - 30); // Start 30 days ago

    for (let i = 0; i < 400; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dts.push(d);
    }
    return dts;
  }, []);

  // Find index of today to scroll to initially
  const todayIndex = dates.findIndex((d) => isSameDay(d, new Date()));

  useEffect(() => {
    // Scroll to today on mount
    if (flatListRef.current && todayIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
        });
      }, 100);
    }
  }, []);

  // Sync header when scrolling
  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / 1800);

    if (index >= 0 && index < dates.length) {
      const date = dates[index];
      if (!isSameDay(date, selectedDate)) {
        setSelectedDate(date);
      }
    }
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    const index = dates.findIndex((d) => isSameDay(d, date));
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
    }
  };

  // Generate week days for the header based on selectedDate
  const getWeekDays = (baseDate: Date) => {
    const days = [];
    const start = new Date(baseDate);
    // Center the selected date roughly
    start.setDate(baseDate.getDate() - 3);

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const headerDays = getWeekDays(selectedDate);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        <View style={styles.button}>
          <Feather name="more-horizontal" size={18} />
        </View>
      </View>

      {/* Day Selector Header */}
      <View style={styles.days}>
        {headerDays.map((date, i) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());
          const dayName = date.toLocaleDateString("en-US", {
            weekday: "narrow",
          });
          const dayNum = date.getDate();

          return (
            <TouchableOpacity
              key={i}
              style={[styles.day, isSelected && styles.dayActive]}
              onPress={() => handleDayPress(date)}
            >
              <Text
                style={[
                  styles.dayLabel,
                  isSelected && styles.dayLabelActive,
                  isToday && !isSelected && { color: "#3b82f6" },
                ]}
              >
                {dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelected && styles.dayNumberActive,
                  isToday && !isSelected && { color: "#3b82f6" },
                ]}
              >
                {dayNum}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Infinite Scroll List */}
      <FlatList
        ref={flatListRef}
        data={dates}
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => <DayTimeline date={item} tasks={tasks} />}
        onScroll={handleScroll}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: 1800, // Approx height of DayTimeline (24 hours * 70px + padding)
          offset: 1800 * index,
          index,
        })}
        initialScrollIndex={todayIndex}
        showsVerticalScrollIndicator={false}
        windowSize={5}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        removeClippedSubviews={true}
        scrollEventThrottle={16}
        decelerationRate="fast"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: { fontSize: 24, fontWeight: "700", color: "#0b1730" },

  button: {
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 14,
  },

  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  day: {
    alignItems: "center",
    padding: 8,
    borderRadius: 14,
    minWidth: 40,
  },
  dayActive: {
    backgroundColor: "#000",
  },
  dayLabel: { fontSize: 10, color: "#94a3b8", fontWeight: "700" },
  dayLabelActive: { color: "#fff" },
  dayNumber: { fontSize: 16, fontWeight: "600", color: "#475569" },
  dayNumberActive: { color: "#fff" },
});
