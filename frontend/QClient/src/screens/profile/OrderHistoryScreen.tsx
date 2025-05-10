import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCard from "src/components/profile/OrderHistoryScreen/OrderCard";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import useOrderHistoryQuery from "src/api/hooks/useOrderHistoryQuery";
import logger from "src/utils/logger";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import ScreenActivityIndicator from "src/components/shared/generic/ScreenActivityIndicator";

export default function OrderHistoryScreen() {
  logger.render("OrderHistoryScreen");

  const ordersQuery = useOrderHistoryQuery();

  if (ordersQuery.isFetching) return <ScreenActivityIndicator />;
  if (ordersQuery.isError) return <ErrorComponent />;

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
