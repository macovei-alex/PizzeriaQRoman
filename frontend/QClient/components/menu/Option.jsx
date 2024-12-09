import { View, Text } from "react-native";
import React from "react";

function Option({ option }) {
  return (
    <>
      <Text>
        {option.name} {option.additionalDescription} {option.price}{" "}
        {option.minCount} {option.maxCount}
      </Text>
    </>
  );
}

export default Option;
