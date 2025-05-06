import React, { useMemo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import PlusCircleSvg from "src/components/svg/PlusCircleSvg";
import MinusCircleSvg from "src/components/svg/MinusCircleSvg";
import { CartItem, useCartContext } from "src/context/CartContext";
import logger from "src/utils/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { formatPrice } from "src/utils/utils";
import { useNavigation } from "@react-navigation/native";
import RemoteImage from "src/components/shared/generic/RemoteImage";

type NavigationProps = NativeStackNavigationProp<CartStackParamList, "CartScreen">;
type CartItemCardProps = {
  cartItem: CartItem;
  price: number;
};

export default function CartItemCard({ cartItem, price }: CartItemCardProps) {
  logger.render("CartItemCard");

  const navigation = useNavigation<NavigationProps>();
  const colorTheme = useColorTheme();
  const { changeCartItemCount } = useCartContext();

  const selectedOptionsStr = useMemo(
    () =>
      Object.entries(cartItem.options)
        .map(([optionListId, selectedOptions]) =>
          Object.entries(selectedOptions)
            .map(([optionId, count]) => {
              const optionList = cartItem.product.optionLists.find(
                (list) => list.id === Number(optionListId)
              );
              if (!optionList) throw new Error(`Option list not found: ${optionListId}`);
              const option = optionList.options.find((option) => option.id === Number(optionId));
              if (!option) throw new Error(`Option not found: ${optionId}`);
              if (optionList.options[0].maxCount > 1) return `${count} x ${option.name}`;
              return option.name;
            })
            .join(", ")
        )
        .join(", "),
    [cartItem.options, cartItem.product.optionLists]
  );

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.card }]}>
      {/* image */}
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() =>
          navigation.navigate("ProductScreen", {
            productId: cartItem.product.id.toString(),
            cartItemId: cartItem.id.toString(),
          })
        }
      >
        <RemoteImage
          imageName={cartItem.product.imageName}
          imageVersion={cartItem.product.imageVersion}
          style={styles.image}
        />
      </TouchableOpacity>

      {/* info section */}
      <View style={styles.infoSectionContainer}>
        {/* product title */}
        <Text
          style={[styles.productNameText, { color: colorTheme.text.primary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {cartItem.product.name}
        </Text>

        {/* product subtitle */}
        <Text
          style={[styles.productSubtitleText, { color: colorTheme.text.primary }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {cartItem.product.subtitle}
        </Text>

        {/* product options */}
        <Text style={[styles.productOptionsText, { color: colorTheme.text.secondary }]}>
          {selectedOptionsStr}
        </Text>

        {/* price section */}
        <View style={styles.priceSectionContainer}>
          <View style={[styles.priceContainer, { backgroundColor: colorTheme.background.accent }]}>
            <Text style={[styles.priceText, { color: colorTheme.text.onAccent }]}>{formatPrice(price)}</Text>
          </View>

          {/* minus */}
          <TouchableOpacity onPress={() => changeCartItemCount(cartItem.id, -1)}>
            <MinusCircleSvg style={styles.plusMinusSvg} />
          </TouchableOpacity>

          {/* count */}
          <Text style={styles.itemCountText}>{cartItem.count}</Text>

          {/* plus */}
          <TouchableOpacity onPress={() => changeCartItemCount(cartItem.id, 1)}>
            <PlusCircleSvg style={styles.plusMinusSvg} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  plusMinusSvg: {
    width: 35,
    height: 35,
  },
  itemCountText: {
    marginHorizontal: 6,
    fontSize: 20,
    fontWeight: "bold",
  },
});
