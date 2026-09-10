import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAppStore } from "../data/AppStore";
import { colors, spacing, radius } from "../theme/theme";

export default function ChatScreen() {
  const { groups, chatMessages, sendMessage, currentUser } = useAppStore();
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  const activeGroup = groups.find((g) => g.id === activeGroupId);
  const messages = chatMessages[activeGroupId] || [];

  function handleSend() {
    if (draft.trim().length === 0) return;
    sendMessage(activeGroupId, draft.trim());
    setDraft("");
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.groupTabs}>
        {groups.map((g) => (
          <Pressable
            key={g.id}
            style={[styles.groupTab, g.id === activeGroupId && styles.groupTabActive]}
            onPress={() => setActiveGroupId(g.id)}
          >
            <Text
              style={[
                styles.groupTabText,
                g.id === activeGroupId && styles.groupTabTextActive,
              ]}
              numberOfLines={1}
            >
              {g.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg }}
        renderItem={({ item }) => {
          const isMe = item.userId === currentUser.id;
          return (
            <View style={[styles.bubbleRow, isMe && styles.bubbleRowMe]}>
              <View style={[styles.bubble, isMe && styles.bubbleMe]}>
                {!isMe && <Text style={styles.senderName}>{item.userName}</Text>}
                <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                  {item.text}
                </Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No messages yet — say hi to {activeGroup?.name}!</Text>
        }
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder={`Message ${activeGroup?.name ?? ""}`}
          placeholderTextColor={colors.textMuted}
          value={draft}
          onChangeText={setDraft}
        />
        <Pressable style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendBtnText}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  groupTabs: {
    flexDirection: "row",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  groupTab: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  groupTabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  groupTabText: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  groupTabTextActive: { color: colors.background },
  bubbleRow: { flexDirection: "row", marginBottom: spacing.sm },
  bubbleRowMe: { justifyContent: "flex-end" },
  bubble: {
    maxWidth: "78%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleMe: { backgroundColor: colors.primaryDark, borderColor: colors.primaryDark },
  senderName: { color: colors.primary, fontSize: 11, fontWeight: "700", marginBottom: 2 },
  bubbleText: { color: colors.text, fontSize: 14 },
  bubbleTextMe: { color: colors.background },
  timeText: { color: colors.textMuted, fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  emptyText: { color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
  inputRow: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  sendBtnText: { color: colors.background, fontWeight: "700" },
});
