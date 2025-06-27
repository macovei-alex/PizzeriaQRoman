import React from "react";
import { View, Text, LayoutChangeEvent } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import ProductCard from "./ProductCard";
import { Category, CategoryId } from "src/api/types/Category";
import { Product } from "src/api/types/Product";
import logger from "src/constants/logger";

type VerticalCategorySectionProps = {
  category: Category;
  products: Product[];
  onLayout: (categoryId: CategoryId, event: LayoutChangeEvent) => void;
};

export default function VerticalCategorySection({
  category,
  products,
  onLayout,
}: VerticalCategorySectionProps) {
  logger.render("VerticalCategorySection");

  return (
    <View
      key={category.id}
      onLayout={(event) => {
        // Save the position of each category for the scroll to position from the horizontal menu
        onLayout(category.id, event);
      }}
    >
      <View style={styles.categoryTextContainer}>
        <Text style={styles.categoryText}>{category.name}</Text>
      </View>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  categoryTextContainer: {
    marginVertical: 12,
    marginHorizontal: 22,
  },
  categoryText: {
    fontSize: 20,
    fontWeight: 800,
    color: theme.text.primary,
  },
}));
