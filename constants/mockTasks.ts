// constants/mockTasks.ts

import { Category, EnergyLevel, Priority, Task } from "./types";

const now = new Date();
const withHours = (h: number, m = 0) => {
  const d = new Date(now);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Deep Work: Strategy",
    startTime: withHours(9, 0),
    endTime: withHours(11, 0),
    priority: Priority.URGENT,
    category: Category.WORK,
    energy: EnergyLevel.HIGH,
    completed: false,
    location: "Home Office",
    locked: true,
  },
  {
    id: "2",
    title: "Team Sync",
    startTime: withHours(13, 0),
    endTime: withHours(14, 0),
    priority: Priority.HIGH,
    category: Category.MEETING,
    energy: EnergyLevel.MEDIUM,
    completed: false,
    location: "Zoom",
  },
  {
    id: "3",
    title: "Evening Run",
    startTime: withHours(17, 30),
    endTime: withHours(18, 30),
    priority: Priority.NORMAL,
    category: Category.GYM,
    energy: EnergyLevel.HIGH,
    completed: false,
    location: "Park",
  },
  {
    id: "4",
    title: "Project Planning",
    startTime: withHours(14, 0),
    endTime: withHours(15, 30),
    priority: Priority.HIGH,
    category: Category.PROJECTS,
    energy: EnergyLevel.HIGH,
    completed: false,
  },
  {
    id: "5",
    title: "Lunch Break",
    startTime: withHours(12, 0),
    endTime: withHours(13, 0),
    priority: Priority.NORMAL,
    category: Category.PERSONAL,
    energy: EnergyLevel.MEDIUM,
    completed: false,
    location: "Cafe",
  },
];
