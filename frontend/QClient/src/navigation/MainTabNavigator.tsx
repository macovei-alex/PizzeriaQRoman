import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SvgIcons from "src/components/svg/SvgIcons";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
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

const ColoredSvgIcons = withUnistyles(SvgIcons, (theme) => ({
  stroke: theme.text.primary,
  fillPrimary: theme.background.primary,
  fillSecondary: theme.background.primary,
}));

export default function MainTabNavigator() {
  return (
    <MainTab.Navigator
      screenOptions={({ navigation, route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          return <ColoredSvgIcons name={routeToIconMap[route.name]} />;
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

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    backgroundColor: theme.background.navbar,
  },
}));
