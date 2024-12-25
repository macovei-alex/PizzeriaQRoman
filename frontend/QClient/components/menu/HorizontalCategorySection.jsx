import { ScrollView, StyleSheet } from "react-native";
import React from "react";
import Category from "./Category";
import SearchBar from "./SerachBar";

export default function HorizontalCategorySection({ categories, onCategoryPress }) {
  return (
    <>
      <ScrollView horizontal style={styles.scrollContainer}>
        {categories.map((category) => (
          <Category
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
          console.log(text);
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
    marginHorizontal: 4,
  },
});
