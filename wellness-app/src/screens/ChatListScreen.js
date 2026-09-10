import React from "react";
import { View, Text, StyleSheet, Pressable, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../data/AppStore";
import { colors, spacing, radius, fonts } from "../theme/theme";

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ChatListScreen({ navigation }) {
  const { groups, chatMessages, readCounts } = useAppStore();

  function openGroup(group) {
    navigation.navigate("ChatThread", { groupId: group.id, groupName: group.name });
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>Chats</Text>
      <FlatList
        data={groups}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: group }) => {
          const messages = chatMessages[group.id] || [];
          const lastMessage = messages[messages.length - 1];
          const unreadCount = Math.max(messages.length - (readCounts[group.id] || 0), 0);

          return (
            <Pressable
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
              onPress={() => openGroup(group)}
            >
              <View style={styles.avatar}>
                {/* TODO: swap for the group's real photo once uploads are wired up */}
                <Text style={styles.avatarText}>{initials(group.name)}</Text>
              </View>
              <View style={styles.rowBody}>
                <View style={styles.rowTop}>
                  <Text style={styles.groupName} numberOfLines={1}>
                    {group.name}
                  </Text>
                  {lastMessage && <Text style={styles.time}>{lastMessage.time}</Text>}
                </View>
                <Text style={styles.memberCount}>{group.members.length} members</Text>
              </View>
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 34,
    letterSpacing: 0.5,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowPressed: { backgroundColor: colors.surfaceLight },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  avatarText: { color: colors.onPrimary, fontWeight: "700", fontSize: 15 },
  rowBody: { flex: 1, marginRight: spacing.sm },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  groupName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 19,
    letterSpacing: 0.3,
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  time: { color: colors.textMuted, fontSize: 11 },
  memberCount: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
    marginRight: spacing.sm,
  },
  badgeText: { color: colors.onPrimary, fontSize: 11, fontWeight: "700" },
});
