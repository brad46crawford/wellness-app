import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ProgressBar from "./ProgressBar";
import { colors, spacing, radius } from "../theme/theme";

export default function GoalCard({ goal }) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{goal.title}</Text>
        <Text style={styles.count}>
          {goal.progressThisWeek}/{goal.targetPerWeek}
        </Text>
      </View>
      <ProgressBar progress={goal.progressThisWeek} total={goal.targetPerWeek} />
      <Text style={styles.cadence}>{goal.cadence} goal</Text>
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
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
    flexShrink: 1,
    marginRight: spacing.sm,
  },
  count: {
    color: colors.primary,
    fontWeight: "700",
  },
  cadence: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: spacing.xs,
    textTransform: "capitalize",
  },
});
