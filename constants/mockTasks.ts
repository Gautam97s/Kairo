// constants/mockTasks.ts

import { Task } from "./types";

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
    priority: "URGENT",
    category: "WORK",
    energy: "HIGH",
    completed: false,
    location: "Home Office",
    locked: true,
  },
  {
    id: "2",
    title: "Team Sync",
    startTime: withHours(13, 0),
    endTime: withHours(14, 0),
    priority: "HIGH",
    category: "MEETING",
    energy: "MEDIUM",
    completed: false,
    location: "Zoom",
  },
  {
    id: "3",
    title: "Evening Run",
    startTime: withHours(17, 30),
    endTime: withHours(18, 30),
    priority: "NORMAL",
    category: "GYM",
    energy: "HIGH",
    completed: false,
    location: "Park",
  },
];
