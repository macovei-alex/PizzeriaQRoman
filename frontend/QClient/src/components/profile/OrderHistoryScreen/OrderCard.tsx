import React, { useMemo } from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { Product, ProductId } from "src/api/types/Product";
import useProductsQuery from "src/api/hooks/queries/useProductsQuery";
import logger from "src/utils/logger";
import { formatDate, formatPrice } from "src/utils/utils";
import ErrorComponent from "src/components/shared/generic/ErrorComponent";
import RemoteImage from "src/components/shared/generic/RemoteImage";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { HistoryOrderMinimal } from "src/api/types/order/HistoryOrderMinimal";
import { RootStackParamList } from "src/navigation/RootStackNavigator";

const MAX_ITEMS_PER_ORDER = 4;

type OrderCardProps = {
  order: HistoryOrderMinimal;
  containerStyle?: StyleProp<ViewStyle>;
};

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "OrderHistoryScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

export default function OrderCard({ order, containerStyle }: OrderCardProps) {
  logger.render("OrderCard");

  const navigation = useNavigation<NavigationProps>();
  const productsQuery = useProductsQuery();
  const { theme } = useUnistyles();

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

  const orderStatusColors = useMemo(() => {
    return {
      RECEIVED: theme.background.accent,
      IN_PREPARATION: theme.background.accent,
      IN_DELIVERY: {
        text: theme.text.onAccent,
        border: theme.background.accent,
        background: theme.background.accent,
      },
      DELIVERED: theme.background.success,
    };
  }, [theme]);

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
    <View style={[styles.container, containerStyle]}>
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
          <TouchableOpacity
            disabled={order.orderStatus !== "IN_DELIVERY"}
            onPress={() => navigation.navigate("OrderDeliveryScreen", { orderId: order.id })}
          >
            <Text
              style={[
                styles.statusText,
                order.orderStatus !== "IN_DELIVERY"
                  ? {
                      color: orderStatusColors[order.orderStatus],
                      borderColor: orderStatusColors[order.orderStatus],
                    }
                  : {
                      color: orderStatusColors[order.orderStatus].text,
                      backgroundColor: orderStatusColors[order.orderStatus].background,
                      borderColor: orderStatusColors[order.orderStatus].border,
                    },
              ]}
            >
              {orderStatusNames[order.orderStatus]}
            </Text>
          </TouchableOpacity>
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
          style={styles.moreButtonContainer}
          onPress={() => navigation.navigate("FullOrderScreen", { orderId: order.id })}
        >
          <Text style={styles.moreButtonText}>Mai multe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    gap: 12,
    padding: 8,
    marginBottom: 16,
    marginRight: 12,
    borderRadius: 16,
    marginTop: 8,
    backgroundColor: theme.background.card,
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
    backgroundColor: theme.background.accent,
  },
  moreButtonText: {
    fontSize: 18,
    color: theme.text.onAccent,
  },
}));
