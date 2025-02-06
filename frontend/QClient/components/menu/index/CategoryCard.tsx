import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "@/hooks/useColorTheme";
import { Category } from "@/api/types/Category";
import logger from "@/utils/logger";

type CategoryCardProps = {
  category: Category;
  onPress: () => void;
  style?: any;
};

export default function CategoryCard({ category, onPress, style }: CategoryCardProps) {
  logger.render("CategoryCard");

  const colorTheme = useColorTheme();

  return (
    <View style={style}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colorTheme.background[700] }]}
        onPress={onPress}
      >
        <Text style={[styles.text, { color: colorTheme.text[100] }]}>{category.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    ...Platform.select({
      // TODO: Test if this works on iOS
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
