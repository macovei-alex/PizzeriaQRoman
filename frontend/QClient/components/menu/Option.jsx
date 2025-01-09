import { Text } from "react-native";
import React from "react";

export default function Option({ option }) {
  return (
    <>
      <Text>
        {option.name} {option.additionalDescription} {option.price} {option.minCount} {option.maxCount}
      </Text>
    </>
  );
}
