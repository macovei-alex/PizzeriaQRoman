import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CartItem, useCartContext } from "@/context/useCartContext";
import CartItemCard from "./CartItemCard";
import useColorTheme from "@/hooks/useColorTheme";
import logger from "@/utils/logger";

function calculatePrice(item: CartItem) {
  const optionLists = Object.entries(item.options);
  console.log(JSON.stringify(optionLists));
  return item.product.price * item.count;
}

export default function ProductSection() {
  logger.render("ProductSection");

  const colorTheme = useColorTheme();
  const { cart } = useCartContext();

  const totalPrice = cart.reduce((total, cartItem) => total + calculatePrice(cartItem), 0);

  return (
    <>
      {cart.map((cartItem) => (
        <CartItemCard key={cartItem.id} cartItem={cartItem} />
      ))}
      <View style={styles.totalPriceContainerContainer}>
        <View style={[styles.totalPriceContainer, { backgroundColor: colorTheme.background.accent }]}>
          <Text style={[styles.totalPriceText, { color: colorTheme.text.onAccent }]}>
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
