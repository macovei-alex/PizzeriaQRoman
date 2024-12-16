import { View, Text, ImageBackground, TouchableOpacity, Image } from "react-native";
import React from "react";
import GoBackButtonSVG from "../svg/GoBackButtonSVG";
import { images } from "../../constants";

function LogoSection({ onBackButtonPress }) {
  return (
    <View>
      <ImageBackground source={images.menuBackground} className="w-full h-44">
        <View className="absolute">
          <TouchableOpacity onPress={onBackButtonPress} className="mt-4 ml-1">
            <GoBackButtonSVG width={38} height={38} />
          </TouchableOpacity>
        </View>
        <View className="flex items-center justify-around h-full py-2">
          <Image source={images.logo} className="h-20 w-44 rounded-xl" resizeMode="stretch" />
          <View className="rounded-lg opacity-75 bg-bg-300">
            <Text className="px-4 py-1 font-bold">Comanda minimă este de 40 RON</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default LogoSection;
