import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";
import { colors, spacing, radius } from "../theme/theme";

// Tier-2 "pop": a colored shine bar + soft glow, clearly one notch down
// from the leaderboard's full gradient treatment. `accent` lets the same
// card read as either a group goal (Titan Green) or a personal goal
// (brushed steel) without duplicating the component.
export default function GoalCard({ goal, accent = colors.primary }) {
  return (
    <View style={[styles.card, { borderColor: accent, shadowColor: accent }]}>
      <View style={[styles.shine, { backgroundColor: accent }]} />
      <View style={styles.headerRow}>
        <Text style={styles.title}>{goal.title}</Text>
        <Text style={[styles.count, { color: accent }]}>
          {goal.progressThisWeek}/{goal.targetPerWeek}
        </Text>
      </View>
      <ProgressBar progress={goal.progressThisWeek} total={goal.targetPerWeek} color={accent} />
      {goal.cadence && <Text style={styles.cadence}>{goal.cadence} goal</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    // Soft glow, a clear step down from the leaderboard's stronger shadow.
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  shine: {
    position: "absolute",
    top: -1,
    left: -1,
    right: -1,
    height: 3,
    borderTopLeftRadius: radius.md,
    borderTopRightRadius: radius.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  count: {
    fontWeight: "700",
  },
  cadence: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
    textTransform: "capitalize",
  },
});
