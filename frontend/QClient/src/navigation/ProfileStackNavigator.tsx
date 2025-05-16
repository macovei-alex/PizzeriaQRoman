import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderHistoryScreen from "src/screens/profile/OrderHistoryScreen";
import ProfileScreen from "src/screens/profile/ProfileScreen";
import FullOrderScreen from "src/screens/profile/FullOrderScreen";
import { OrderId } from "src/api/types/order/Order";
import OrderItemScreen from "src/screens/profile/OrderItemScreen";
import OrderDeliveryScreen from "src/screens/profile/OrderDeliveryScreen";

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  OrderHistoryScreen: undefined;
  FullOrderScreen: { orderId: OrderId };
  OrderItemScreen: { orderId: number; itemId: number };
  OrderDeliveryScreen: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <ProfileStack.Screen name="FullOrderScreen" component={FullOrderScreen} />
      <ProfileStack.Screen name="OrderItemScreen" component={OrderItemScreen} />
      <ProfileStack.Screen name="OrderDeliveryScreen" component={OrderDeliveryScreen} />
    </ProfileStack.Navigator>
  );
}
