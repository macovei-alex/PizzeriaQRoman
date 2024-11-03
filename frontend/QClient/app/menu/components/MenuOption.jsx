import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const MenuOption = ({ name, description, price, image }) => {
  return (
    <View className="flex-row m-3 mt-5 mb-5 rounded-xl bg-bg-400">
      <Image
        source={image}
        className="w-[45%] m-1 aspect-square rounded-full"
      />
      <View className="flex-col p-3">
        <View className="items-center">
          <Text className="font-bold">{name}</Text>
        </View>
        <View className="items-center">
          <Text>{description}</Text>
        </View>
        <View className="items-end mt-8">
          <Text className="text-m">{`${price.toFixed(2)} RON`}</Text>
        </View>
        <View className="items-center justify-center p-6 pt-3 pb-3 mt-8 ml-2 -mb-8 -mr-4 rounded-l bg-bg-500">
          <TouchableOpacity>
            <Text className="text-txt-300">Informatii produs</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MenuOption;
