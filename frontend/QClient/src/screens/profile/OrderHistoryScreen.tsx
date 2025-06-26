import React, { useMemo } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import OrderCard from "src/components/profile/OrderHistoryScreen/OrderCard";
import ScreenTitle from "src/components/shared/generic/ScreenTitle";
import useOrderHistoryInfiniteQuery from "src/api/hooks/queries/useOrderHistoryInfiniteQuery";
import logger from "src/utils/logger";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import { LegendList } from "@legendapp/list";

function CustomActivityIndicator() {
  const { theme } = useUnistyles();
  return <ActivityIndicator size="large" color={theme.text.accent} style={styles.loadingIndicator} />;
}

export default function OrderHistoryScreen() {
  logger.render("OrderHistoryScreen");

  const ordersQuery = useOrderHistoryInfiniteQuery();

  const flattenedOrders = useMemo(() => ordersQuery.data?.pages.flat() ?? [], [ordersQuery.data]);

  if (ordersQuery.isError) return <ErrorComponent />;

  return (
    <View style={styles.screen}>
      <ScreenTitle title="Istoricul comenzilor" />
      {ordersQuery.isLoading ? (
        <CustomActivityIndicator />
      ) : (
        <LegendList
          data={flattenedOrders}
          keyExtractor={(order) => order.id.toString()}
          renderItem={({ item: order, index }) => (
            <OrderCard
              key={order.id}
              order={order}
              containerStyle={styles.orderCardContainer(index === flattenedOrders.length - 1)}
            />
          )}
          onEndReachedThreshold={0.8}
          onEndReached={() =>
            ordersQuery.hasNextPage && !ordersQuery.isFetchingNextPage && ordersQuery.fetchNextPage()
          }
          maintainVisibleContentPosition
          ListFooterComponent={ordersQuery.isFetchingNextPage ? <CustomActivityIndicator /> : null}
          refreshControl={
            <RefreshControl refreshing={ordersQuery.isFetching} onRefresh={ordersQuery.refetch} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme, runtime) => ({
  screen: {
    flex: 1,
    top: runtime.insets.top,
  },
  orderCardContainer: (isLast: boolean) => ({
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: isLast ? runtime.insets.bottom : 20,
  }),
  loadingIndicator: {
    marginVertical: 20,
  },
}));
