import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MainTabNavigator, { MainTabParamList } from "./MainTabNavigator";
import OrderConfirmationScreen from "src/screens/shared/global/OrderConfirmationScreen";
import { NavigatorScreenParams } from "@react-navigation/native";
import ChatScreen from "src/screens/shared/global/ChatScreen";
import OrderDeliveryScreen from "src/screens/shared/global/OrderDeliveryScreen";
import NewAddressScreen from "src/screens/shared/global/NewAddressScreen";
import AddressesScreen from "src/screens/shared/global/AddressesScreen";

export type RootStackParamList = {
  MainTabNavigator: NavigatorScreenParams<MainTabParamList>;
  AddressesScreen: undefined;
  NewAddressScreen: undefined;
  OrderConfirmationScreen: undefined;
  ChatScreen: undefined;
  OrderDeliveryScreen: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="MainTabNavigator" component={MainTabNavigator} />
      <RootStack.Screen
        name="AddressesScreen"
        component={AddressesScreen}
        options={{ presentation: "modal" }}
      />
      <RootStack.Screen
        name="OrderConfirmationScreen"
        component={OrderConfirmationScreen}
        options={{ presentation: "fullScreenModal" }}
      />
      <RootStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ presentation: "fullScreenModal" }}
      />
      <RootStack.Screen
        name="OrderDeliveryScreen"
        component={OrderDeliveryScreen}
        options={{ presentation: "fullScreenModal" }}
      />
      <RootStack.Screen
        name="NewAddressScreen"
        component={NewAddressScreen}
        options={{ presentation: "modal" }}
      />
    </RootStack.Navigator>
  );
}
