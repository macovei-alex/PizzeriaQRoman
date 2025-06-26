import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import PlusCircleSvg from "src/components/svg/PlusCircleSvg";
import MinusCircleSvg from "src/components/svg/MinusCircleSvg";
import { useCartContext } from "src/context/CartContext/CartContext";
import logger from "src/utils/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { formatPrice } from "src/utils/utils";
import { useNavigation } from "@react-navigation/native";
import RemoteImage from "src/components/shared/generic/RemoteImage";
import { CartItem } from "src/context/CartContext/types";

type NavigationProps = NativeStackNavigationProp<CartStackParamList, "CartScreen">;
type CartItemCardProps = {
  cartItem: CartItem;
  price: number;
};

export default function CartItemCard({ cartItem, price }: CartItemCardProps) {
  logger.render("CartItemCard");

  const navigation = useNavigation<NavigationProps>();
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
    [cartItem.options, cartItem.product]
  );

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() =>
        navigation.navigate("ProductScreen", {
          productId: cartItem.product.id,
          cartItemId: cartItem.id,
        })
      }
    >
      <View style={styles.container}>
        {/* image */}
        <View style={styles.imageContainer}>
          <RemoteImage
            imageName={cartItem.product.imageName}
            imageVersion={cartItem.product.imageVersion}
            style={styles.image}
          />
        </View>

        {/* info section */}
        <View style={styles.infoSectionContainer}>
          {/* product title */}
          <Text style={styles.productNameText} numberOfLines={1} ellipsizeMode="tail">
            {cartItem.product.name}
          </Text>

          {/* product subtitle */}
          <Text style={styles.productSubtitleText} numberOfLines={1} ellipsizeMode="tail">
            {cartItem.product.subtitle}
          </Text>

          {/* product options */}
          <Text style={styles.productOptionsText}>{selectedOptionsStr}</Text>

          {/* price section */}
          <View style={styles.priceSectionContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceText}>{formatPrice(price)}</Text>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: "row",
    gap: 16,
    margin: 8,
    padding: 12,
    borderRadius: 16,
    backgroundColor: theme.background.card,
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
    color: theme.text.primary,
  },
  productSubtitleText: {
    fontSize: 16,
    color: theme.text.primary,
  },
  productOptionsText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "light",
    color: theme.text.secondary,
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
    backgroundColor: theme.background.accent,
  },
  priceText: {
    fontSize: 18,
    color: theme.text.onAccent,
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
}));
