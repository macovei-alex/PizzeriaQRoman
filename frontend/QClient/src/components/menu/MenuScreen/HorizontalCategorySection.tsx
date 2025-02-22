import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import CategoryTouchable from "./CategoryTouchable";
import SearchBar from "./SearchBar";
import { Category, CategoryId } from "src/api/types/Category";
import logger from "src/utils/logger";

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
          <CategoryTouchable
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
