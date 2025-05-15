import React from "react";
import { StyleSheet, Text, View } from "react-native";
import OrderItemCard from "./OrderItemCard";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { formatPrice } from "src/utils/utils";
import { FullOrderItem } from "src/api/types/order/FullHistoryOrder";

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
  orderItems: FullOrderItem[];
};

export default function ProductSection({ orderItems }: ProductSectionProps) {
  logger.render("ProductSection");

  const colorTheme = useColorTheme();

  const prices = orderItems.map((cartItem) => calculatePrice(cartItem));
  const totalPrice = prices.reduce((acc, price) => acc + price, 0);

  return (
    <>
      {orderItems.map((orderItem, index) => (
        <OrderItemCard key={orderItem.id} orderItem={orderItem} price={prices[index]} />
      ))}
      <View style={styles.totalPriceContainerContainer}>
        <View style={[styles.totalPriceContainer, { backgroundColor: colorTheme.background.accent }]}>
          <Text style={[styles.totalPriceText, { color: colorTheme.text.onAccent }]}>
            {"Total de comandă: " + formatPrice(totalPrice)}
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
    marginVertical: 16,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
