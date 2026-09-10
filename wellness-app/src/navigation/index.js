import React from "react";
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatThreadScreen from "../screens/ChatThreadScreen";
import GoalsScreen from "../screens/GoalsScreen";
import ExploreScreen from "../screens/ExploreScreen";
import { colors } from "../theme/theme";

const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

const ICONS = {
  Home: "home",
  Chat: "chatbubbles",
  Goals: "flag",
  Explore: "compass",
};

const tabBarStyle = { backgroundColor: colors.surface, borderTopColor: colors.border };

function ChatStackScreen() {
  return (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
      <ChatStack.Screen name="ChatList" component={ChatListScreen} />
      <ChatStack.Screen name="ChatThread" component={ChatThreadScreen} />
    </ChatStack.Navigator>
  );
}

export default function RootNavigation() {
  return (
    <NavigationContainer
      theme={{
        dark: true,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primaryLight,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={ICONS[route.name]} size={size} color={color} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen
          name="Chat"
          component={ChatStackScreen}
          options={({ route }) => {
            const focusedRoute = getFocusedRouteNameFromRoute(route) ?? "ChatList";
            return {
              tabBarStyle: focusedRoute === "ChatThread" ? { display: "none" } : tabBarStyle,
            };
          }}
        />
        <Tab.Screen name="Goals" component={GoalsScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
