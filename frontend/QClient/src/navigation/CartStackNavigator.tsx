import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "src/screens/cart/CartScreen";
import ProductScreen from "src/screens/shared/ProductScreen";

export type CartStackParamList = {
  CartScreen: undefined;
  ProductScreen: { productId: string; cartItemId: string };
};

const CartStack = createNativeStackNavigator<CartStackParamList>();

export default function CartStackNavigator() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="ProductScreen" component={ProductScreen} />
    </CartStack.Navigator>
  );
}
