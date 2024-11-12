import React from "react";
import { Text, View } from "react-native";

function MenuCategory({ name }) {
  return (
    <View className="p-3 px-4 mx-1 rounded-xl bg-bg-600">
      <Text className="font-bold">{name}</Text>
    </View>
  );
}

export default MenuCategory;
