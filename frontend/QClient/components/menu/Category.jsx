import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Category({ category, onPress, style }) {
  return (
    <View style={style}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{category.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f6f6f6",
    borderRadius: 12,
    marginHorizontal: 4,
    ...Platform.select({
      // TODO: Test if this works
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  text: {
    fontWeight: "bold",
  },
});
