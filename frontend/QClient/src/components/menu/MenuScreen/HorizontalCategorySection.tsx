import React, { useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import CategoryTouchable from "./CategoryTouchable";
import { Category, CategoryId } from "src/api/types/Category";
import logger from "src/constants/logger";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import useScrollRef from "src/hooks/useScrollRef";
import { useScrollOffsets } from "src/hooks/useScrollOffsets";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "MainTabNavigator">;

type HorizontalCategorySectionProps = {
  categories: Category[];
  verticalOffsets: Map<CategoryId, number>;
  onCategoryPress: (categoryId: CategoryId) => void;
  scrollY: number;
};

export default function HorizontalCategorySection({
  categories,
  verticalOffsets,
  onCategoryPress,
  scrollY,
}: HorizontalCategorySectionProps) {
  logger.render("HorizontalCategorySection");

  const navigation = useNavigation<NavigationProps>();

  const { scrollRef, scrollToPos } = useScrollRef();
  const horizontal = useScrollOffsets<CategoryId>();

  const categoryLimits = useMemo(() => {
    if (verticalOffsets.size === 0) return [];
    const limits = [];
    const sortedOffsets = Array.from(verticalOffsets).sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < sortedOffsets.length - 1; ++i) {
      limits.push({
        categoryId: sortedOffsets[i][0],
        min: sortedOffsets[i][1] - 150,
        max: sortedOffsets[i + 1][1] - 150,
      });
    }
    if (sortedOffsets.length >= 1) {
      limits.push({
        categoryId: sortedOffsets[sortedOffsets.length - 1][0],
        min: sortedOffsets[sortedOffsets.length - 1][1] - 150,
        max: Number.MAX_SAFE_INTEGER,
      });
    }
    return limits;
  }, [verticalOffsets]);

  const [limitsIndex, setLimitsIndex] = useState(0);

  useEffect(() => {
    const windowWidth = Dimensions.get("window").width;
    const currentLimits = categoryLimits[limitsIndex];
    if (!currentLimits) return;
    if (scrollY < currentLimits.min && limitsIndex > 0) {
      const categoryId = categoryLimits[limitsIndex - 1].categoryId;
      const horizontalOffset = horizontal.offsets.get(categoryId);
      if (!horizontalOffset) return;
      setLimitsIndex(limitsIndex - 1);
      scrollToPos({ x: horizontalOffset - windowWidth / 2 + 50 });
    } else if (currentLimits.max < scrollY && limitsIndex < categoryLimits.length - 1) {
      const categoryId = categoryLimits[limitsIndex + 1].categoryId;
      const horizontalOffset = horizontal.offsets.get(categoryId);
      if (!horizontalOffset) return;
      setLimitsIndex(limitsIndex + 1);
      scrollToPos({ x: horizontalOffset - windowWidth / 2 + 50 });
    }
  }, [scrollY, limitsIndex, categoryLimits, scrollToPos, horizontal.offsets]);

  const currentCategoryId = categoryLimits[limitsIndex]?.categoryId;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        ref={scrollRef}
        style={styles.scrollContainer}
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
      >
        {categories.map((category) => (
          <CategoryTouchable
            style={styles.category}
            key={category.id}
            category={category}
            onPress={() => onCategoryPress(category.id)}
            onLayout={(event) => horizontal.addOffset(category.id, event.nativeEvent.layout.x)}
            highlight={category.id === currentCategoryId}
          />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.searchBarContainer} onPress={() => navigation.navigate("SearchScreen")}>
        <SearchIconSvg style={styles.searchIcon} />
        <Text style={styles.searchBarText}>Caută ce îți dorești</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingBottom: 12,
    backgroundColor: theme.background.primary,
  },
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
    backgroundColor: theme.background.elevated,
  },
  searchIcon: {
    width: 40,
    height: 40,
  },
  searchBarText: {
    textAlign: "center",
    flexGrow: 1,
    left: -20,
    color: theme.text.primary,
  },
}));
