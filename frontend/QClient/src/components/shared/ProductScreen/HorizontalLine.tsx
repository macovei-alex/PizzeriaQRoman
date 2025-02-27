import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";

type HorizontalLineProps = {
  style?: StyleProp<ViewStyle>;
};

export default function HorizontalLine({ style }: HorizontalLineProps) {
  const colorTheme = useColorTheme();

  return <View style={[styles.line, { backgroundColor: colorTheme.text.primary }, style]} />;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
  },
});
