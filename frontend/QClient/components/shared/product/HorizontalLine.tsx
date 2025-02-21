import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type HorizontalLineProps = {
  style?: StyleProp<ViewStyle>;
};

export default function HorizontalLine({ style }: HorizontalLineProps) {
  return <View style={[styles.line, style]}></View>;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
  },
});
