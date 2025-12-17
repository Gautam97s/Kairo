// constants/categoryColors.ts
import { Category } from "./types";

export const categoryColorMap: Record<Category, { light: string; dark: string; text: string }> = {
  [Category.WORK]: {
    light: "#dbeafe",
    dark: "#3b82f6",
    text: "#0c4a6e",
  },
  [Category.PERSONAL]: {
    light: "#e9d5ff",
    dark: "#a855f7",
    text: "#5b21b6",
  },
  [Category.GYM]: {
    light: "#fed7aa",
    dark: "#f97316",
    text: "#7c2d12",
  },
  [Category.STUDY]: {
    light: "#ede9fe",
    dark: "#8b5cf6",
    text: "#5b21b6",
  },
  [Category.MEETING]: {
    light: "#ccfbf1",
    dark: "#14b8a6",
    text: "#134e4a",
  },
  [Category.ERRANDS]: {
    light: "#fbcfe8",
    dark: "#ec4899",
    text: "#831843",
  },
  [Category.PROJECTS]: {
    light: "#d1fae5",
    dark: "#10b981",
    text: "#065f46",
  },
};

export const getCategoryColor = (
  category: Category,
  variant: "light" | "dark" | "text" = "dark"
): string => {
  return categoryColorMap[category]?.[variant] || "#e2e8f0";
};
