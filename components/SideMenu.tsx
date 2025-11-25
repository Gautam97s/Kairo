// components/SideMenu.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";

import {
  X,
  User,
  Settings,
  Calendar,
  CheckSquare,
  MessageSquare,
  Zap,
  Target,
  BarChart2,
  RefreshCw,
  Folder,
  Bell,
  Plus,
  Sun,
  Play,
  LogOut,
  Shield,
  Globe,
  Smartphone,
  ChevronRight,
  Moon,
  Cloud,
} from "lucide-react-native";

import { ViewState } from "../constants/types";

const { width } = Dimensions.get("window");

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (view: ViewState) => void;
  userName: string;
}

export default function SideMenu({
  isOpen,
  onClose,
  setView,
  userName,
}: SideMenuProps) {
  // Drawer slide animation
  const translateX = React.useRef(new Animated.Value(-width)).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isOpen ? 0 : -width,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const MenuItem = ({
    icon: Icon,
    label,
    onPress,
    badge,
  }: {
    icon: any;
    label: string;
    onPress?: () => void;
    badge?: string;
  }) => (
    <TouchableOpacity
      onPress={() => {
        onPress && onPress();
        onClose();
      }}
      style={styles.menuItem}
      activeOpacity={0.8}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIcon}>
          <Icon size={16} color="#64748b" />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>

      {badge && <Text style={styles.badge}>{badge}</Text>}
    </TouchableOpacity>
  );

  const SectionTitle = ({ title }: { title: string }) => (
    <Text style={styles.sectionTitle}>{title}</Text>
  );

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
      )}

      {/* Drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        {/* Header / Profile */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.avatarWrap}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${userName}`,
                }}
                style={styles.avatar}
              />

              <View style={styles.onlineDot}>
                <View style={styles.onlineInner} />
              </View>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <X size={22} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.email}>{userName.toLowerCase()}@kairo.app</Text>

          <TouchableOpacity style={styles.editProfile}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
            <ChevronRight size={12} color="#3b82f6" />
          </TouchableOpacity>

          {/* Productivity Pill */}
          <View style={styles.productivity}>
            <View style={styles.productivityIcon}>
              <Zap size={16} color="#f97316" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.productivityLabel}>PRODUCTIVITY LEVEL</Text>
              <Text style={styles.productivityValue}>Master • Top 5%</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* MENU */}
          <SectionTitle title="Menu" />
          <MenuItem
            icon={RefreshCw}
            label="Dashboard"
            onPress={() => setView("HOME")}
          />
          <MenuItem
            icon={Calendar}
            label="Calendar"
            badge="3"
            onPress={() => setView("CALENDAR")}
          />
          <MenuItem
            icon={CheckSquare}
            label="Tasks"
            onPress={() => setView("TASKS")}
          />
          <MenuItem icon={MessageSquare} label="AI Planner" />
          <MenuItem
            icon={Target}
            label="Focus Mode"
            onPress={() => setView("FOCUS")}
          />
          <MenuItem icon={BarChart2} label="Analytics" />
          <MenuItem icon={Folder} label="Projects" />

          {/* QUICK ACTIONS */}
          <SectionTitle title="Quick Actions" />

          <View style={styles.quickGrid}>
            <TouchableOpacity style={[styles.quickBtn, styles.darkBtn]}>
              <Plus size={18} color="#fff" />
              <Text style={styles.quickText}>New Task</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickBtn, styles.blueBtn]}>
              <Play size={18} color="#3b82f6" />
              <Text style={[styles.quickText, { color: "#3b82f6" }]}>
                Plan Day
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickBtn, styles.orangeBtn]}>
              <Zap size={18} color="#f97316" />
              <Text style={[styles.quickText, { color: "#f97316" }]}>Focus</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.quickBtn, styles.purpleBtn]}>
              <RefreshCw size={18} color="#8b5cf6" />
              <Text style={[styles.quickText, { color: "#8b5cf6" }]}>
                Routine
              </Text>
            </TouchableOpacity>
          </View>

          {/* SETTINGS */}
          <SectionTitle title="Settings" />
          <MenuItem icon={Bell} label="Notifications" />
          <MenuItem icon={Calendar} label="Integrations" badge="GCal" />
          <MenuItem icon={Settings} label="AI Preferences" />
          <MenuItem icon={Sun} label="Appearance" />
          <MenuItem icon={Smartphone} label="Offline Mode" />

          {/* ACCOUNT */}
          <SectionTitle title="Account" />
          <MenuItem icon={Globe} label="Language" />
          <MenuItem icon={Shield} label="Privacy & Security" />
          <MenuItem icon={Cloud} label="Backup & Sync" />
          <MenuItem icon={LogOut} label="Log Out" />

          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={styles.version}>Version 2.4.0 (Build 502)</Text>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 60,
  },

  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.85,
    maxWidth: 320,
    backgroundColor: "white",
    zIndex: 70,
    paddingBottom: 20,
  },

  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  avatarWrap: {
    position: "relative",
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 30,
    backgroundColor: "#e2e8f0",
  },

  onlineDot: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: "#22c55e",
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  onlineInner: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: "#fff",
  },

  closeButton: {
    padding: 8,
    borderRadius: 999,
  },

  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },

  email: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },

  editProfile: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  editProfileText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
    marginRight: 6,
  },

  productivity: {
    marginTop: 16,
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
  },

  productivityIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  productivityLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
  },

  productivityValue: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },

  scroll: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  sectionTitle: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    marginTop: 20,
    marginBottom: 8,
    letterSpacing: 1,
    paddingLeft: 6,
  },

  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  menuIcon: {
    width: 34,
    height: 34,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },

  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
  },

  badge: {
    fontSize: 10,
    fontWeight: "700",
    backgroundColor: "#fed7aa",
    color: "#ea580c",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 6,
    marginTop: 6,
  },

  quickBtn: {
    width: "47%",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  darkBtn: {
    backgroundColor: "#0f172a",
  },
  blueBtn: {
    backgroundColor: "#eff6ff",
  },
  orangeBtn: {
    backgroundColor: "#fff7ed",
  },
  purpleBtn: {
    backgroundColor: "#f5f3ff",
  },

  quickText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },

  version: {
    fontSize: 10,
    color: "#cbd5e1",
  },
});
