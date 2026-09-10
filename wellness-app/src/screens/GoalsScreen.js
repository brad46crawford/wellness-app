import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../data/AppStore";
import GoalCard from "../components/GoalCard";
import { colors, spacing, radius, fonts } from "../theme/theme";

export default function GoalsScreen() {
  const { groups, addGoalToGroup, personalGoals, addPersonalGoal } = useAppStore();
  const [groupModalId, setGroupModalId] = useState(null);
  const [newGroupGoalTitle, setNewGroupGoalTitle] = useState("");
  const [personalModalOpen, setPersonalModalOpen] = useState(false);
  const [newPersonalGoalTitle, setNewPersonalGoalTitle] = useState("");
  const [remindersOn, setRemindersOn] = useState(true);

  function saveGroupGoal() {
    if (newGroupGoalTitle.trim().length === 0) return;
    addGoalToGroup(groupModalId, newGroupGoalTitle.trim(), 7);
    setGroupModalId(null);
  }

  function savePersonalGoal() {
    if (newPersonalGoalTitle.trim().length === 0) return;
    addPersonalGoal(newPersonalGoalTitle.trim(), 7);
    setNewPersonalGoalTitle("");
    setPersonalModalOpen(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Goals</Text>

        <Text style={styles.sectionLabel}>Personal Goals</Text>
        {personalGoals.map((goal) => (
          <GoalCard key={goal.id} goal={goal} accent={colors.steel} />
        ))}
        <Pressable style={styles.addBtn} onPress={() => setPersonalModalOpen(true)}>
          <Text style={styles.addBtnText}>+ Add a personal goal</Text>
        </Pressable>

        <Text style={[styles.sectionLabel, styles.groupSectionLabel]}>Group Goals</Text>
        {groups.map((group) => (
          <View key={group.id} style={styles.groupBlock}>
            <View style={styles.groupHeaderRow}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.memberCount}>
                {group.members.length} members
              </Text>
            </View>

            {group.goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} accent={colors.primary} />
            ))}

            <Pressable
              style={styles.addGoalBtn}
              onPress={() => setGroupModalId(group.id)}
            >
              <Text style={styles.addGoalBtnText}>+ Add a group goal</Text>
            </Pressable>
          </View>
        ))}

        <Text style={[styles.sectionLabel, styles.prefsSectionLabel]}>Preferences</Text>
        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily reminder notifications</Text>
          <Switch
            value={remindersOn}
            onValueChange={setRemindersOn}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
          />
        </View>
      </ScrollView>

      <Modal
        visible={groupModalId !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setGroupModalId(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New group goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Meditate 10 minutes daily"
              placeholderTextColor={colors.textMuted}
              value={newGroupGoalTitle}
              onChangeText={setNewGroupGoalTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setGroupModalId(null)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.saveBtn]}
                onPress={saveGroupGoal}
              >
                <Text style={styles.saveBtnText}>Add Goal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={personalModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setPersonalModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New personal goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Journal before bed"
              placeholderTextColor={colors.textMuted}
              value={newPersonalGoalTitle}
              onChangeText={setNewPersonalGoalTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, styles.cancelBtn]}
                onPress={() => setPersonalModalOpen(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.saveBtn]} onPress={savePersonalGoal}>
                <Text style={styles.saveBtnText}>Add Goal</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { color: colors.text, fontFamily: fonts.heading, fontSize: 34, letterSpacing: 0.5, marginBottom: spacing.lg },
  sectionLabel: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  groupSectionLabel: { marginTop: spacing.xl },
  prefsSectionLabel: { marginTop: spacing.xl },
  groupBlock: { marginBottom: spacing.xl },
  groupHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  groupName: { color: colors.text, fontFamily: fonts.heading, fontSize: 19, letterSpacing: 0.5 },
  memberCount: { color: colors.textMuted, fontSize: 12 },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.steel,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  addBtnText: { color: colors.steel, fontWeight: "600" },
  addGoalBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  addGoalBtnText: { color: colors.primaryLight, fontWeight: "600" },
  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  prefLabel: { color: colors.text, fontSize: 14 },
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
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: 0.5,
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
  saveBtnText: { color: colors.onPrimary, fontWeight: "700" },
});
