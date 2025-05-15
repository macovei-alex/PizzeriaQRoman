import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import logger from "src/utils/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { formatPrice } from "src/utils/utils";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import RemoteImage from "src/components/shared/generic/RemoteImage";
import { ProfileStackParamList } from "src/navigation/ProfileStackNavigator";
import { FullOrderItem } from "src/api/types/order/FullHistoryOrder";
import { RootStackParamList } from "src/navigation/RootStackNavigator";

type NavigationProps = CompositeNavigationProp<
  NativeStackNavigationProp<ProfileStackParamList, "FullOrderScreen">,
  NativeStackNavigationProp<RootStackParamList>
>;

type OrderItemCardProps = {
  orderItem: FullOrderItem;
  price: number;
};

export default function OrderItemCard({ orderItem, price }: OrderItemCardProps) {
  logger.render("OrderItemCard");

  const navigation = useNavigation<NavigationProps>();
  const colorTheme = useColorTheme();

  const selectedOptionsStr = useMemo(
    () =>
      orderItem.options
        .map(({ optionListId, optionId, count }) => {
          const optionList = orderItem.product.optionLists.find((list) => list.id === optionListId);
          if (!optionList) throw new Error(`Option list not found: ${optionListId}`);
          const option = optionList.options.find((option) => option.id === Number(optionId));
          if (!option) throw new Error(`Option not found: ${optionId}`);
          if (optionList.options[0].maxCount > 1) return `${count} x ${option.name}`;
          return option.name;
        })
        .join(", "),
    [orderItem.options, orderItem.product.optionLists]
  );

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() =>
        navigation.navigate("MainTabNavigator", {
          screen: "CartStackNavigator",
          params: {
            screen: "ProductScreen",
            params: {
              productId: orderItem.product.id.toString(),
              cartItemId: orderItem.id.toString(),
            },
          },
        })
      }
    >
      <View style={[styles.container, { backgroundColor: colorTheme.background.card }]}>
        {/* image */}
        <View style={styles.imageContainer}>
          <RemoteImage
            imageName={orderItem.product.imageName}
            imageVersion={orderItem.product.imageVersion}
            style={styles.image}
          />
        </View>

        {/* info section */}
        <View style={styles.infoSectionContainer}>
          {/* product title */}
          <Text
            style={[styles.productNameText, { color: colorTheme.text.primary }]}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {orderItem.count} X {orderItem.product.name}
          </Text>

          {/* product subtitle */}
          <Text
            style={[styles.productSubtitleText, { color: colorTheme.text.primary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {orderItem.product.subtitle}
          </Text>

          {/* product options */}
          <Text style={[styles.productOptionsText, { color: colorTheme.text.secondary }]}>
            {selectedOptionsStr}
          </Text>

          {/* price section */}
          <View style={styles.priceSectionContainer}>
            <View style={[styles.priceContainer, { backgroundColor: colorTheme.background.accent }]}>
              <Text style={[styles.priceText, { color: colorTheme.text.onAccent }]}>
                {formatPrice(price)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 16,
    margin: 8,
    padding: 12,
    borderRadius: 16,
  },
  imageContainer: {
    width: "25%",
  },
  image: {
    aspectRatio: 1,
    borderRadius: 9999,
  },
  infoSectionContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  productNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productSubtitleText: {
    fontSize: 16,
  },
  productOptionsText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "light",
  },
  priceSectionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 16,
  },
  priceContainer: {
    marginRight: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 18,
  },
});
