import { Clock, Menu, Zap } from "lucide-react-native";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlassCard from "../../components/GlassCard";
import KairoLogo from "../../components/KairoLogo";
import { INITIAL_TASKS } from "../../constants/mockTasks";
import { Task } from "../../constants/types";

export default function HomeScreen() {
  const tasks: Task[] = INITIAL_TASKS;
  const userName = "Gautam";

  const onTaskComplete = (id: string) => {
    console.log("Complete task", id);
  };

  const onOpenMenu = () => {
    console.log("Open menu");
  };

  const nextTask = useMemo(() => {
    return (
      tasks.find((t) => !t.completed && new Date(t.endTime) > new Date()) ||
      tasks[0]
    );
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks.filter((t) => t.id !== nextTask?.id && !t.completed);
  }, [tasks, nextTask]);

  return (
    <View style={styles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header - White Background */}
        <View style={styles.headerSection}>
          <View style={styles.topRow}>
            <KairoLogo size="small" />
            <TouchableOpacity
              onPress={onOpenMenu}
              style={styles.menuButton}
            >
              <Menu size={20} color="#0f172a" />
            </TouchableOpacity>
          </View>

          <View>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>Oct 15, 2025</Text>
              <View style={styles.dateDot} />
              <Text style={styles.dateText}>Today</Text>
            </View>
            <Text style={styles.greetingText}>
              Hello, <Text style={styles.userNameText}>{userName}</Text>
            </Text>
          </View>
        </View>

        {/* Main Content - Black Container */}
        <View style={styles.blackContainer}>

          {/* Top Row of Cards */}
          <View style={styles.cardRow}>
            {/* FOCUS CARD (Peach) */}
            <GlassCard variant="peach" style={styles.focusCard} onPress={() => { }}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Zap size={16} color="#0f172a" fill="#0f172a" />
                </View>
              </View>

              <View>
                <Text style={[styles.cardLabel, { textAlign: 'center' }]}>Now Focus</Text>
                <Text style={styles.focusTitle} numberOfLines={2}>
                  {nextTask ? nextTask.title : "No Active Task"}
                </Text>

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
                <View style={{ marginTop: 17, right: 0, left: 56 }}>
                  <MiniChart color="#0f172a" />
                </View>
              </View>
            </GlassCard>

            {/* UP NEXT CARD (Lilac/Purple) */}
            <GlassCard variant="purple" style={styles.nextCard} onPress={() => { }}>
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Clock size={16} color="#0f172a" />
                </View>
              </View>

              <View>
                <Text style={styles.cardLabel}>Up Next</Text>
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
                <View style={{ marginTop: 12 }}>
                  <MiniChart color="#0f172a" />
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Remaining List */}
          {upcomingTasks.length > 1 && (
            <View style={styles.listSection}>
              <Text style={styles.listHeader}>Later Today</Text>
              {upcomingTasks.slice(1).map(task => (
                <TouchableOpacity key={task.id} style={styles.listItem}>
                  <View style={styles.listIconContainer}>
                    <View style={styles.listDot} />
                  </View>
                  <View>
                    <Text style={styles.listItemTitle}>{task.title}</Text>
                    <Text style={styles.listItemTime}>
                      {new Date(task.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>
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
    backgroundColor: '#fff',
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
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    color: '#64748b',
  },
  dateDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#cbd5e1',
  },
  greetingText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#0f172a',
  },
  userNameText: {
    fontWeight: '600',
  },

  blackContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
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
    height: 210,
    justifyContent: 'space-between',
  },
  nextCard: {
    flex: 1,
    height: 210,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    color: 'rgba(255,255,255,0.4)',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  listIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  listItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  listItemTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  }
});