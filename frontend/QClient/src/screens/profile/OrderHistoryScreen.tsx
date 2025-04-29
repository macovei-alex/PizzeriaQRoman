import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCard from "src/components/profile/order-history/OrderCard";
import ScreenTitle from "src/components/shared/ScreenTitle";
import useOrderHistoryQuery from "src/api/hooks/useOrderHistoryQuery";
import logger from "src/utils/logger";
import ErrorComponent from "src/components/shared/ErrorComponent";

export default function OrderHistoryScreen() {
  logger.render("OrderHistoryScreen");

  const ordersQuery = useOrderHistoryQuery();

  if (ordersQuery.isLoading) {
    return <Text>Loading...</Text>;
  }
  if (ordersQuery.isError) {
    return <ErrorComponent onRetry={ordersQuery.refetch} />;
  }

  return (
    <SafeAreaView>
      <ScreenTitle title="Istoricul comenzilor" />
      <ScrollView style={styles.scrollView}>
        {ordersQuery.data?.map((order) => (
          <OrderCard key={order.id} order={order} containerStyle={styles.orderCardContainer} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  orderCardContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  scrollView: {
    marginBottom: 100,
  },
});
