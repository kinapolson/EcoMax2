import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#264e36",
          height: 70,
          borderTopWidth: 0,
        },

        tabBarBackground: () => {
          return (
            <View
              style={{
                flex: 1,
                backgroundColor: "#264e36",
              }}
            />
          );
        },

        tabBarActiveTintColor: "#5ca377",
        tabBarInactiveTintColor: "#F5F0e6",

        tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 6,
            fontFamily: 'Quicksand_700Bold',
        },
      }}
    >

      {/* home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="home-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      {/* shop */}
      <Tabs.Screen
        name="shop"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="cart-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      {/* scan */}
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="camera-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      {/* rewards */}
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="receipt-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />

      {/* profile */}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => {
            return (
              <Ionicons
                name="person-outline"
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  );
}