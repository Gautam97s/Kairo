import React, { createContext, ReactNode, useContext, useState } from "react";
import { Task } from "../constants/types";

interface TaskContextType {
    tasks: Task[];
    addTask: (task: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    toggleComplete: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);

    const addTask = (newTask: Partial<Task>) => {
        const task: Task = {
            id: Date.now().toString(),
            title: newTask.title || "New Task",
            startTime: newTask.startTime || new Date().toISOString(),
            endTime: newTask.endTime || new Date().toISOString(),
            priority: newTask.priority || "NORMAL",
            category: newTask.category || "Work",
            completed: false,
            ...newTask,
        } as Task;

        setTasks((prev) => [task, ...prev]);
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const toggleComplete = (id: string) => {
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        );
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, deleteTask, toggleComplete }}>
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error("useTasks must be used within a TaskProvider");
    }
    return context;
}
