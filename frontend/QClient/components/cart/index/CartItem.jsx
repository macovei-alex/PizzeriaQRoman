import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imageOrDefault } from "../../../utils/files";
import useSingleImage from "../../../hooks/useSingleImage";
import useColorTheme from "../../../hooks/useColorTheme";
import HorizontalLine from "../../menu/product/HorizontalLine";
import React from "react";
import PlusCircle from "../../svg/PlusCircle";
import MinusCircle from "../../svg/MinusCircle";
import { useCartContext } from "../../../context/useCartContext";

export default function CartItem({ cartItem }) {
  const image = useSingleImage(cartItem.product.imageName);
  const colorTheme = useColorTheme();
  const { setCart } = useCartContext();

  /** @param {number} difference */
  function changeItemCount(difference) {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === cartItem.product.id
          ? { id: item.id, product: item.product, count: item.count + difference }
          : item
      )
    );
  }

  const totalPrice = cartItem.product.price * cartItem.count;

  return (
    <View style={styles.container}>
      <View style={styles.infoSectionContainer}>
        <Image source={imageOrDefault(image)} style={styles.image} />
        <View style={styles.textSectionContainer}>
          <Text
            style={[styles.productNameText, { color: colorTheme.text[100] }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cartItem.product.name}
          </Text>
          <Text
            style={[styles.productSubtitleText, { color: colorTheme.text[100] }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {cartItem.product.subtitle}
          </Text>
          <View style={styles.productDescriptionContainer}>
            <Text
              style={[styles.productDescriptionText, { color: colorTheme.text[200] }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {cartItem.product.description}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.priceSectionContainer}>
        <View style={[styles.priceContainer, { backgroundColor: colorTheme.background[500] }]}>
          <Text style={[styles.priceText, { color: colorTheme.text[300] }]}>{totalPrice.toFixed(2)} RON</Text>
        </View>
        <TouchableOpacity onPress={() => changeItemCount(-1)}>
          <MinusCircle style={styles.plusMinusSvg} />
        </TouchableOpacity>
        <Text style={styles.itemCountText}>{cartItem.count}</Text>
        <TouchableOpacity onPress={() => changeItemCount(1)}>
          <PlusCircle style={styles.plusMinusSvg} />
        </TouchableOpacity>
      </View>

      <HorizontalLine style={[styles.hr, { backgroundColor: colorTheme.background[200] }]} />
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
  image: {
    width: "35%",
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
