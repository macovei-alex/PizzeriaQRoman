import React from "react";
import { ColorValue, StyleProp, View, ViewStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

type HorizontalLineProps = {
  style?: StyleProp<ViewStyle>;
  color?: ColorValue;
};

export default function HorizontalLine({ style, color }: HorizontalLineProps) {
  return <View style={[styles.line(color), style]} />;
}

const styles = StyleSheet.create((theme) => ({
  line: (color?: ColorValue) => ({
    width: "100%",
    height: 1,
    backgroundColor: color ?? theme.text.primary,
  }),
}));
