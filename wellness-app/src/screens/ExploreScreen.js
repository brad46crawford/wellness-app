import React, { useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../data/AppStore";
import ExploreCard from "../components/ExploreCard";
import { colors, spacing, radius, fonts } from "../theme/theme";

export default function ExploreScreen() {
  const {
    exploreGoals,
    getSavedExploreGoals,
    likeExploreGoal,
    saveExploreGoal,
    echoExploreGoal,
    addExploreComment,
  } = useAppStore();
  const [tab, setTab] = useState("discover"); // "discover" | "saved"

  const posts = tab === "discover" ? exploreGoals : getSavedExploreGoals();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>Explore</Text>

      <View style={styles.tabRow}>
        <Pressable
          style={[styles.tabBtn, tab === "discover" && styles.tabBtnActive]}
          onPress={() => setTab("discover")}
        >
          <Text style={[styles.tabText, tab === "discover" && styles.tabTextActive]}>
            Discover
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tabBtn, tab === "saved" && styles.tabBtnActive]}
          onPress={() => setTab("saved")}
        >
          <Text style={[styles.tabText, tab === "saved" && styles.tabTextActive]}>
            Saved
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(post) => post.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ExploreCard
            post={item}
            onLike={() => likeExploreGoal(item.id)}
            onSave={() => saveExploreGoal(item.id)}
            onEcho={() => echoExploreGoal(item.id)}
            onComment={(text) => addExploreComment(item.id, text)}
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {tab === "saved"
              ? "Nothing saved yet — tap the bookmark on a post to keep it here."
              : "Nothing to explore yet."}
          </Text>
        }
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
    paddingBottom: spacing.sm,
  },
  tabRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  tabBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.textMuted, fontSize: 13, fontWeight: "600" },
  tabTextActive: { color: colors.onPrimary },
  listContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  emptyText: { color: colors.textMuted, textAlign: "center", marginTop: spacing.xl },
});
