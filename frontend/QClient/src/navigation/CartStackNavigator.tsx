import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "src/screens/cart/CartScreen";
import ProductScreen from "src/screens/shared/ProductScreen";
import ConfirmationScreen from "src/screens/cart/ConfirmationScreen";

export type CartStackParamList = {
  CartScreen: undefined;
  ProductScreen: { productId: string; cartItemId: string };
  ConfirmationScreen: undefined;
};

const CartStack = createNativeStackNavigator<CartStackParamList>();

export default function CartStackNavigator() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="ProductScreen" component={ProductScreen} />
      <CartStack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
    </CartStack.Navigator>
  );
}
