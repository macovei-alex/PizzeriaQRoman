import { Text } from "react-native";
import React from "react";
import Option from "./Option";

export default function OptionList({ optionList }) {
  return (
    <>
      <Text>optionList: {optionList.id}</Text>
      {optionList.options.map((option) => (
        <Option key={option.id.toString()} option={option} />
      ))}
      <Text></Text>
    </>
  );
}
