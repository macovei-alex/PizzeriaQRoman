import { View, Text, StyleSheet } from "react-native";
import React from "react";
import MenuProduct from "./MenuProduct";
import useColorTheme from "../../../hooks/useColorTheme";

/**
 * @param {Object} props
 * @param {Object} props.category
 * @param {Object[]} props.products
 * @param {{ name: string, data: string | null }[]} props.productImages
 * @param {(categoryId: number, event: LayoutChangeEvent) => void} [props.customOnLayout]
 * @param {(product: Object) => void} [props.onMenuProductClick]
 */
export default function VerticalCategorySection({
  category,
  products,
  productImages,
  customOnLayout,
  onMenuProductClick,
}) {
  const colorTheme = useColorTheme();

  return (
    <View
      key={category.id}
      onLayout={(event) => {
        // Save the position of each category for the scroll to position from the horizontal menu
        customOnLayout(category.id, event);
      }}
    >
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryText, { color: colorTheme.text[100] }]}>{category.name}</Text>
      </View>
      {products.map((product) => (
        <MenuProduct
          key={product.id}
          product={product}
          productImage={productImages.find((img) => img.name === product.imageName)}
          onPress={() => onMenuProductClick(product)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  categoryTextContainer: {
    marginVertical: 12,
    marginHorizontal: 22,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 800,
  },
});
