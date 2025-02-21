import React from "react";
import { Tabs } from "expo-router";
import CartIconSvg from "@/components/svg/CartIconSvg";
import ProfileIconSvg from "@/components/svg/ProfileIconSvg";
import HomeIconSvg from "@/components/svg/HomeIconSvg";
import useColorTheme from "@/hooks/useColorTheme";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  const colorTheme = useColorTheme();

  const svgColors = {
    stroke: colorTheme.text.primary,
    fillPrimary: colorTheme.background.primary,
    fillSecondary: colorTheme.background.primary,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colorTheme.background.navbar }],
      }}
    >
      {/* <Tabs.Screen name="index" options={{ href: null }}></Tabs.Screen> */}
      <Tabs.Screen
        name="menu"
        options={{
          title: "Meniu",
          tabBarIcon: () => (
            <HomeIconSvg
              stroke={svgColors.stroke}
              fillPrimary={svgColors.fillPrimary}
              fillSecondary={svgColors.fillSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Coș",
          tabBarIcon: () => (
            <CartIconSvg
              stroke={svgColors.stroke}
              fillPrimary={svgColors.fillPrimary}
              fillSecondary={svgColors.fillSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: () => (
            <ProfileIconSvg
              stroke={svgColors.stroke}
              fillPrimary={svgColors.fillPrimary}
              fillSecondary={svgColors.fillSecondary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="test"
        options={{
          title: "Test",
          tabBarIcon: () => (
            <CartIconSvg
              stroke={svgColors.stroke}
              fillPrimary={svgColors.fillPrimary}
              fillSecondary={svgColors.fillSecondary}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
});
