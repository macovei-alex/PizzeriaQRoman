import React from "react";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import OrderItemCard from "./OrderItemCard";
import logger from "src/constants/logger";
import { formatPrice } from "src/utils/utils";
import { FullOrderItem } from "src/api/types/order/FullHistoryOrder";
import { OrderId } from "src/api/types/order/Order";

function calculatePrice(item: FullOrderItem) {
  return item.options
    .map(({ optionListId, optionId, count }) => {
      const optionList = item.product.optionLists.find((optionList) => optionList.id === optionListId);
      if (!optionList) throw new Error(`Option list not found: ${optionListId}`);
      const option = optionList.options.find((option) => option.id === Number(optionId));
      if (!option) throw new Error(`Option not found: ${optionId}`);
      return option.price * count;
    })
    .reduce((acc, price) => acc + price, item.product.price);
}

type ProductSectionProps = {
  orderId: OrderId;
  orderItems: FullOrderItem[];
};

export default function ProductSection({ orderId, orderItems }: ProductSectionProps) {
  logger.render("ProductSection");

  const prices = orderItems.map((cartItem) => calculatePrice(cartItem));
  const totalPrice = prices.reduce((acc, price) => acc + price, 0);

  return (
    <>
      {orderItems.map((orderItem, index) => (
        <OrderItemCard key={orderItem.id} orderId={orderId} orderItem={orderItem} price={prices[index]} />
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
