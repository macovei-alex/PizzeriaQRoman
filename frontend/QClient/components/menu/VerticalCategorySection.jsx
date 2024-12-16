import { View, Text } from "react-native";
import React from "react";
import MenuProduct from "./MenuProduct";

function VerticalCategorySection({ category, products, customOnLayout, onMenuProductClick }) {
  return (
    <View
      key={category.id}
      onLayout={(event) => {
        // Save the position of each category for the scroll to position from the horizontal menu
        customOnLayout(category.id, event);
      }}
      className="my-2"
    >
      <View className="ml-6">
        <Text className="text-xl font-extrabold">{category.name}</Text>
      </View>
      {products.map((product) => (
        <MenuProduct key={product.id} product={product} onPress={() => onMenuProductClick(product)} />
      ))}
    </View>
  );
}

export default VerticalCategorySection;
