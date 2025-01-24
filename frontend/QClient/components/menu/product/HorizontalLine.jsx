import { StyleSheet, View } from "react-native";
import React from "react";

export default function HorizontalLine({ style }) {
  return <View style={[styles.line, style]}></View>;
}

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
  },
});
