import React, { useEffect, useState } from "react";
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
// hand off to AnimatedSplash (below) for the actual fade/scale intro.
SplashScreen.preventAutoHideAsync();

// Pulled from app.json's "name" at runtime (not hardcoded) so renaming
// the app later is a one-line change there.
const APP_NAME = Constants.expoConfig?.name ?? "Ascera";

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  if (!introDone) {
    return <AnimatedSplash appName={APP_NAME} onFinish={() => setIntroDone(true)} />;
  }

  return (
    <SafeAreaProvider>
      <AppStoreProvider>
        <StatusBar style="light" />
        <RootNavigation />
      </AppStoreProvider>
    </SafeAreaProvider>
  );
}
