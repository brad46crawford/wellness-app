import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from "react-native";
import { useAppStore } from "../data/AppStore";
import { colors, spacing, radius } from "../theme/theme";

export default function HomeScreen() {
  const {
    getTodaysTasks,
    submitCheckIn,
    submitPersonalCheckIn,
    feed,
    currentUser,
  } = useAppStore();
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [note, setNote] = useState("");

  const tasks = getTodaysTasks();

  function handleCheckIn(task, status) {
    if (task.kind === "group") {
      submitCheckIn(task.goalId, task.groupId, task.groupName, task.title, note.trim(), status);
    } else {
      submitPersonalCheckIn(task.goalId, note.trim(), status);
    }
    setExpandedTaskId(null);
    setNote("");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.greeting}>Hey {currentUser.name} 👋</Text>
      <Text style={styles.subheader}>
        {tasks.length === 0
          ? "You're all caught up for today!"
          : `${tasks.length} thing${tasks.length === 1 ? "" : "s"} on your list today`}
      </Text>

      {tasks.map((task) => {
        const taskKey = `${task.kind}-${task.goalId}`;
        const isExpanded = expandedTaskId === taskKey;
        return (
          <View key={taskKey} style={styles.taskCard}>
            <Pressable
              style={styles.taskHeader}
              onPress={() => setExpandedTaskId(isExpanded ? null : taskKey)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskMeta}>
                  {task.kind === "group" ? task.groupName : "Personal goal"}
                </Text>
              </View>
              <Text style={styles.chevron}>{isExpanded ? "▲" : "▼"}</Text>
            </Pressable>

            {isExpanded && (
              <View style={styles.expandArea}>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add a quick note (optional)"
                  placeholderTextColor={colors.textMuted}
                  value={note}
                  onChangeText={setNote}
                />
                <View style={styles.statusRow}>
                  <Pressable
                    style={[styles.statusBtn, styles.doneBtn]}
                    onPress={() => handleCheckIn(task, "done")}
                  >
                    <Text style={styles.doneBtnText}>✓ Done</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.statusBtn, styles.missBtn]}
                    onPress={() => handleCheckIn(task, "missed")}
                  >
                    <Text style={styles.missBtnText}>Missed it</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        );
      })}

      <Text style={styles.sectionHeader}>Recent Activity</Text>
      {feed.slice(0, 5).map((item) => (
        <View key={item.id} style={styles.feedRow}>
          <Text style={styles.feedText}>
            <Text style={{ fontWeight: "700" }}>{item.userName}</Text> {item.text}
          </Text>
          <Text style={styles.feedMeta}>{item.groupName} · {item.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  greeting: { color: colors.text, fontSize: 26, fontWeight: "700" },
  subheader: { color: colors.textMuted, fontSize: 14, marginTop: spacing.xs, marginBottom: spacing.lg },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
  },
  taskTitle: { color: colors.text, fontSize: 15, fontWeight: "600" },
  taskMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  chevron: { color: colors.textMuted },
  expandArea: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  noteInput: {
    backgroundColor: colors.surfaceLight,
    color: colors.text,
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusRow: { flexDirection: "row", gap: spacing.sm },
  statusBtn: { flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md, alignItems: "center" },
  doneBtn: { backgroundColor: colors.primary },
  doneBtnText: { color: colors.background, fontWeight: "700" },
  missBtn: { backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.danger },
  missBtnText: { color: colors.danger, fontWeight: "600" },
  sectionHeader: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  feedRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  feedText: { color: colors.text, fontSize: 13 },
  feedMeta: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
});
