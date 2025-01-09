import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Option from "./Option";

export default function OptionList({ optionList }) {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{optionList.text}</Text>
      {optionList.options.map((option) => (
        <Option key={option.id} option={option} />
      ))}
      <Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  titleText: {
    fontStyle: "italic",
    fontSize: 24,
  },
});
