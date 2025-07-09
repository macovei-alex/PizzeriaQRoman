import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { useCartContext } from "src/context/CartContext/CartContext";
import CartItemCard from "./CartItemCard";
import logger from "src/constants/logger";
import { formatPrice } from "src/utils/utils";

type ProductSectionProps = {
  totalPrice: number;
  prices: number[];
};

export default function ProductSection({ totalPrice, prices }: ProductSectionProps) {
  logger.render("ProductSection");

  const { cart } = useCartContext();

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
