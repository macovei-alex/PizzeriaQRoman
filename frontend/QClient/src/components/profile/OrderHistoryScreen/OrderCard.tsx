import React, { useMemo } from "react";
import { ColorValue, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { HistoryOrder, OrderStatus } from "src/api/types/Order";
import { Product, ProductId } from "src/api/types/Product";
import useColorTheme from "src/hooks/useColorTheme";
import useProductsQuery from "src/api/hooks/useProductsQuery";
import logger from "src/utils/logger";
import { formatDate, formatPrice } from "src/utils/utils";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import RemoteImage from "src/components/shared/generic/RemoteImage";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

const MAX_ITEMS_PER_ORDER = 4;

type OrderCardProps = {
  order: HistoryOrder;
  containerStyle?: StyleProp<ViewStyle>;
};

type NavigationProps = NativeStackNavigationProp<ProfileStackParamList, "OrderHistoryScreen">;

export default function OrderCard({ order, containerStyle }: OrderCardProps) {
  logger.render("OrderCard");

  const navigation = useNavigation<NavigationProps>();
  const colorTheme = useColorTheme();
  const productsQuery = useProductsQuery();

  const processedItems = useMemo(() => {
    if (!productsQuery.data) return [];
    return order.items
      .map((item) => ({
        orderItem: item,
        product: productsQuery.data.find((product) => product.id === item.productId),
      }))
      .filter((item) => !!item.product)
      .filter((_, index) => index < MAX_ITEMS_PER_ORDER) as {
      orderItem: { productId: ProductId; count: number };
      product: Product;
    }[];
  }, [productsQuery, order]);

  const orderStatusColors: Record<OrderStatus, ColorValue> = useMemo(() => {
    return {
      RECEIVED: colorTheme.background.accent,
      IN_PREPARATION: colorTheme.background.accent,
      IN_DELIVERY: colorTheme.background.accent,
      DELIVERED: colorTheme.background.success,
    };
  }, [colorTheme]);

  const orderStatusNames = useMemo(() => {
    return {
      RECEIVED: "Comandă primită",
      IN_PREPARATION: "În preparare",
      IN_DELIVERY: "În livrare",
      DELIVERED: "Livrată",
    };
  }, []);

  if (productsQuery.isFetching) return null;
  if (productsQuery.isError) return <ErrorComponent />;

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.card }, containerStyle]}>
      <View style={styles.leftSideContainer}>
        <RemoteImage
          imageName={processedItems[0].product.imageName}
          imageVersion={processedItems[0].product.imageVersion}
          style={styles.image}
        />

        {/* price */}
        <View style={styles.priceSectionContainer}>
          <Text style={styles.priceText}>Preț comandă:</Text>
          <Text style={styles.priceText}>{formatPrice(order.totalPriceWithDiscount)}</Text>
        </View>
      </View>

      <View style={styles.rightSideContainer}>
        <View style={styles.infoHeader}>
          {/* delivery date */}
          <Text style={styles.dateText}>{formatDate(order.deliveryTimestamp)}</Text>

          {/* status */}
          <Text
            style={[
              styles.statusText,
              {
                color: orderStatusColors[order.orderStatus],
                borderColor: orderStatusColors[order.orderStatus],
              },
            ]}
          >
            {orderStatusNames[order.orderStatus]}
          </Text>
        </View>

        {/* products */}
        {processedItems.map((item, index) => (
          <Text key={index} style={styles.productTitleText} numberOfLines={1} ellipsizeMode="tail">
            {`${item.orderItem.count} X ${item.product.name}`}
            <Text>
              {index === processedItems.length - 1 && order.items.length > processedItems.length
                ? " ..."
                : ""}
            </Text>
          </Text>
        ))}

        {/* padding if the order doesn't have enough items */}
        {processedItems.length < MAX_ITEMS_PER_ORDER && (
          <Text>{"\n".repeat(MAX_ITEMS_PER_ORDER - processedItems.length)}</Text>
        )}

        <TouchableOpacity
          style={[styles.moreButtonContainer, { backgroundColor: colorTheme.background.accent }]}
          onPress={() => navigation.navigate("FullOrderScreen", { orderId: order.id })}
        >
          <Text style={[styles.moreButtonText, { color: colorTheme.text.onAccent }]}>Mai multe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    padding: 8,
    marginBottom: 16,
    marginRight: 12,
    borderRadius: 16,
    marginTop: 8,
  },
  leftSideContainer: {
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    width: "38%",
  },
  image: {
    height: 100,
    aspectRatio: 1,
    borderRadius: 9999,
  },
  priceSectionContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  priceText: {
    fontSize: 15,
    fontWeight: "600",
  },
  rightSideContainer: {
    flexGrow: 1,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
  },
  statusText: {
    fontWeight: "600",
    borderRadius: 9999,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  productTitleText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  moreButtonContainer: {
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 12,
    marginBottom: -30,
    marginLeft: 40,
    marginRight: -12,
  },
  moreButtonText: {
    fontSize: 18,
  },
});
