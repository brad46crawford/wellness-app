import React from "react";
import { StatusBar } from "expo-status-bar";
import { AppStoreProvider } from "./src/data/AppStore";
import RootNavigation from "./src/navigation";

export default function App() {
  return (
    <AppStoreProvider>
      <StatusBar style="light" />
      <RootNavigation />
    </AppStoreProvider>
  );
}
