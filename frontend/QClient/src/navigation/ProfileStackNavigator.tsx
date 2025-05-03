import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import OrderHistoryScreen from "src/screens/profile/OrderHistoryScreen";
import ProfileScreen from "src/screens/profile/ProfileScreen";
import AddressesScreen from "src/screens/profile/AddressesScreen";

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  OrderHistoryScreen: undefined;
  AddressesScreen: undefined;
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <ProfileStack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <ProfileStack.Screen name="AddressesScreen" component={AddressesScreen} />
    </ProfileStack.Navigator>
  );
}
