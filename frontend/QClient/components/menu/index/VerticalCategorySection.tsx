import React from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import MenuProduct from "./MenuProduct";
import useColorTheme from "@/hooks/useColorTheme";
import { Category, CategoryId } from "@/api/types/Category";
import { Product } from "@/api/types/Product";
import { ImageFile } from "@/utils/files";
import logger from "@/utils/logger";

type VerticalCategorySectionProps = {
  category: Category;
  products: Product[];
  productImages: ImageFile[];
  customOnLayout: (categoryId: CategoryId, event: LayoutChangeEvent) => void;
  onMenuProductClick: (product: Product) => void;
};

export default function VerticalCategorySection({
  category,
  products,
  productImages,
  customOnLayout,
  onMenuProductClick,
}: VerticalCategorySectionProps) {
  logger.render("VerticalCategorySection");

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
        <Text style={[styles.categoryText, { color: colorTheme.text.primary }]}>{category.name}</Text>
      </View>
      {products.map((product) => (
        <MenuProduct
          key={product.id}
          product={product}
          productImage={productImages.find((img) => img.name === product.imageName) as ImageFile}
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
