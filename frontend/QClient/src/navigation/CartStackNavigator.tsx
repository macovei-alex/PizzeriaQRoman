import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "@/screens/cart/CartScreen";
import ProductScreen from "@/screens/shared/ProductScreen";
import ConfirmationScreen from "@/screens/cart/ConfirmationScreen";

const CartStack = createNativeStackNavigator();

export default function CartStackNavigator() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartScreen" component={CartScreen} />
      <CartStack.Screen name="ProductScreen" component={ProductScreen} />
      <CartStack.Screen name="ConfirmationScreen" component={ConfirmationScreen} />
    </CartStack.Navigator>
  );
}
