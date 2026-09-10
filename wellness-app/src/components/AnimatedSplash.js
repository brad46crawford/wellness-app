import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "../theme/theme";

// Bare, static (no animation) — this is what expo-splash-screen shows
// natively the instant the app launches, before any JS has run. It just
// matches the app background so there's no flash/mismatch when this
// component takes over.
const FADE_IN_MS = 550; // unchanged — the original fade/scale-in
const PLAIN_HOLD_MS = 550; // sit still before the shine sweep starts
const SHINE_MS = 450; // the light streak sweeping across the text
// Intro itself runs ~1.55s, then App.js cross-fades this out while the
// app fades in underneath it (see CROSSFADE_MS there) — no separate
// fade-out happens here, so the two don't stack into two fades in a row.

export default function AnimatedSplash({ appName, onFinish }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;
  const shine = useRef(new Animated.Value(0)).current;
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });

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
      Animated.delay(PLAIN_HOLD_MS),
      Animated.timing(shine, {
        toValue: 1,
        duration: SHINE_MS,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
    // Runs once on mount — this screen is shown exactly one time per launch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const barWidth = Math.max(textSize.width * 0.45, 40);
  const shineTranslateX = shine.interpolate({
    inputRange: [0, 1],
    outputRange: [-barWidth, textSize.width + barWidth],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <View
          style={styles.textWrap}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setTextSize({ width, height });
          }}
        >
          <Text style={styles.title}>{appName}</Text>

          {/* The streak: clipped to the text's own bounding box so it
              reads as light passing over the word, not a bar over the
              background. The word itself never moves. */}
          {textSize.width > 0 && (
            <View pointerEvents="none" style={styles.clip}>
              <Animated.View
                style={[
                  styles.shineBar,
                  {
                    width: barWidth,
                    height: textSize.height,
                    transform: [{ translateX: shineTranslateX }],
                  },
                ]}
              >
                <LinearGradient
                  colors={["transparent", "rgba(255,255,255,0.9)", "transparent"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          )}
        </View>
      </Animated.View>
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
  textWrap: {
    position: "relative",
  },
  clip: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  shineBar: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
