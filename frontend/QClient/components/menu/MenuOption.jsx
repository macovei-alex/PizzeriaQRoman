import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const MenuOption = ({ product }) => {
  return (
    <View className="flex-row mx-3 my-5 rounded-xl bg-bg-400">
      <Image
        source={product.image}
        className="w-[45%] m-1 aspect-square rounded-full"
      />
      <View className="flex-col p-3">
        <View className="items-center">
          <Text className="font-extrabold">{product.name}</Text>
        </View>
        <View className="items-center">
          <Text>{product.subtitle}</Text>
        </View>
        <View className="items-end mt-8">
          <Text className="text-lg">{`${product.price.toFixed(2)} RON`}</Text>
        </View>
        <View className="items-center justify-center px-6 py-3 mt-8 ml-2 -mb-8 -mr-4 rounded-l bg-bg-500">
          <TouchableOpacity>
            <Text className="text-txt-300">Informatii produs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MenuOption;
