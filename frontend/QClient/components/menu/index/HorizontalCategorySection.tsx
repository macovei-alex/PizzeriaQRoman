import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import CategoryCard from "./CategoryCard";
import SearchBar from "./SearchBar";
import { Category, CategoryId } from "@/api/types/Category";
import logger from "@/utils/logger";

type HorizontalCategorySectionProps = {
  categories: Category[];
  onCategoryPress: (categoryId: CategoryId) => void;
};

export default function HorizontalCategorySection({
  categories,
  onCategoryPress,
}: HorizontalCategorySectionProps) {
  logger.render("HorizontalCategorySection");

  return (
    <>
      <ScrollView horizontal style={styles.scrollContainer}>
        {categories.map((category) => (
          <CategoryCard
            style={styles.category}
            key={category.id}
            category={category}
            onPress={() => onCategoryPress(category.id)}
          />
        ))}
      </ScrollView>

      <SearchBar
        placeholder={"Caută ce îți dorești"}
        onSearch={(text) => {
          logger.log(text);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 12,
  },
  category: {
    marginHorizontal: 8,
  },
});
