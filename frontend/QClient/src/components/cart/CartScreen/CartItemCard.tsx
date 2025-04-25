import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imageOrDefault } from "src/utils/files";
import useSingleImage from "src/hooks/useSingleImage";
import useColorTheme from "src/hooks/useColorTheme";
import HorizontalLine from "src/components/shared/ProductScreen/HorizontalLine";
import PlusCircleSvg from "src/components/svg/PlusCircleSvg";
import MinusCircleSvg from "src/components/svg/MinusCircleSvg";
import { CartItem, useCartContext } from "src/context/CartContext";
import logger from "src/utils/logger";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { CartStackParamList } from "src/navigation/CartStackNavigator";
import { formatPrice } from "src/utils/utils";

type CartItemCardProps = {
  cartItem: CartItem;
  price: number;
} & { navigation: NativeStackNavigationProp<CartStackParamList, "CartScreen"> };

export default function CartItemCard({ navigation, cartItem, price }: CartItemCardProps) {
  logger.render("CartItemCard");

  const image = useSingleImage(cartItem.product.imageName);
  const colorTheme = useColorTheme();
  const { changeCartItemCount } = useCartContext();

  return (
    <View style={styles.container}>
      <View style={styles.infoSectionContainer}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() =>
            navigation.navigate("ProductScreen", {
              productId: cartItem.product.id.toString(),
              imageName: cartItem.product.imageName,
              cartItemId: cartItem.id.toString(),
            })
          }
        >
          <Image source={imageOrDefault(image)} style={styles.image} />
        </TouchableOpacity>
        <View style={styles.textSectionContainer}>
          <Text
            style={[styles.productNameText, { color: colorTheme.text.primary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cartItem.product.name}
          </Text>
          <Text
            style={[styles.productSubtitleText, { color: colorTheme.text.primary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cartItem.product.subtitle}
          </Text>
          <View style={styles.productDescriptionContainer}>
            <Text
              style={[styles.productDescriptionText, { color: colorTheme.text.secondary }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {cartItem.product.description}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.priceSectionContainer}>
        <View style={[styles.priceContainer, { backgroundColor: colorTheme.background.accent }]}>
          <Text style={[styles.priceText, { color: colorTheme.text.onAccent }]}>{formatPrice(price)}</Text>
        </View>
        <TouchableOpacity onPress={() => changeCartItemCount(cartItem.id, -1)}>
          <MinusCircleSvg style={styles.plusMinusSvg} />
        </TouchableOpacity>
        <Text style={styles.itemCountText}>{cartItem.count}</Text>
        <TouchableOpacity onPress={() => changeCartItemCount(cartItem.id, 1)}>
          <PlusCircleSvg style={styles.plusMinusSvg} />
        </TouchableOpacity>
      </View>

      <HorizontalLine style={[styles.hr, { backgroundColor: colorTheme.background.card }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 12,
  },
  infoSectionContainer: {
    flexDirection: "row",
    gap: "5%",
  },
  imageContainer: {
    width: "35%",
  },
  image: {
    aspectRatio: 1,
    borderRadius: 9999,
  },
  textSectionContainer: {
    maxWidth: "60%",
  },
  productNameText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productSubtitleText: {
    fontSize: 18,
  },
  productDescriptionContainer: {
    marginTop: 4,
  },
  productDescriptionText: {
    fontSize: 12,
    fontWeight: "light",
  },
  hr: {
    marginTop: 24,
  },
  priceSectionContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  priceContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 20,
  },
  priceText: {
    fontSize: 18,
  },
  plusMinusSvg: {
    width: 35,
    height: 35,
  },
  itemCountText: {
    marginHorizontal: 4,
    fontSize: 20,
    fontWeight: "bold",
  },
});
