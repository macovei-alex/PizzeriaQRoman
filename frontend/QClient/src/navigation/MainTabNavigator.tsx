import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import useColorTheme from "src/hooks/useColorTheme";
import SvgIcons from "src/components/svg/SvgIcons";
import { StyleSheet } from "react-native";
import MenuStackNavigator, { MenuStackParamList } from "./MenuStackNavigator";
import CartStackNavigator, { CartStackParamList } from "./CartStackNavigator";
import ProfileStackNavigator, { ProfileStackParamList } from "./ProfileStackNavigator";
import { NavigatorScreenParams } from "@react-navigation/native";

const routeToIconMap: Readonly<Record<string, string>> = {
  MenuStackNavigator: "home",
  CartStackNavigator: "cart",
  ProfileStackNavigator: "profile",
  ConsoleScreen: "search",
  TestScreen: "search",
};

export type MainTabParamList = {
  MenuStackNavigator: NavigatorScreenParams<MenuStackParamList>;
  CartStackNavigator: NavigatorScreenParams<CartStackParamList>;
  ProfileStackNavigator: NavigatorScreenParams<ProfileStackParamList>;
};

const MainTab = createBottomTabNavigator();

export default function MainTabNavigator() {
  const colorTheme = useColorTheme();

  const svgColors = {
    stroke: colorTheme.text.primary,
    fillPrimary: colorTheme.background.primary,
    fillSecondary: colorTheme.background.primary,
  };

  return (
    <MainTab.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
        tabBarStyle: [styles.tabBar, { backgroundColor: colorTheme.background.navbar }],
        tabBarIcon: ({ focused, color, size }) => {
          return (
            <SvgIcons
              name={routeToIconMap[route.name]}
              stroke={svgColors.stroke}
              fillPrimary={svgColors.fillPrimary}
              fillSecondary={svgColors.fillSecondary}
            />
          );
        },
      })}
    >
      <MainTab.Screen name="MenuStackNavigator" component={MenuStackNavigator} options={{ title: "Meniu" }} />
      <MainTab.Screen name="CartStackNavigator" component={CartStackNavigator} options={{ title: "Coș" }} />
      <MainTab.Screen
        name="ProfileStackNavigator"
        component={ProfileStackNavigator}
        options={{ title: "Profil" }}
      />
      {/* <Tab.Screen name="ConsoleScreen" component={ConsoleScreen} options={{ title: "Console" }} /> */}
      {/* <Tab.Screen name="TestScreen" component={TestScreen} options={{ title: "Test" }} /> */}
    </MainTab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
});
