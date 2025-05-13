import React, { useMemo } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderCard from "src/components/profile/OrderHistoryScreen/OrderCard";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import useOrderHistoryInfiniteQuery from "src/api/hooks/useOrderHistoryInfiniteQuery";
import logger from "src/utils/logger";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import { LegendList } from "@legendapp/list";
import useColorTheme from "src/hooks/useColorTheme";

export default function OrderHistoryScreen() {
  logger.render("OrderHistoryScreen");

  const ordersQuery = useOrderHistoryInfiniteQuery();

  const flattenedOrders = useMemo(() => ordersQuery.data?.pages.flat() ?? [], [ordersQuery.data]);

  if (ordersQuery.isError) return <ErrorComponent />;

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenTitle title="Istoricul comenzilor" />
      {ordersQuery.isLoading ? (
        <CustomActivityIndicator />
      ) : (
        <LegendList
          data={flattenedOrders}
          keyExtractor={(order) => order.id.toString()}
          renderItem={({ item: order }) => (
            <OrderCard key={order.id} order={order} containerStyle={styles.orderCardContainer} />
          )}
          onEndReachedThreshold={0.8}
          onEndReached={() =>
            ordersQuery.hasNextPage && !ordersQuery.isFetchingNextPage && ordersQuery.fetchNextPage()
          }
          maintainVisibleContentPosition
          ListFooterComponent={ordersQuery.isFetchingNextPage ? <CustomActivityIndicator /> : null}
        />
      )}
    </SafeAreaView>
  );
}

function CustomActivityIndicator() {
  const colorTheme = useColorTheme();
  return <ActivityIndicator size="large" color={colorTheme.text.accent} style={styles.loadingIndicator} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  orderCardContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});
