import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../data/AppStore";
import { colors, spacing, radius, fonts } from "../theme/theme";

export default function ChatThreadScreen({ route, navigation }) {
  const { groupId, groupName } = route.params;
  const { chatMessages, sendMessage, markGroupRead, currentUser } = useAppStore();
  const [draft, setDraft] = useState("");

  const messages = chatMessages[groupId] || [];

  // Clear this group's unread badge whenever its thread is on screen
  // (first open, and again if new messages arrive while you're in it).
  useFocusEffect(
    useCallback(() => {
      markGroupRead(groupId);
    }, [groupId, messages.length])
  );

  function handleSend() {
    if (draft.trim().length === 0) return;
    sendMessage(groupId, draft.trim());
    setDraft("");
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {groupName}
          </Text>
          <View style={styles.backBtn} />
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: spacing.lg }}
          renderItem={({ item }) => {
            if (item.type === "system") {
              return (
                <View style={styles.systemRow}>
                  <Text
                    style={[
                      styles.systemText,
                      item.status === "missed" && styles.systemTextMissed,
                    ]}
                  >
                    {item.text}
                  </Text>
                </View>
              );
            }

            const isMe = item.userId === currentUser.id;
            const isPhoto = item.type === "photo";
            return (
              <View style={[styles.bubbleRow, isMe && styles.bubbleRowMe]}>
                <View
                  style={[
                    styles.bubble,
                    isMe && styles.bubbleMe,
                    isPhoto && styles.photoBubble,
                  ]}
                >
                  {!isMe && <Text style={styles.senderName}>{item.userName}</Text>}
                  {isPhoto ? (
                    <>
                      <Image source={{ uri: item.imageUri }} style={styles.photo} />
                      {item.caption && (
                        <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe, styles.caption]}>
                          {item.caption}
                        </Text>
                      )}
                    </>
                  ) : (
                    <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
                      {item.text}
                    </Text>
                  )}
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No messages yet — say hi to {groupName}!</Text>
          }
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={`Message ${groupName}`}
            placeholderTextColor={colors.textMuted}
            value={draft}
            onChangeText={setDraft}
          />
          <Pressable style={styles.sendBtn} onPress={handleSend}>
            <Text style={styles.sendBtnText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  backBtn: { width: 34, alignItems: "flex-start", justifyContent: "center" },
  headerTitle: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    letterSpacing: 0.3,
    textAlign: "center",
  },
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
  photoBubble: { padding: spacing.xs },
  photo: {
    width: 220,
    height: 220,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceLight,
  },
  caption: { marginTop: spacing.xs, paddingHorizontal: spacing.xs },
  senderName: { color: colors.primaryLight, fontSize: 11, fontWeight: "700", marginBottom: 2 },
  bubbleText: { color: colors.text, fontSize: 14 },
  bubbleTextMe: { color: colors.onPrimary },
  timeText: { color: colors.textMuted, fontSize: 10, marginTop: 4, alignSelf: "flex-end" },
  systemRow: { alignItems: "center", marginBottom: spacing.sm },
  systemText: {
    color: colors.primaryLight,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    overflow: "hidden",
  },
  systemTextMissed: { color: colors.danger },
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
  sendBtnText: { color: colors.onPrimary, fontWeight: "700" },
});
