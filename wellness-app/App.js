import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import { useFonts, BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { AppStoreProvider } from "./src/data/AppStore";
import RootNavigation from "./src/navigation";
import AnimatedSplash from "./src/components/AnimatedSplash";

// expo-splash-screen only supports a static image/background — it covers
// the gap before any JS has run. Once fonts are ready we hide that and
// hand off to AnimatedSplash (below) for the actual fade/scale/shine intro.
SplashScreen.preventAutoHideAsync();

// Pulled from app.json's "name" at runtime (not hardcoded) so renaming
// the app later is a one-line change there.
const APP_NAME = Constants.expoConfig?.name ?? "Ascera";

// How long the splash-out / app-in cross-fade takes, once the intro
// animation (fade/scale-in, hold, shine) has finished.
const CROSSFADE_MS = 350;

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });
  // The real app is mounted (at opacity 0) as soon as fonts are ready, so
  // it's already rendered and ready to fade in — no extra loading beat.
  const [showSplash, setShowSplash] = useState(true);
  const appOpacity = useRef(new Animated.Value(0)).current;
  const splashOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  function handleIntroFinished() {
    // Cross-fade: splash eases out while the app eases in underneath it,
    // instead of the splash just disappearing.
    Animated.parallel([
      Animated.timing(splashOpacity, {
        toValue: 0,
        duration: CROSSFADE_MS,
        useNativeDriver: true,
      }),
      Animated.timing(appOpacity, {
        toValue: 1,
        duration: CROSSFADE_MS,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setShowSplash(false);
    });
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.root}>
      <Animated.View style={[styles.fill, { opacity: appOpacity }]}>
        <SafeAreaProvider>
          <AppStoreProvider>
            <StatusBar style="light" />
            <RootNavigation />
          </AppStoreProvider>
        </SafeAreaProvider>
      </Animated.View>

      {showSplash && (
        <Animated.View
          pointerEvents="none"
          style={[styles.fill, StyleSheet.absoluteFill, { opacity: splashOpacity }]}
        >
          <AnimatedSplash appName={APP_NAME} onFinish={handleIntroFinished} />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  fill: { flex: 1 },
});
