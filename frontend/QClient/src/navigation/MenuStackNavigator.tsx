import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MenuScreen from "src/screens/menu/MenuScreen";
import ProductScreen from "src/screens/shared/ProductScreen";

export type MenuStackParamList = {
  MenuScreen: undefined;
  ProductScreen: { productId: string };
  SkeletonLoaderTestScreen: undefined;
};

const MenuStack = createNativeStackNavigator<MenuStackParamList>();

export default function MenuStackNavigator() {
  return (
    <MenuStack.Navigator screenOptions={{ headerShown: false }}>
      <MenuStack.Screen name="MenuScreen" component={MenuScreen} />
      <MenuStack.Screen name="ProductScreen" component={ProductScreen} />
    </MenuStack.Navigator>
  );
}
