import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
} from "react-native";
import { useAppStore } from "../data/AppStore";
import GoalCard from "../components/GoalCard";
import { colors, spacing, radius } from "../theme/theme";

export default function GoalsScreen() {
  const { groups, addGoalToGroup } = useAppStore();
  const [modalGroupId, setModalGroupId] = useState(null);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  function openAddGoal(groupId) {
    setModalGroupId(groupId);
    setNewGoalTitle("");
  }

  function saveGoal() {
    if (newGoalTitle.trim().length === 0) return;
    addGoalToGroup(modalGroupId, newGoalTitle.trim(), 7);
    setModalGroupId(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Your Groups</Text>
        <Text style={styles.subheader}>
          Goals your circles are holding each other to this week.
        </Text>

        {groups.map((group) => (
          <View key={group.id} style={styles.groupBlock}>
            <View style={styles.groupHeaderRow}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.memberCount}>
                {group.members.length} members
              </Text>
            </View>

            {group.goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}

            <Pressable
              style={styles.addGoalBtn}
              onPress={() => openAddGoal(group.id)}
            >
              <Text style={styles.addGoalBtnText}>+ Add a group goal</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={modalGroupId !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setModalGroupId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New group goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Meditate 10 minutes daily"
              placeholderTextColor={colors.textMuted}
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setModalGroupId(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={saveGoal}
              >
                <Text style={styles.saveBtnText}>Add Goal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { color: colors.text, fontSize: 26, fontWeight: "700" },
  subheader: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  groupBlock: { marginBottom: spacing.xl },
  groupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  groupName: { color: colors.text, fontSize: 18, fontWeight: "700" },
  memberCount: { color: colors.textMuted, fontSize: 12 },
  addGoalBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  addGoalBtnText: { color: colors.primary, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.text,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: colors.surfaceLight },
  cancelBtnText: { color: colors.text, fontWeight: "600" },
  saveBtn: { backgroundColor: colors.primary },
  saveBtnText: { color: colors.background, fontWeight: "700" },
});
