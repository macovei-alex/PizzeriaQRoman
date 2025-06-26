import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { Category } from "src/api/types/Category";
import logger from "src/utils/logger";

type HorizontalCategoryProps = {
  category: Category;
  onPress: () => void;
  style?: any;
  onLayout?: (event: any) => void;
  highlight?: boolean;
};

export default function CategoryTouchable({
  category,
  onPress,
  style,
  onLayout,
  highlight = false,
}: HorizontalCategoryProps) {
  logger.render("CategoryTouchable");

  return (
    <View style={style} onLayout={onLayout}>
      <TouchableOpacity style={styles.button(highlight)} onPress={onPress}>
        <Text style={styles.text}>{category.name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  button: (highlight: boolean) => ({
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: !highlight ? theme.background.elevated : theme.background.card,
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
  }),
  text: {
    fontWeight: "bold",
    color: theme.text.primary,
  },
}));
