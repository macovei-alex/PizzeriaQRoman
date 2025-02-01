import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CartContextType, useCartContext } from "../../../context/useCartContext";
import CartItemCard from "./CartItemCard";
import useColorTheme from "../../../hooks/useColorTheme";

export default function ProductSection() {
  const { cart } = useCartContext() as CartContextType;
  const colorTheme = useColorTheme();

  const totalPrice = cart.reduce((total, cartItem) => total + cartItem.product.price * cartItem.count, 0);

  return (
    <>
      {cart.map((cartItem) => (
        <CartItemCard key={cartItem.product.id} cartItem={cartItem} />
      ))}
      <View style={styles.totalPriceContainerContainer}>
        <View style={[styles.totalPriceContainer, { backgroundColor: colorTheme.background[500] }]}>
          <Text style={[styles.totalPriceText, { color: colorTheme.text[300] }]}>
            Total de plată: {totalPrice.toFixed(2)} RON
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  totalPriceContainerContainer: {
    alignItems: "center",
  },
  totalPriceContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
  },
  totalPriceText: {
    fontSize: 17,
    fontWeight: "bold",
  },
});
