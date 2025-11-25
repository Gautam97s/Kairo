import { Task, Priority, Category, EnergyLevel } from "../constants/types";

/**
 * Mock AI Service for React Native
 * In production, this would connect to Gemini API or your backend
 * For now, it provides intelligent task parsing and scheduling
 */

export const parseTaskFromNaturalLanguage = async (
  input: string,
  currentTasks: Task[]
): Promise<{ tasks: Task[]; message: string; action: string }> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  try {
    // Simple natural language parsing
    const taskData = extractTaskData(input, currentTasks);

    if (!taskData) {
      return {
        tasks: [],
        message: "I couldn't understand that. Try something like 'Add gym at 5pm' or 'Schedule meeting tomorrow at 2pm'.",
        action: "CHAT",
      };
    }

    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: taskData.title!,
      startTime: taskData.startTime!,
      endTime: taskData.endTime!,
      priority: taskData.priority!,
      category: taskData.category!,
      energy: taskData.energy,
      completed: false,
      locked: false,
    };

    // Check for conflicts
    const conflicts = detectConflicts(newTask, currentTasks);
    let message = `Task "${newTask.title}" scheduled for ${formatTime(newTask.startTime)}.`;

    if (conflicts.length > 0) {
      message += ` ⚠️ This overlaps with ${conflicts.map((t) => t.title).join(", ")}.`;
    }

    return {
      tasks: [newTask],
      message,
      action: conflicts.length > 0 ? "CONFLICT_RESOLVED" : "CREATE",
    };
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return {
      tasks: [],
      message: "I'm having trouble processing that. Please try again.",
      action: "CHAT",
    };
  }
};

/**
 * Extract task data from natural language input
 */
function extractTaskData(
  input: string,
  currentTasks: Task[]
): Partial<Task> | null {
  const lowerInput = input.toLowerCase();

  // Extract title
  let title = extractTitle(input);
  if (!title) return null;

  // Extract time
  const timeData = extractTime(lowerInput);
  if (!timeData) return null;

  // Infer category and energy level
  const category = inferCategory(title);
  const energy = inferEnergyLevel(category, title);
  const priority = inferPriority(lowerInput);

  return {
    title,
    startTime: timeData.startTime,
    endTime: timeData.endTime,
    category,
    energy,
    priority,
  };
}

/**
 * Extract task title from input
 */
function extractTitle(input: string): string {
  // Remove time indicators
  let title = input
    .replace(/\b(at|around|by|@)\s+\d{1,2}:\d{2}|[ap]m/gi, "")
    .replace(/\b(today|tomorrow|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi, "")
    .replace(/\b(morning|afternoon|evening|night|tonight)\b/gi, "")
    .trim();

  // Remove empty phrases
  if (title.length < 2) return "";
  return title.charAt(0).toUpperCase() + title.slice(1);
}

/**
 * Extract time from natural language
 */
function extractTime(input: string): { startTime: string; endTime: string } | null {
  const now = new Date();
  let targetDate = new Date(now);

  // Check for tomorrow
  if (/tomorrow/i.test(input)) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  // Extract hour and minutes
  const timeMatch = input.match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
  if (!timeMatch) {
    // Default to 2 hours from now
    const startTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration
    return {
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    };
  }

  let hour = parseInt(timeMatch[1]);
  const minute = parseInt(timeMatch[2] || "0");
  const meridiem = timeMatch[3]?.toLowerCase();

  // Convert to 24-hour format
  if (meridiem === "pm" && hour !== 12) hour += 12;
  if (meridiem === "am" && hour === 12) hour = 0;

  targetDate.setHours(hour, minute, 0, 0);

  const startTime = targetDate;
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // Default 1 hour duration

  // Special durations based on activity
  if (/gym|run|workout|exercise/.test(input)) {
    endTime.setTime(startTime.getTime() + 60 * 60 * 1000); // 1 hour
  } else if (/meeting|call|sync/.test(input)) {
    endTime.setTime(startTime.getTime() + 30 * 60 * 1000); // 30 min
  } else if (/deep work|focus|coding/.test(input)) {
    endTime.setTime(startTime.getTime() + 120 * 60 * 1000); // 2 hours
  } else if (/lunch|dinner|breakfast/.test(input)) {
    endTime.setTime(startTime.getTime() + 60 * 60 * 1000); // 1 hour
  }

  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
}

/**
 * Infer category from task title
 */
function inferCategory(title: string): Category {
  const lowerTitle = title.toLowerCase();

  if (/gym|run|workout|exercise|yoga|swim|sports/i.test(lowerTitle)) {
    return Category.GYM;
  }
  if (/meeting|call|sync|standup|presentation|conference/i.test(lowerTitle)) {
    return Category.MEETING;
  }
  if (/study|learn|read|course|class|lecture/i.test(lowerTitle)) {
    return Category.STUDY;
  }
  if (/project|code|design|build|develop/i.test(lowerTitle)) {
    return Category.PROJECTS;
  }
  if (/grocery|shopping|errands|buy|pickup/i.test(lowerTitle)) {
    return Category.ERRANDS;
  }
  if (/personal|relax|break|coffee|lunch|dinner/i.test(lowerTitle)) {
    return Category.PERSONAL;
  }

  return Category.WORK;
}

/**
 * Infer energy level required
 */
function inferEnergyLevel(category: Category, title: string): EnergyLevel {
  if (
    category === Category.GYM ||
    /deep work|focus|critical|important|urgent/i.test(title)
  ) {
    return EnergyLevel.HIGH;
  }
  if (category === Category.PERSONAL || /relax|break|rest/i.test(title)) {
    return EnergyLevel.LOW;
  }
  return EnergyLevel.MEDIUM;
}

/**
 * Infer priority from input
 */
function inferPriority(input: string): Priority {
  if (/urgent|asap|critical|important|high.*priority/i.test(input)) {
    return Priority.URGENT;
  }
  if (/high|must|deadline/i.test(input)) {
    return Priority.HIGH;
  }
  if (/low|optional|maybe|could/i.test(input)) {
    return Priority.LOW;
  }
  return Priority.NORMAL;
}

/**
 * Detect time conflicts
 */
function detectConflicts(newTask: Task, existingTasks: Task[]): Task[] {
  const newStart = new Date(newTask.startTime).getTime();
  const newEnd = new Date(newTask.endTime).getTime();

  return existingTasks.filter((task) => {
    if (task.completed) return false;

    const taskStart = new Date(task.startTime).getTime();
    const taskEnd = new Date(task.endTime).getTime();

    // Check for overlap
    return newStart < taskEnd && newEnd > taskStart;
  });
}

/**
 * Format time for display
 */
function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Suggest a better time if conflict detected
 */
export const suggestAlternativeTime = (
  task: Task,
  currentTasks: Task[]
): { startTime: string; endTime: string } | null => {
  const duration = new Date(task.endTime).getTime() - new Date(task.startTime).getTime();
  let suggestedStart = new Date(task.startTime);

  // Try times in 30-minute increments for the next 4 hours
  for (let i = 1; i <= 8; i++) {
    suggestedStart = new Date(
      new Date(task.startTime).getTime() + i * 30 * 60 * 1000
    );
    const suggestedEnd = new Date(suggestedStart.getTime() + duration);

    const testTask: Task = {
      ...task,
      startTime: suggestedStart.toISOString(),
      endTime: suggestedEnd.toISOString(),
    };

    if (detectConflicts(testTask, currentTasks).length === 0) {
      return {
        startTime: suggestedStart.toISOString(),
        endTime: suggestedEnd.toISOString(),
      };
    }
  }

  return null;
};
