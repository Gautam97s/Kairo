import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    categories: string[];
    selectedFilter: string;
    onSelectFilter: (filter: string) => void;
}

export default function FilterModal({
    visible,
    onClose,
    categories,
    selectedFilter,
    onSelectFilter,
}: FilterModalProps) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <BlurView intensity={20} tint="dark" style={styles.overlay}>
                <View style={styles.modalCard}>
                    <View style={styles.header}>
                        <Text style={styles.modalTitle}>Filter Tasks</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.listContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat}
                                style={[
                                    styles.filterOption,
                                    selectedFilter === cat && styles.filterOptionActive,
                                ]}
                                onPress={() => {
                                    onSelectFilter(cat);
                                    onClose();
                                }}
                            >
                                <Text
                                    style={[
                                        styles.filterText,
                                        selectedFilter === cat && styles.filterTextActive,
                                    ]}
                                >
                                    {cat}
                                </Text>
                                {selectedFilter === cat && (
                                    <Feather name="check" size={18} color="#fff" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    modalCard: {
        width: "85%",
        maxHeight: "60%",
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0f172a",
    },
    closeBtn: {
        padding: 4,
        backgroundColor: "#f1f5f9",
        borderRadius: 20,
    },
    listContainer: {
        gap: 8,
    },
    filterOption: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: "#f8fafc",
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    filterOptionActive: {
        backgroundColor: "#0f172a",
        borderColor: "#0f172a",
    },
    filterText: {
        fontSize: 15,
        fontWeight: "500",
        color: "#475569",
    },
    filterTextActive: {
        color: "#fff",
        fontWeight: "600",
    },
});
