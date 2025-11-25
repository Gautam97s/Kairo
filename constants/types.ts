// constants/types.ts

export type Priority = "NORMAL" | "HIGH" | "URGENT";
export type Category = "WORK" | "MEETING" | "GYM" | "PERSONAL" | "OTHER";
export type ViewState = "HOME" | "TASKS" | "CALENDAR" | "FOCUS";

export type Task = {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  priority?: Priority;
  category?: Category;
  energy?: "LOW" | "MEDIUM" | "HIGH";
  completed?: boolean;
  location?: string;
  locked?: boolean;
};
