import React, { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius } from "../theme/theme";

export default function ExploreCard({ post, onLike, onSave, onComment, onAdd }) {
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState("");

  function handleSendComment() {
    if (draft.trim().length === 0) return;
    onComment(draft);
    setDraft("");
  }

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.anonName}>{post.anonName}</Text>
        {post.category && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        )}
      </View>

      <Text style={styles.title}>{post.title}</Text>

      <View style={styles.actionRow}>
        <Pressable style={styles.actionBtn} onPress={onLike}>
          <Ionicons
            name={post.likedByMe ? "heart" : "heart-outline"}
            size={20}
            color={post.likedByMe ? colors.danger : colors.textMuted}
          />
          <Text style={styles.actionCount}>{post.likeCount}</Text>
        </Pressable>

        <Pressable style={styles.actionBtn} onPress={() => setExpanded((v) => !v)}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.textMuted} />
          <Text style={styles.actionCount}>{post.comments.length}</Text>
        </Pressable>

        <Pressable style={styles.actionBtn} onPress={onSave}>
          <Ionicons
            name={post.savedByMe ? "bookmark" : "bookmark-outline"}
            size={18}
            color={post.savedByMe ? colors.primaryLight : colors.textMuted}
          />
          <Text style={styles.actionCount}>{post.saveCount}</Text>
        </Pressable>
      </View>

      {onAdd && (
        <Pressable style={styles.addBtn} onPress={onAdd}>
          <Ionicons name="add-circle-outline" size={16} color={colors.primaryLight} />
          <Text style={styles.addBtnText}>Add to my goals</Text>
        </Pressable>
      )}

      {expanded && (
        <View style={styles.commentsArea}>
          {post.comments.map((comment) => (
            <View key={comment.id} style={styles.commentRow}>
              <Text style={styles.commentAuthor}>{comment.authorName}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          ))}
          {post.comments.length === 0 && (
            <Text style={styles.noComments}>No comments yet — be the first.</Text>
          )}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment"
              placeholderTextColor={colors.textMuted}
              value={draft}
              onChangeText={setDraft}
            />
            <Pressable style={styles.sendBtn} onPress={handleSendComment}>
              <Text style={styles.sendBtnText}>Post</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  anonName: { color: colors.primaryLight, fontSize: 13, fontWeight: "700" },
  categoryPill: {
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  categoryText: { color: colors.textMuted, fontSize: 10, fontWeight: "600" },
  title: { color: colors.text, fontSize: 15, fontWeight: "600", marginBottom: spacing.sm },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingVertical: spacing.xs },
  actionCount: { color: colors.textMuted, fontSize: 12, fontWeight: "600" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  addBtnText: { color: colors.primaryLight, fontWeight: "600", fontSize: 13 },
  commentsArea: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentRow: { marginBottom: spacing.xs },
  commentAuthor: { color: colors.primaryLight, fontSize: 12, fontWeight: "700" },
  commentText: { color: colors.text, fontSize: 13 },
  noComments: { color: colors.textMuted, fontSize: 12, fontStyle: "italic", marginBottom: spacing.xs },
  commentInputRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xs },
  commentInput: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    color: colors.text,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 13,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  sendBtnText: { color: colors.onPrimary, fontWeight: "700", fontSize: 13 },
});
