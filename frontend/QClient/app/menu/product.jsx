import { Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../context/useGlobalContext";

export default function Option() {
  const { gProduct: product } = useGlobalContext();
  return (
    <SafeAreaView>
      <Text>
        {product === null
          ? "product null"
          : product.name ?? "product.name null"}
      </Text>
    </SafeAreaView>
  );
}
