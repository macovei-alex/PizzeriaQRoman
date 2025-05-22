import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { Category } from "src/api/types/Category";
import logger from "src/utils/logger";

type HorizontalCategoryProps = {
  category: Category;
  onPress: () => void;
  style?: any;
  onLayout?: (event: any) => void;
};

export default function CategoryTouchable({ category, onPress, style, onLayout }: HorizontalCategoryProps) {
  logger.render("CategoryTouchable");

  const colorTheme = useColorTheme();

  return (
    <View style={style} onLayout={onLayout}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: colorTheme.background.elevated }]}
        onPress={onPress}
      >
        <Text style={[styles.text, { color: colorTheme.text.primary }]}>{category.name}</Text>
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
