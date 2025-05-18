import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import CategoryTouchable from "./CategoryTouchable";
import { Category, CategoryId } from "src/api/types/Category";
import logger from "src/utils/logger";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import useColorTheme from "src/hooks/useColorTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/RootStackNavigator";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "MainTabNavigator">;

type HorizontalCategorySectionProps = {
  categories: Category[];
  onCategoryPress: (categoryId: CategoryId) => void;
};

export default function HorizontalCategorySection({
  categories,
  onCategoryPress,
}: HorizontalCategorySectionProps) {
  logger.render("HorizontalCategorySection");

  const colorTheme = useColorTheme();
  const navigation = useNavigation<NavigationProps>();

  return (
    <>
      <ScrollView horizontal style={styles.scrollContainer}>
        {categories.map((category) => (
          <CategoryTouchable
            style={styles.category}
            key={category.id}
            category={category}
            onPress={() => onCategoryPress(category.id)}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.searchBarContainer, { backgroundColor: colorTheme.background.elevated }]}
        onPress={() => navigation.navigate("ChatScreen")}
      >
        <SearchIconSvg style={styles.searchIcon} />
        <Text style={[styles.searchBarText, { color: colorTheme.text.primary }]}>Caută ce îți dorești</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 12,
  },
  category: {
    marginHorizontal: 8,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignSelf: "center",
    width: "90%",
    borderRadius: 9999,
    alignItems: "center",
  },
  searchIcon: {
    width: 40,
    height: 40,
  },
  searchBarText: {
    textAlign: "center",
    flexGrow: 1,
    left: -20,
  },
});
