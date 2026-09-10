import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, radius, fonts } from "../theme/theme";

// Top-3 get a medal + a distinct shade pulled from the existing Titan
// Green family, so rank reads instantly without leaving the palette.
const RANK_STYLE = [
  { medal: "🥇", badgeColor: colors.primary, textColor: colors.onPrimary },
  { medal: "🥈", badgeColor: colors.primaryLight, textColor: colors.onPrimary },
  { medal: "🥉", badgeColor: colors.primaryDark, textColor: colors.onPrimary },
];

export default function LeaderboardCard({ group, standings, currentUserId }) {
  // Index where the tier flips from "zero misses" to "has a miss", so we
  // can drop a divider + fade right at that boundary.
  const firstImperfectIndex = standings.findIndex((row) => row.missed > 0);

  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0.9 }}
      style={styles.card}
    >
      <Text style={styles.groupName}>{group.name}</Text>
      {standings.map((row, index) => {
        const rankStyle = RANK_STYLE[index];
        const isBelowTheLine = firstImperfectIndex !== -1 && index >= firstImperfectIndex;
        const showDivider = index === firstImperfectIndex;

        return (
          <React.Fragment key={row.userId}>
            {showDivider && (
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerLabel}>missed one this week</Text>
                <View style={styles.dividerLine} />
              </View>
            )}
            <View
              style={[
                styles.row,
                index === standings.length - 1 && styles.rowLast,
                isBelowTheLine && styles.rowFaded,
              ]}
            >
              <View
                style={[
                  styles.rankBadge,
                  rankStyle && { backgroundColor: rankStyle.badgeColor },
                ]}
              >
                {rankStyle ? (
                  <Text style={styles.medal}>{rankStyle.medal}</Text>
                ) : (
                  <Text style={styles.rankNumber}>{index + 1}</Text>
                )}
              </View>
              <Text style={styles.name} numberOfLines={1}>
                {row.name}
                {row.userId === currentUserId ? " (You)" : ""}
                {row.isOnStreak ? " 🔥" : ""}
              </Text>
              <Text style={styles.count}>{row.completed}</Text>
            </View>
          </React.Fragment>
        );
      })}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    // Green glow so the leaderboard visibly pops off the dark background.
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 10,
  },
  groupName: {
    color: colors.text,
    fontFamily: fonts.heading,
    fontSize: 20,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  rowLast: { borderBottomWidth: 0 },
  rowFaded: { opacity: 0.55 },
  rankBadge: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  medal: { fontSize: 14 },
  rankNumber: { color: colors.textMuted, fontSize: 12, fontWeight: "700" },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    marginRight: spacing.sm,
  },
  count: {
    color: colors.onPrimary,
    fontWeight: "700",
    fontSize: 15,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.xs,
    gap: spacing.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.12)" },
  dividerLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
