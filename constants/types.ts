// constants/types.ts

export enum Priority {
  URGENT = "URGENT",
  HIGH = "HIGH",
  NORMAL = "NORMAL",
  LOW = "LOW",
}

export enum Category {
  WORK = "Work",
  PERSONAL = "Personal",
  GYM = "Gym",
  STUDY = "Study",
  MEETING = "Meeting",
  ERRANDS = "Errands",
  PROJECTS = "Projects",
}

export enum EnergyLevel {
  HIGH = "High Energy",
  MEDIUM = "Medium Energy",
  LOW = "Low Energy",
}

export interface Task {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  priority: Priority;
  category: Category;
  completed: boolean;
  location?: string;
  notes?: string;
  energy?: EnergyLevel;
  isRecurring?: boolean;
  dependencies?: string[]; // IDs of prerequisite tasks
  locked?: boolean; // If true, AI won't auto-reschedule without asking
}

export interface AIResponse {
  suggestedTasks: Task[];
  analysis: string;
  action: "CREATE" | "RESCHEDULE" | "CONFLICT_RESOLVED" | "CHAT";
}

export type ViewState = "HOME" | "CALENDAR" | "ASSISTANT" | "FOCUS" | "TASKS";
