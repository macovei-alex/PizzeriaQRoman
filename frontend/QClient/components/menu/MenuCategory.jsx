import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

function MenuCategory({ category }) {
  return (
    <View className="py-2">
      <View
        className="px-4 py-3 mx-1 rounded-xl bg-bg-600"
        style={styles.shadowContainer}
      >
        <Text className="font-bold">{category.name}</Text>
      </View>
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

export default MenuCategory;
