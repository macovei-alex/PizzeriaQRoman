import React from "react";
import { Text, View } from "react-native";
import useOrderHistoryQuery from "@/hooks/useOrderHistoryQuery";
import logger from "@/utils/logger";

export default function OrderHistory() {
  logger.render("OrderHistory");

  const ordersQuery = useOrderHistoryQuery();

  if (ordersQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (ordersQuery.isError) {
    return <Text>Error: {ordersQuery.error.message}</Text>;
  }

  // TODO: Create the layout for the order history
  return (
    <View>
      <Text>{JSON.stringify(ordersQuery.data)}</Text>
    </View>
  );
}
