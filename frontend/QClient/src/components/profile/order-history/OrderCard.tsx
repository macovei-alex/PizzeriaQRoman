import React, { useMemo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { HistoryOrder } from "src/api/types/Order";
import { Product, ProductId } from "src/api/types/Product";
import useColorTheme from "src/hooks/useColorTheme";
import useProductsQuery from "src/api/hooks/useProductsQuery";
import logger from "src/utils/logger";
import { formatDate } from "src/utils/utils";

const maxItemsCount = 3;

type OrderCardProps = {
  order: HistoryOrder;
  containerStyle?: StyleProp<ViewStyle>;
};

export default function OrderCard({ order, containerStyle }: OrderCardProps) {
  logger.render("OrderCard");

  const colorTheme = useColorTheme();
  const productsQuery = useProductsQuery();

  const processedItems = useMemo(() => {
    if (!productsQuery.data) {
      return [];
    }
    return order.items
      .map((item) => ({
        orderItem: item,
        product: productsQuery.data.find((product) => product.id === item.productId),
      }))
      .filter((item) => !!item.product)
      .filter((_, index) => index < maxItemsCount) as {
      orderItem: { productId: ProductId; count: number };
      product: Product;
    }[];
  }, [productsQuery, order]);

  if (productsQuery.isLoading || !productsQuery.data) {
    return <Text>Loading...</Text>;
  }
  if (productsQuery.isError) {
    return <Text>Error: {productsQuery.error.message}</Text>;
  }

  return (
    <View style={[styles.container, { borderColor: colorTheme.text.primary }, containerStyle]}>
      <Text>{formatDate(order.orderTimestamp)}</Text>
      {processedItems.map((item, index) => (
        <Text key={index}>
          {item.orderItem.count} X {item.product.name}
        </Text>
      ))}

      {/* Padding if the order doesn't have enough items */}
      {processedItems.length < maxItemsCount ? <Text>{"\n".repeat(3 - processedItems.length)}</Text> : null}

      <Text>
        {order.totalPrice} {order.totalPriceWithDiscount}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 5,
  },
});
