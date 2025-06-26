import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useCartContext } from "src/context/CartContext/CartContext";
import CartItemCard from "./CartItemCard";
import logger from "src/utils/logger";
import { formatPrice } from "src/utils/utils";
import { CartItem } from "src/context/CartContext/types";

function calculatePrice(item: CartItem) {
  let price = item.product.price;
  for (const [optionListId, optionList] of Object.entries(item.options)) {
    for (const [optionId, optionCount] of Object.entries(optionList)) {
      const list = item.product.optionLists.find((list) => list.id === Number(optionListId));
      if (!list) {
        throw new Error(`Option list not found: ${optionListId}`);
      }
      const option = list.options.find((option) => option.id === Number(optionId));
      if (!option) {
        throw new Error(`Option not found: ${optionId}`);
      }

      price += option.price * optionCount;
    }
  }
  return price * item.count;
}

export default function ProductSection() {
  logger.render("ProductSection");

  const { cart } = useCartContext();

  const prices = cart.map((cartItem) => calculatePrice(cartItem));
  const totalPrice = prices.reduce((acc, price) => acc + price, 0);

  return (
    <>
      {cart.map((cartItem, index) => (
        <CartItemCard key={cartItem.id} cartItem={cartItem} price={prices[index]} />
      ))}
      <View style={styles.totalPriceContainerContainer}>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>{"Total de comandă: " + formatPrice(totalPrice)}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create((theme) => ({
  totalPriceContainerContainer: {
    alignItems: "center",
  },
  totalPriceContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 18,
    marginVertical: 16,
    backgroundColor: theme.background.accent,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.text.onAccent,
  },
}));
