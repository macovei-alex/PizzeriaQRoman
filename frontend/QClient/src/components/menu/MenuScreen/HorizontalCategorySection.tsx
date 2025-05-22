import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryTouchable from "./CategoryTouchable";
import { Category, CategoryId } from "src/api/types/Category";
import logger from "src/utils/logger";
import SearchIconSvg from "src/components/svg/SearchIconSvg";
import useColorTheme from "src/hooks/useColorTheme";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/navigation/RootStackNavigator";
import useScrollRef from "src/hooks/useScrollRef";
import { useScrollOffsets } from "src/hooks/useScrollOffsets";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, "MainTabNavigator">;

type HorizontalCategorySectionProps = {
  categories: Category[];
  verticalOffsets: Record<CategoryId, number>;
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

  const colorTheme = useColorTheme();
  const navigation = useNavigation<NavigationProps>();

  const { scrollRef, scrollToPos } = useScrollRef();
  const horizontal = useScrollOffsets<CategoryId>();
  const updateHorizontalOffsets = useCallback(
    (categoryId: CategoryId, event: LayoutChangeEvent) =>
      horizontal.addOffset(categoryId, event.nativeEvent.layout.x),
    [horizontal]
  );

  const categoryLimits = useMemo(() => {
    const limits = [];
    const sortedOffsets = Object.entries(verticalOffsets).sort((a, b) => a[1] - b[1]);
    for (let i = 0; i < sortedOffsets.length - 1; ++i) {
      limits.push({
        categoryId: Number(sortedOffsets[i][0]),
        min: sortedOffsets[i][1],
        max: sortedOffsets[i + 1][1],
      });
    }
    return limits;
  }, [verticalOffsets]);

  const [limitsIndex, setLimitsIndex] = useState(0);

  useEffect(() => {
    const windowWidth = Dimensions.get("window").width;
    const currentLimits = categoryLimits[limitsIndex];
    if (currentLimits) {
      if (scrollY < currentLimits.min && limitsIndex > 0) {
        const categoryId = categoryLimits[limitsIndex - 1].categoryId;
        setLimitsIndex(limitsIndex - 1);
        scrollToPos({ x: horizontal.offsets[categoryId] - windowWidth / 2 + 50 });
      } else if (currentLimits.max < scrollY && limitsIndex < categoryLimits.length - 1) {
        const categoryId = categoryLimits[limitsIndex + 1].categoryId;
        setLimitsIndex(limitsIndex + 1);
        scrollToPos({ x: horizontal.offsets[categoryId] - windowWidth / 2 + 50 });
      }
    }
  }, [scrollY, limitsIndex, categoryLimits, scrollToPos, horizontal.offsets]);

  const currentCategoryId = categoryLimits[limitsIndex].categoryId;

  return (
    <View style={[styles.container, { backgroundColor: colorTheme.background.primary }]}>
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
            onLayout={(event) => updateHorizontalOffsets(category.id, event)}
            highlight={category.id === currentCategoryId}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 12,
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
