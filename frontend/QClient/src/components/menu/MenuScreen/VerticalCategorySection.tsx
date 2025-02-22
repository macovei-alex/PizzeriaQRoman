import React from "react";
import { View, Text, StyleSheet, LayoutChangeEvent } from "react-native";
import ProductCard from "./ProductCard";
import useColorTheme from "src/hooks/useColorTheme";
import { Category, CategoryId } from "src/api/types/Category";
import { Product } from "src/api/types/Product";
import { ImageFile } from "src/utils/files";
import logger from "src/utils/logger";

type VerticalCategorySectionProps = {
  category: Category;
  products: Product[];
  productImages: ImageFile[];
  onLayout: (categoryId: CategoryId, event: LayoutChangeEvent) => void;
};

export default function VerticalCategorySection({
  category,
  products,
  productImages,
  onLayout,
}: VerticalCategorySectionProps) {
  logger.render("VerticalCategorySection");

  const colorTheme = useColorTheme();

  return (
    <View
      key={category.id}
      onLayout={(event) => {
        // Save the position of each category for the scroll to position from the horizontal menu
        onLayout(category.id, event);
      }}
    >
      <View style={styles.categoryTextContainer}>
        <Text style={[styles.categoryText, { color: colorTheme.text.primary }]}>{category.name}</Text>
      </View>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          productImage={productImages.find((img) => img.name === product.imageName) as ImageFile}
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
