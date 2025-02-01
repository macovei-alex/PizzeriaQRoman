import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import useColorTheme from "../../../hooks/useColorTheme";
import TickCheckboxSvg from "../../svg/TickCheckboxSvg";
import { Option } from "@/api/types/Product";

type OptionCardProps = {
  option: Option;
  checked: boolean;
  customOnPress: (optionId: number) => void;
};

export default function OptionCard({ option, checked, customOnPress }: OptionCardProps) {
  const colorTheme = useColorTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.checkboxContainer, { borderColor: colorTheme.text[100] }]}
        onPress={() => customOnPress(option.id)}
      >
        <TickCheckboxSvg checked={checked} style={styles.checkbox} />
      </TouchableOpacity>
      <Text style={[styles.optionNameText, { color: colorTheme.text[100] }]}>{option.name}</Text>
      {option.price > 0 && (
        <Text style={[styles.priceText, { color: colorTheme.text[400] }]}>
          +{option.price.toFixed(2)} lei
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 30,
    height: 30,
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
