import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "@/screens/menu/MenuScreen";
import ProductScreen from "@/screens/shared/ProductScreen";
import SkeletonLoaderTestScreen from "@/screens/menu/SkeletonLoaderTestScreen";

const MenuStack = createNativeStackNavigator();

export default function MenuStackNavigator() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuScreen" component={MenuScreen} />
      <MenuStack.Screen name="ProductScreen" component={ProductScreen} />
      <MenuStack.Screen name="SkeletonLoaderTestScreen" component={SkeletonLoaderTestScreen} />
    </MenuStack.Navigator>
  );
}
