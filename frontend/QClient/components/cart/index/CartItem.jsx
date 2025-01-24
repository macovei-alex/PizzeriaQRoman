import { Image, StyleSheet, Text, View } from "react-native";
import { imageOrDefault } from "../../../utils/files";
import useSingleImage from "../../../hooks/useSingleImage";
import { useColorTheme } from "../../../hooks/useColorTheme";
import HorizontalLine from "../../menu/product/HorizontalLine";
import React from "react";

/**
 * @param {Object} props
 */
export default function CartItem({ cartItem }) {
  const image = useSingleImage(cartItem.product.imageName);
  const colorTheme = useColorTheme();

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
});
