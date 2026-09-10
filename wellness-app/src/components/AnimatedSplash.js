import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { colors, fonts } from "../theme/theme";

// Bare, static (no animation) — this is what expo-splash-screen shows
// natively the instant the app launches, before any JS has run. It just
// matches the app background so there's no flash/mismatch when this
// component takes over.
const FADE_IN_MS = 550;
const HOLD_MS = 500;
const FADE_OUT_MS = 300;
// Total: ~1.35s, comfortably under the 2s budget.

export default function AnimatedSplash({ appName, onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_IN_MS,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: FADE_IN_MS,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(HOLD_MS),
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
    // Runs once on mount — this screen is shown exactly one time per launch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[styles.title, { opacity, transform: [{ scale }] }]}
      >
        {appName}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 56,
    color: colors.primary,
    letterSpacing: 3,
  },
});
