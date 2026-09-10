import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Modal, Switch } from "react-native";
import { useAppStore } from "../data/AppStore";
import ProgressBar from "../components/ProgressBar";
import { colors, spacing, radius } from "../theme/theme";

export default function PersonalScreen() {
  const { personalGoals, addPersonalGoal } = useAppStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [remindersOn, setRemindersOn] = useState(true);

  function saveGoal() {
    if (title.trim().length === 0) return;
    addPersonalGoal(title.trim(), 7);
    setTitle("");
    setModalOpen(false);
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <Text style={styles.header}>Personal</Text>
        <Text style={styles.subheader}>Just for you — not visible to your groups.</Text>

        {personalGoals.map((goal) => (
          <View key={goal.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{goal.title}</Text>
              <Text style={styles.cardCount}>
                {goal.progressThisWeek}/{goal.targetPerWeek}
              </Text>
            </View>
            <ProgressBar progress={goal.progressThisWeek} total={goal.targetPerWeek} />
          </View>
        ))}

        <Pressable style={styles.addBtn} onPress={() => setModalOpen(true)}>
          <Text style={styles.addBtnText}>+ Add a personal goal</Text>
        </Pressable>

        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.prefRow}>
          <Text style={styles.prefLabel}>Daily reminder notifications</Text>
          <Switch
            value={remindersOn}
            onValueChange={setRemindersOn}
            trackColor={{ false: colors.surfaceLight, true: colors.primary }}
          />
        </View>
      </ScrollView>

      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New personal goal</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Journal before bed"
              placeholderTextColor={colors.textMuted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, styles.saveBtn]} onPress={saveGoal}>
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
  header: { color: colors.text, fontSize: 26, fontWeight: "700" },
  subheader: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.sm },
  cardTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  cardCount: { color: colors.primary, fontWeight: "700" },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  addBtnText: { color: colors.primary, fontWeight: "600" },
  sectionHeader: { color: colors.text, fontSize: 18, fontWeight: "700", marginTop: spacing.xl, marginBottom: spacing.sm },
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
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: spacing.lg,
  },
  modalTitle: { color: colors.text, fontSize: 18, fontWeight: "700", marginBottom: spacing.md },
  input: {
    backgroundColor: colors.surfaceLight,
    color: colors.text,
    borderRadius: radius.sm,
    padding: spacing.md,
    fontSize: 15,
  },
  modalButtons: { flexDirection: "row", marginTop: spacing.lg, gap: spacing.sm },
  modalBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, alignItems: "center" },
  cancelBtn: { backgroundColor: colors.surfaceLight },
  cancelBtnText: { color: colors.text, fontWeight: "600" },
  saveBtn: { backgroundColor: colors.primary },
  saveBtnText: { color: colors.background, fontWeight: "700" },
});
