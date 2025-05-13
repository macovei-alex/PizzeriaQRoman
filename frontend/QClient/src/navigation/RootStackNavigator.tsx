import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator, { MainTabParamList } from "./MainTabNavigator";
import AddressesModalScreen from "src/screens/shared/global/AddressesModalScreen";
import OrderConfirmationScreen from "src/screens/shared/global/OrderConfirmationScreen";
import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  MainTabNavigator: NavigatorScreenParams<MainTabParamList>;
  AddressesModalScreen: undefined;
  OrderConfirmationScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      <RootStack.Screen
        name="AddressesModalScreen"
        component={AddressesModalScreen}
        options={{ presentation: "modal" }}
      />
      <RootStack.Screen
        name="OrderConfirmationScreen"
        component={OrderConfirmationScreen}
        options={{ presentation: "fullScreenModal" }}
      />
    </RootStack.Navigator>
  );
}
