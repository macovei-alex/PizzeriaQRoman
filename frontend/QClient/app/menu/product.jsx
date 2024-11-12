import { Image, Text, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";
import { useRouter } from "expo-router";
import GoBackButton from "../../components/svg/GoBackButton";

export default function Option() {
  const router = useRouter();
  const { gProduct: product } = useGlobalContext();

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.back()}>
        <GoBackButton width={100} height={100} />
      </TouchableOpacity>
      <Text>{product.name}</Text>
    </SafeAreaView>
  );
}
