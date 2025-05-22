import React from "react";
import { ColorValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";

type HorizontalLineProps = {
  style?: StyleProp<ViewStyle>;
  color?: ColorValue;
};

export default function HorizontalLine({ style, color }: HorizontalLineProps) {
  const colorTheme = useColorTheme();
  return <View style={[styles.line, { backgroundColor: color ?? colorTheme.text.primary }, style]} />;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
  },
});
