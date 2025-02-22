import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "src/screens/menu/MenuScreen";
import ProductScreen from "src/screens/shared/ProductScreen";
import SkeletonLoaderTestScreen from "src/screens/menu/SkeletonLoaderTestScreen";

export type MenuStackParamList = {
  MenuScreen: undefined;
  ProductScreen: { productId: string; imageName: string };
  SkeletonLoaderTestScreen: undefined;
};

const MenuStack = createNativeStackNavigator<MenuStackParamList>();

export default function MenuStackNavigator() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuScreen" component={MenuScreen} />
      <MenuStack.Screen name="ProductScreen" component={ProductScreen} />
      <MenuStack.Screen name="SkeletonLoaderTestScreen" component={SkeletonLoaderTestScreen} />
    </MenuStack.Navigator>
  );
}
