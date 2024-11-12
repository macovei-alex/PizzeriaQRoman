import { Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";
import { useRouter } from "expo-router";
import GoBackButtonSVG from "../../components/svg/GoBackButtonSVG";

export default function Product() {
  const router = useRouter();
  const { gProduct: product } = useGlobalContext();

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.back()}>
        <GoBackButtonSVG width={100} height={100} />
      </TouchableOpacity>
      <Text>{product.name}</Text>
    </SafeAreaView>
  );
}
