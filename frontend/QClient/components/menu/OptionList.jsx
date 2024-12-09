import { View, Text } from "react-native";
import React from "react";
import MenuProductOption from "./Option";
import Option from "./Option";

function OptionList({ optionList }) {
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

export default OptionList;
