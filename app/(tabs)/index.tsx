import { Clock, Menu, Zap } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassCard from "../../components/GlassCard";
import KairoLogo from "../../components/KairoLogo";
import SideMenu from "../../components/SideMenu";
import { Task } from "../../constants/types";
import { useTasks } from "../../context/TaskContext";
import { useTheme } from "../../context/ThemeContext";

export default function HomeScreen() {
  const { tasks } = useTasks();
  const { colors, theme } = useTheme();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const userName = "Gautam";

  const onTaskComplete = (id: string) => {
    console.log("Complete task", id);
  };

  const onOpenMenu = () => {
    setIsMenuVisible(true);
  };

  const nextTask = useMemo(() => {
    return (
      tasks.find((t: Task) => !t.completed && new Date(t.endTime) > new Date()) ||
      tasks[0]
    );
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((t: Task) => t.id !== nextTask?.id && !t.completed);
  }, [tasks, nextTask]);

  return (
    <View style={[styles.screenContainer, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.topRow}>
            <KairoLogo size="small" color={colors.text} />
            <TouchableOpacity
              onPress={onOpenMenu}
              style={[styles.menuButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <Menu size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.dateRow}>
              <Text style={[styles.dateText, { color: colors.secondary }]}>Oct 15, 2025</Text>
              <View style={[styles.dateDot, { backgroundColor: colors.border }]} />
              <Text style={[styles.dateText, { color: colors.secondary }]}>Today</Text>
            </View>
            <Text style={[styles.greetingText, { color: colors.text }]}>
              Hello, <Text style={styles.userNameText}>{userName}</Text>
            </Text>
          </View>
        </View>

        {/* Main Content - Black/Dark Container */}
        {/* In Dark Mode, we make this slightly lighter than pure black to distinguish from main bg if main bg is black 
            OR we keep it black and main bg is dark slate.
            Let's stick to the "Card" concept. In Light Mode it's Black. 
            In Dark Mode, maybe it's also Black or Dark Slate?
            If theme is dark, let's use colors.card which is #1e293b (Dark Slate)
        */}
        <View style={[
          styles.blackContainer,
          theme === 'dark' && { backgroundColor: colors.card, shadowColor: '#000' }
        ]}>

          {/* Top Row of Cards */}
          <View style={styles.cardRow}>
            {/* FOCUS CARD (Peach) */}
            <GlassCard variant="peach" style={styles.focusCard} onPress={() => { }}>
              <View style={styles.cardContent}>
                <View>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                      <Zap size={16} color="#0f172a" fill="#0f172a" />
                    </View>
                    <Text style={[styles.cardLabel, { marginBottom: 0 }]}>Now Focus</Text>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    <Text style={styles.focusTitle} numberOfLines={2}>
                      {nextTask ? nextTask.title : "No Active Task"}
                    </Text>
                  </View>

                  {nextTask && (
                    <View style={styles.tagRow}>
                      <View style={styles.miniTag}>
                        <Text style={styles.miniTagText}>{nextTask.category}</Text>
                      </View>
                      <Text style={styles.timeText}>
                        {new Date(nextTask.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                      <View style={styles.miniTag}>
                        <Text style={styles.miniTagText}>High</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.chartContainer}>
                  <MiniChart color="#0f172a" />
                </View>
              </View>
            </GlassCard>

            {/* UP NEXT CARD (Lilac/Purple) */}
            <GlassCard variant="purple" style={styles.nextCard} onPress={() => { }}>
              <View style={styles.cardContent}>
                <View>
                  <View style={styles.cardHeader}>
                    <View style={styles.iconCircle}>
                      <Clock size={16} color="#0f172a" />
                    </View>
                    <Text style={[styles.cardLabel, { marginBottom: 0 }]}>Up Next</Text>
                  </View>

                  <View style={{ marginTop: 12 }}>
                    {upcomingTasks[0] ? (
                      <>
                        <Text style={styles.nextTitle} numberOfLines={1}>{upcomingTasks[0].title}</Text>
                        <Text style={styles.nextTime}>
                          {new Date(upcomingTasks[0].startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </>
                    ) : (
                      <Text style={styles.emptyText}>Clear Schedule</Text>
                    )}
                  </View>
                </View>

                <View style={styles.chartContainer}>
                  <MiniChart color="#0f172a" />
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Remaining List */}
          {upcomingTasks.length > 1 && (
            <View style={styles.listSection}>
              <Text style={[styles.listHeader, { color: theme === 'dark' ? colors.secondary : 'rgba(255,255,255,0.4)' }]}>
                Later Today
              </Text>
              {upcomingTasks.slice(1).map((task: Task) => (
                <View key={task.id} style={[
                  styles.listItem,
                  { backgroundColor: theme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)' }
                ]}>
                  <View style={[styles.listIconContainer, { borderColor: theme === 'dark' ? colors.border : 'rgba(255,255,255,0.1)' }]}>
                    <View style={[styles.listDot, { backgroundColor: theme === 'dark' ? colors.text : 'rgba(255,255,255,0.4)' }]} />
                  </View>
                  <View>
                    <Text style={[styles.listItemTitle, { color: theme === 'dark' ? colors.text : '#fff' }]}>
                      {task.title}
                    </Text>
                    <Text style={[styles.listItemTime, { color: theme === 'dark' ? colors.secondary : 'rgba(255,255,255,0.4)' }]}>
                      {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      <SideMenu visible={isMenuVisible} onClose={() => setIsMenuVisible(false)} />
    </View>
  );
}

function MiniChart({ color }: { color: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 24 }}>
      {[12, 20, 14, 24, 10, 18].map((h, i) => (
        <View
          key={i}
          style={{
            width: 6,
            height: h,
            backgroundColor: color,
            borderRadius: 3,
            opacity: 0.3 + (i * 0.1),
          }}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Header
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 60, // Adjusted for status bar
    paddingBottom: 24,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '300',
  },
  userNameText: {
    fontWeight: '600',
  },

  blackContainer: {
    flex: 1,
    backgroundColor: '#000000ff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    paddingTop: 32,
    paddingBottom: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  focusCard: {
    flex: 1,
    height: 220,
  },
  nextCard: {
    flex: 1,
    height: 220,
  },
  cardContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 12,
  },
  chartContainer: {
    marginTop: 16,
    alignSelf: "flex-end",
    paddingRight: 8,
    paddingBottom: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0f172a',
    opacity: 1,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  focusTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#0f172a',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  nextTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#0f172a',
    marginBottom: 8,
  },
  nextTime: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
  },
  emptyText: {
    fontSize: 14,
    opacity: 0.6,
    color: '#0f172a',
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  miniTag: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  miniTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f172a',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    opacity: 0.8,
  },

  // List Section
  listSection: {
    marginTop: 8,
  },
  listHeader: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
    paddingLeft: 4,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 16,
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  listItemTime: {
    fontSize: 12,
  }
});