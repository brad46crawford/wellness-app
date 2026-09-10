import React, { useState } from "react";
import { View, Text, FlatList, Pressable, Modal, StyleSheet } from "react-native";
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
    addExploreComment,
    addExploreGoalToTracked,
    groups,
  } = useAppStore();
  const [tab, setTab] = useState("discover"); // "discover" | "saved"
  const [addPickerPost, setAddPickerPost] = useState(null);

  const posts = tab === "discover" ? exploreGoals : getSavedExploreGoals();

  function handleChooseDestination(destination) {
    if (!addPickerPost) return;
    addExploreGoalToTracked(addPickerPost.id, destination);
    setAddPickerPost(null);
  }

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
            onComment={(text) => addExploreComment(item.id, text)}
            onAdd={tab === "saved" ? () => setAddPickerPost(item) : undefined}
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

      <Modal
        visible={addPickerPost !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setAddPickerPost(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add to...</Text>
            <Text style={styles.modalSubtitle} numberOfLines={2}>
              "{addPickerPost?.title}"
            </Text>

            <Pressable
              style={styles.destinationRow}
              onPress={() => handleChooseDestination("personal")}
            >
              <Text style={styles.destinationText}>Personal Goals</Text>
            </Pressable>

            {groups.map((group) => (
              <Pressable
                key={group.id}
                style={styles.destinationRow}
                onPress={() => handleChooseDestination(group.id)}
              >
                <Text style={styles.destinationText}>{group.name}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.cancelBtn} onPress={() => setAddPickerPost(null)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  destinationRow: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  destinationText: { color: colors.text, fontSize: 15, fontWeight: "600" },
  cancelBtn: {
    paddingVertical: spacing.sm,
    alignItems: "center",
    marginTop: spacing.xs,
  },
  cancelBtnText: { color: colors.textMuted, fontWeight: "600" },
});
