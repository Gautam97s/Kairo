import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Task } from '../constants/types';
import { useTheme } from '../context/ThemeContext';

interface ActivityHeatmapProps {
    tasks?: Task[]; // Make optional to prevent crash if undefined
}

export default function ActivityHeatmap({ tasks = [] }: ActivityHeatmapProps) {
    const { colors } = useTheme();

    // 1. Calculate date range (Last 16 weeks ~ 112 days)
    const { weeks, monthLabels } = useMemo(() => {
        const today = new Date();
        const numWeeks = 16;

        const startOfCurrentWeek = new Date(today);
        startOfCurrentWeek.setDate(today.getDate() - today.getDay()); // Sunday as start of week

        // Calculate the start date of the grid (16 weeks ago)
        const startDate = new Date(startOfCurrentWeek);
        startDate.setDate(startDate.getDate() - (numWeeks - 1) * 7);

        let current = new Date(startDate);
        const months: { label: string; index: number }[] = [];
        const weeksArr = [];

        const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let w = 0; w < numWeeks; w++) {
            const weekDays = [];
            let foundMonthStart = false;
            let monthName = "";

            for (let d = 0; d < 7; d++) {
                const dateStr = current.toISOString().split('T')[0];

                // If it's the 1st of the month...
                if (current.getDate() === 1) {
                    foundMonthStart = true;
                    monthName = MONTHS[current.getMonth()];
                }

                // Safe access to tasks
                const count = (tasks || []).filter(t =>
                    t.completed &&
                    (t.endTime?.startsWith(dateStr) || t.startTime?.startsWith(dateStr))
                ).length;

                let level = 0;
                if (count > 0) level = 1;
                if (count >= 3) level = 2;
                if (count >= 5) level = 3;
                if (count >= 7) level = 4;

                weekDays.push({ date: dateStr, level, count });
                current.setDate(current.getDate() + 1);
            }

            weeksArr.push(weekDays);

            if (foundMonthStart) {
                months.push({ label: monthName, index: w });
            } else if (w === 0) {
                const firstDay = new Date(weeksArr[0][0].date);
                months.push({ label: MONTHS[firstDay.getMonth()], index: 0 });
            }
        }

        return { weeks: weeksArr, monthLabels: months };
    }, [tasks]);

    const getLevelColor = (level: number) => {
        switch (level) {
            case 0: return colors.card;
            case 1: return '#86efac';
            case 2: return '#4ade80';
            case 3: return '#22c55e';
            case 4: return '#16a34a';
            default: return colors.card;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Activity</Text>
                <Text style={{ color: colors.secondary, fontSize: 12 }}>Last 16 Weeks</Text>
            </View>

            <View style={styles.graphContainer}>
                <View style={styles.monthsRow}>
                    {monthLabels.map((m, i) => (
                        <Text
                            key={i}
                            style={[
                                styles.monthText,
                                { left: m.index * 14, color: colors.secondary }
                            ]}
                        >
                            {m.label}
                        </Text>
                    ))}
                </View>

                <View style={styles.grid}>
                    <View style={styles.dayLabels}>
                        <View style={styles.dayRow} />
                        <View style={styles.dayRow}><Text style={[styles.dayText, { color: colors.secondary }]}>Mon</Text></View>
                        <View style={styles.dayRow} />
                        <View style={styles.dayRow}><Text style={[styles.dayText, { color: colors.secondary }]}>Wed</Text></View>
                        <View style={styles.dayRow} />
                        <View style={styles.dayRow}><Text style={[styles.dayText, { color: colors.secondary }]}>Fri</Text></View>
                        <View style={styles.dayRow} />
                    </View>

                    <View style={styles.weeks}>
                        {weeks.map((week, wIndex) => (
                            <View key={wIndex} style={styles.column}>
                                {week.map((day, dIndex) => (
                                    <View
                                        key={day.date}
                                        style={[
                                            styles.box,
                                            {
                                                backgroundColor: getLevelColor(day.level),
                                                borderColor: day.level === 0 ? colors.border : 'transparent',
                                                borderWidth: day.level === 0 ? 1 : 0
                                            }
                                        ]}
                                    />
                                ))}
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.legend}>
                    <Text style={[styles.legendText, { color: colors.secondary }]}>Less</Text>
                    {[0, 1, 2, 3, 4].map(l => (
                        <View
                            key={l}
                            style={[
                                styles.box,
                                {
                                    backgroundColor: getLevelColor(l),
                                    borderColor: l === 0 ? colors.border : 'transparent',
                                    borderWidth: l === 0 ? 1 : 0
                                }
                            ]}
                        />
                    ))}
                    <Text style={[styles.legendText, { color: colors.secondary }]}>More</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 24,
        paddingHorizontal: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    graphContainer: {
        alignItems: 'flex-start',
    },
    monthsRow: {
        flexDirection: 'row',
        width: '100%',
        height: 20,
        position: 'relative',
        marginBottom: 4,
        marginLeft: 32, // Match dayLabels width (24) + margin (8)
    },
    monthText: {
        position: 'absolute',
        fontSize: 10,
    },
    grid: {
        flexDirection: 'row',
    },
    dayLabels: {
        width: 24,
        marginRight: 8,
        gap: 4, // Exact match to grid gap
        paddingTop: 0,
    },
    dayRow: {
        height: 10,
        justifyContent: 'center',
    },
    dayText: {
        fontSize: 10,
        height: 10,
        lineHeight: 10,
        textAlign: 'left', // Force Left Alignment
    },
    weeks: {
        flexDirection: 'row',
        gap: 4,
    },
    column: {
        gap: 4,
    },
    box: {
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 12,
        width: '100%',
        paddingRight: 8,
    },
    legendText: {
        fontSize: 10,
        marginHorizontal: 4,
    }
});
