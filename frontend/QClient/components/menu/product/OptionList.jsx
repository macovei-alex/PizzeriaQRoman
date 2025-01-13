import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Option from "./Option";

export default function OptionList({ optionList }) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  function handleOptionPress(optionId) {
    if (selectedOptions.includes(optionId)) {
      setSelectedOptions(selectedOptions.filter((id) => id !== optionId));
    } else {
      if (selectedOptions.length < optionList.maxChoices) {
        setSelectedOptions([...selectedOptions, optionId]);
      } else if (optionList.maxChoices === 1) {
        setSelectedOptions([optionId]);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{optionList.text}</Text>
      {optionList.options.map((option) => (
        <Option
          key={option.id}
          option={option}
          checked={selectedOptions.includes(option.id)}
          customOnPress={handleOptionPress}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
  },
  titleText: {
    fontStyle: "italic",
    fontSize: 22,
    marginBottom: 12,
  },
});
