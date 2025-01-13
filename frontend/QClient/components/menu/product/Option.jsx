import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useColorTheme } from "../../../hooks/useColorTheme";

export default function Option({ option, checked, customOnPress }) {
  const colorTheme = useColorTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.checkbox,
          {
            borderColor: colorTheme.text[100],
            backgroundColor: checked ? colorTheme.background[300] : colorTheme.background[600],
          },
        ]}
        onPress={() => customOnPress(option.id)}
      />
      <Text style={styles.optionNameText}>{option.name}</Text>
      {option.price > 0 ? (
        <Text style={[styles.priceText, { color: colorTheme.text[400] }]}>
          +{option.price.toFixed(2)} lei
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkbox: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    borderWidth: 2,
    marginRight: 12,
  },
  optionNameText: {
    fontSize: 16,
    flexGrow: 1,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
