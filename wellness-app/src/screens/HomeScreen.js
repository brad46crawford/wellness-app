import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useAppStore } from "../data/AppStore";
import LeaderboardCard from "../components/LeaderboardCard";
import { colors, spacing, radius, fonts } from "../theme/theme";

export default function HomeScreen({ navigation }) {
  const {
    getTodaysTasks,
    getLeaderboard,
    submitCheckIn,
    submitPersonalCheckIn,
    sendGoalPhoto,
    groups,
    currentUser,
  } = useAppStore();
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [note, setNote] = useState("");

  const tasks = getTodaysTasks();
  const myGroups = groups.filter((g) => g.members.some((m) => m.id === currentUser.id));

  function goToThread(task) {
    navigation.navigate("Chat", {
      screen: "ChatThread",
      params: { groupId: task.groupId, groupName: task.groupName },
    });
  }

  async function captureGoalPhoto(task, source) {
    const permission =
      source === "camera"
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Enable camera/photo access in Settings to share proof pics with your group."
      );
      goToThread(task);
      return;
    }

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: "images",
            quality: 0.6,
            allowsEditing: true,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: "images",
            quality: 0.6,
            allowsEditing: true,
          });

    if (!result.canceled && result.assets?.[0]?.uri) {
      sendGoalPhoto(task.groupId, result.assets[0].uri, task.title);
    }
    goToThread(task);
  }

  function promptGoalPhoto(task) {
    Alert.alert(
      "Nice work! 💪",
      `Share a photo of you crushing "${task.title}" with ${task.groupName}?`,
      [
        { text: "Take Photo", onPress: () => captureGoalPhoto(task, "camera") },
        { text: "Choose from Library", onPress: () => captureGoalPhoto(task, "library") },
        { text: "Skip", style: "cancel", onPress: () => goToThread(task) },
      ]
    );
  }

  function handleCheckIn(task, status) {
    if (task.kind === "group") {
      submitCheckIn(task.goalId, task.groupId, task.groupName, task.title, note.trim(), status);
      if (status === "done") {
        promptGoalPhoto(task);
      }
    } else {
      submitPersonalCheckIn(task.goalId, note.trim(), status);
    }
    setExpandedTaskId(null);
    setNote("");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        {myGroups.length > 0 && (
          <View style={styles.leaderboardSection}>
            <Text style={styles.leaderboardLabel}>Leaderboard</Text>
            {myGroups.map((group) => (
              <LeaderboardCard
                key={group.id}
                group={group}
                standings={getLeaderboard(group.id)}
                currentUserId={currentUser.id}
              />
            ))}
          </View>
        )}

        <Text style={styles.tasksLabel}>Today's Tasks</Text>

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  leaderboardSection: {
    // A real section break before the tasks below — clearly more
    // breathing room than the default spacing used elsewhere.
    marginBottom: spacing.xxl,
  },
  leaderboardLabel: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 30,
    letterSpacing: 0.5,
    marginBottom: spacing.md,
  },
  tasksLabel: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  taskCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceLight,
    // A touch of lift so tasks read as tappable cards — clearly more
    // subdued than the leaderboard's glow, though.
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
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
  doneBtnText: { color: colors.onPrimary, fontWeight: "700" },
  missBtn: { backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.danger },
  missBtnText: { color: colors.danger, fontWeight: "600" },
});
