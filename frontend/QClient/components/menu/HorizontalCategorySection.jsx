import { ScrollView } from "react-native";
import React from "react";
import Category from "./Category";
import SearchBar from "./SerachBar";

function HorizontalCategorySection({ categories, onCategoryPress }) {
  return (
    <>
      <ScrollView horizontal className="flex-row py-2">
        {categories.map((category) => (
          <Category key={category.id} category={category} onPress={() => onCategoryPress(category.id)} />
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

export default HorizontalCategorySection;
