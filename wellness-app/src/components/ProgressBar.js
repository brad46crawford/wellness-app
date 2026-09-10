import React from "react";
import { View, StyleSheet } from "react-native";
import { colors, radius } from "../theme/theme";

export default function ProgressBar({ progress, total, color = colors.primary }) {
  const pct = total > 0 ? Math.min(progress / total, 1) : 0;
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
  },
});
