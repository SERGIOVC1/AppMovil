import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { AddScreen } from "./AddScreen.js"
import { SettingScreen } from "./SettingScreen.js"
import { HomeScreen } from "./HomeScreen.js"
import { Image } from 'react-native';


export function TabNavegation() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#282828" },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tab.Screen
        name="Publicaciones"
        component={HomeScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
  name="Add"
  component={AddScreen}
  options={{
    tabBarIcon: ({ color, size }) => (
      <Image
        source={require('../img/add.png')} // Replace with your image path
        style={{ width: size, height: size }}
      />
    ),
  }}
/>
    </Tab.Navigator>
  );
}
