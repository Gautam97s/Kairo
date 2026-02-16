
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
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

  const headerListRef = useRef<FlatList>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    // Scroll to today on mount
    if (flatListRef.current && todayIndex !== -1) {
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
        });
        headerListRef.current?.scrollToIndex({
          index: todayIndex,
          animated: false,
          viewPosition: 0.5,
        });
      }, 100);
    }
  }, []);

  // Sync header when scrolling
  const handleScroll = (event: any) => {
    // If we are scrolling programmatically, do not update selectedDate based on scroll position
    if (isProgrammaticScroll.current) return;

    const offsetY = event.nativeEvent.contentOffset.y;
    // Use Math.floor and add half screen height to find the item in the middle of the screen
    const screenHeight = Dimensions.get('window').height;
    const index = Math.floor((offsetY + screenHeight / 2) / 1800);

    if (index >= 0 && index < dates.length) {
      const date = dates[index];
      if (!isSameDay(date, selectedDate)) {
        setSelectedDate(date);
        headerListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  };

  const handleDayPress = (date: Date) => {
    isProgrammaticScroll.current = true;
    setSelectedDate(date);
    const index = dates.findIndex((d) => isSameDay(d, date));
    if (index !== -1) {
      flatListRef.current?.scrollToIndex({ index, animated: true });
      headerListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });

      // Reset the flag after a timeout to ensure animation completes
      // We also use onMomentumScrollEnd but a timeout is a good fallback
      setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 500);
    }
  };

  const renderHeaderItem = ({ item, index }: { item: Date; index: number }) => {
    const isSelected = isSameDay(item, selectedDate);
    const isToday = isSameDay(item, new Date());
    const dayName = item.toLocaleDateString("en-US", {
      weekday: "narrow",
    });
    const dayNum = item.getDate();

    return (
      <TouchableOpacity
        style={[styles.day, isSelected && styles.dayActive]}
        onPress={() => handleDayPress(item)}
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
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>

      </View>

      {/* Day Selector Header */}
      <View style={styles.daysContainer}>
        <FlatList
          ref={headerListRef}
          data={dates}
          keyExtractor={(item) => item.toISOString()}
          renderItem={renderHeaderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: 60, // Fixed width for day item including margin/padding
            offset: 60 * index,
            index,
          })}
          initialScrollIndex={todayIndex}
        />
      </View>

      {/* Infinite Scroll List */}
      <FlatList
        ref={flatListRef}
        data={dates}
        keyExtractor={(item) => item.toISOString()}
        renderItem={({ item }) => <DayTimeline date={item} tasks={tasks} />}
        onScroll={handleScroll}
        onMomentumScrollEnd={() => { isProgrammaticScroll.current = false; }}
        onScrollBeginDrag={() => { isProgrammaticScroll.current = false; }}
        onScrollAnimationEnd={() => { isProgrammaticScroll.current = false; }}
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



  daysContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 10,
  },
  day: {
    alignItems: "center",
    padding: 8,
    borderRadius: 14,
    width: 60, // Fixed width for calculation
    marginHorizontal: 0,
  },
  dayActive: {
    backgroundColor: "#000",
  },
  dayLabel: { fontSize: 10, color: "#94a3b8", fontWeight: "700" },
  dayLabelActive: { color: "#fff" },
  dayNumber: { fontSize: 16, fontWeight: "600", color: "#475569" },
  dayNumberActive: { color: "#fff" },
});
