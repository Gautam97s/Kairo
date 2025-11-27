// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import React from "react";
import NavBar from "../../components/NavBar";
import { ViewState } from "../../constants/types";

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={({ state, navigation }) => {
        const currentRoute = state.routes[state.index].name;

        // Map route names to ViewState
        const getViewState = (route: string): ViewState => {
          switch (route) {
            case "index": return "HOME";
            case "tasks": return "TASKS";
            case "calendar": return "CALENDAR";
            case "focus": return "FOCUS";
            default: return "HOME";
          }
        };

        const currentView = getViewState(currentRoute);

        const setView = (view: ViewState) => {
          let routeName = "index";
          switch (view) {
            case "HOME": routeName = "index"; break;
            case "TASKS": routeName = "tasks"; break;
            case "CALENDAR": routeName = "calendar"; break;
            case "FOCUS": routeName = "focus"; break;
          }
          navigation.navigate(routeName);
        };

        return (
          <NavBar
            currentView={currentView}
            setView={setView}
            onMicPress={() => console.log("Mic Pressed")}
          />
        );
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="tasks" />
      <Tabs.Screen name="calendar" />
      <Tabs.Screen name="focus" />
    </Tabs>
  );
}
