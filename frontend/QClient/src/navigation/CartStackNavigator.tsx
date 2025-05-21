import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "src/screens/cart/CartScreen";
import ProductScreen from "src/screens/shared/ProductScreen";
import { CartItemId } from "src/context/CartContext/types";
import { ProductId } from "src/api/types/Product";

export type CartStackParamList = {
  CartScreen: undefined;
  ProductScreen: { productId: ProductId; cartItemId: CartItemId };
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
