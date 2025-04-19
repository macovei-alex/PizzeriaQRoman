import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import useColorTheme from "src/hooks/useColorTheme";
import OrderHistoryScreen from "src/screens/profile/OrderHistoryScreen";
import SvgIcons from "src/components/svg/SvgIcons";
import { StyleSheet } from "react-native";
import MenuStackNavigator from "./MenuStackNavigator";
import CartStackNavigator from "./CartStackNavigator";
import LoginScreen from "src/screens/login/LoginScreen";

const routeToIconMap: Readonly<Record<string, string>> = {
  LoginScreen: "search",
  MenuStackNavigator: "home",
  CartStackNavigator: "cart",
  ProfileScreen: "profile",
  ConsoleScreen: "search",
  TestScreen: "search",
};

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const colorTheme = useColorTheme();

  const svgColors = {
    stroke: colorTheme.text.primary,
    fillPrimary: colorTheme.background.primary,
    fillSecondary: colorTheme.background.primary,
  };

  return (
    <Tab.Navigator
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
      <Tab.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
      <Tab.Screen name="MenuStackNavigator" component={MenuStackNavigator} options={{ title: "Meniu" }} />
      <Tab.Screen name="CartStackNavigator" component={CartStackNavigator} options={{ title: "Coș" }} />
      <Tab.Screen name="ProfileScreen" component={OrderHistoryScreen} options={{ title: "Profil" }} />
      {/* <Tab.Screen name="ConsoleScreen" component={ConsoleScreen} options={{ title: "Console" }} /> */}
      {/* <Tab.Screen name="TestScreen" component={TestScreen} options={{ title: "Test" }} /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
});
