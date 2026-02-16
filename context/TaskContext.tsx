import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { Category, Priority, Task } from "../constants/types";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";

// Define the shape of our context
interface TaskContextType {
    tasks: Task[];
    loading: boolean;
    addTask: (task: Partial<Task>) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
    toggleComplete: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useAuth();

    // Fetch tasks whenever the user session changes
    useEffect(() => {
        if (session?.user) {
            fetchTasks();
        } else {
            setTasks([]);
            setLoading(false);
        }
    }, [session]);

    const fetchTasks = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            Alert.alert('Error', 'Could not fetch tasks');
        } else {
            // Map database snake_case to frontend camelCase
            const mappedTasks: Task[] = (data || []).map((item: any) => ({
                id: item.id,
                title: item.title,
                startTime: item.start_time,
                endTime: item.end_time,
                priority: item.priority as Priority,
                category: item.category as Category,
                completed: item.completed,
                isRecurring: item.is_recurring,
                // Default values for fields not yet in DB
                location: '',
                notes: '',
                dependencies: [],
                energy: undefined,
                locked: false,
            }));
            setTasks(mappedTasks);
        }
        setLoading(false);
    };

    const addTask = async (newTask: Partial<Task>) => {
        if (!session?.user) return;

        // Optimistic UI update
        const tempId = Date.now().toString();
        const optimisticTask: Task = {
            id: tempId,
            title: newTask.title || 'New Task',
            startTime: newTask.startTime || new Date().toISOString(),
            endTime: newTask.endTime || new Date().toISOString(),
            priority: newTask.priority || Priority.NORMAL,
            category: newTask.category || Category.WORK,
            completed: false,
            isRecurring: newTask.isRecurring || false,
            ...newTask,
        } as Task;

        setTasks((prev) => [optimisticTask, ...prev]);

        // DB Insert
        const { data, error } = await supabase
            .from('tasks')
            .insert({
                user_id: session.user.id,
                title: optimisticTask.title,
                start_time: optimisticTask.startTime,
                end_time: optimisticTask.endTime,
                priority: optimisticTask.priority,
                category: optimisticTask.category,
                completed: optimisticTask.completed,
                is_recurring: optimisticTask.isRecurring,
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding task:', error);
            Alert.alert('Error', 'Could not add task');
            // Revert optimistic update
            setTasks((prev) => prev.filter((t) => t.id !== tempId));
        } else if (data) {
            // Update the temp ID with the real ID from DB
            setTasks((prev) =>
                prev.map((t) => (t.id === tempId ? { ...t, id: data.id } : t))
            );
        }
    };

    const deleteTask = async (id: string) => {
        // Optimistic update
        const previousTasks = [...tasks];
        setTasks((prev) => prev.filter((t) => t.id !== id));

        const { error } = await supabase.from('tasks').delete().eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            Alert.alert('Error', 'Could not delete task');
            // Revert
            setTasks(previousTasks);
        }
    };

    const toggleComplete = async (id: string) => {
        const task = tasks.find((t) => t.id === id);
        if (!task) return;

        const newStatus = !task.completed;

        // Optimistic update
        setTasks((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: newStatus } : t))
        );

        const { error } = await supabase
            .from('tasks')
            .update({ completed: newStatus })
            .eq('id', id);

        if (error) {
            console.error('Error updating task:', error);
            // Revert
            setTasks((prev) =>
                prev.map((t) => (t.id === id ? { ...t, completed: !newStatus } : t))
            );
        }
    };

    return (
        <TaskContext.Provider
            value={{ tasks, loading, addTask, deleteTask, toggleComplete }}
        >
            {children}
        </TaskContext.Provider>
    );
}

export function useTasks() {
    const context = useContext(TaskContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
}
