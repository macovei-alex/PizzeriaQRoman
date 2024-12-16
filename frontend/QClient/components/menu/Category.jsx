import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function Category({ category, onPress }) {
  return (
    <View className="py-2">
      <TouchableOpacity
        className="px-4 py-3 mx-2 rounded-xl bg-bg-600"
        style={styles.shadowContainer}
        onPress={onPress}
      >
        <Text className="font-bold">{category.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
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
});

export default Category;
