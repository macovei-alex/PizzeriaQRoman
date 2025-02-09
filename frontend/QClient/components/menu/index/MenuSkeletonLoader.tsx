import useColorTheme from "@/hooks/useColorTheme";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MenuSkeletonLoader() {
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
      <View style={[styles.logoSection, { backgroundColor: colorTheme.background.card }]} />
      <View style={[styles.horizontalCategorySection]}>
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <View
              key={index}
              style={[styles.horizontalCategory, { backgroundColor: colorTheme.background.card }]}
            />
          );
        })}
      </View>

      <View style={[styles.searchBar, { backgroundColor: colorTheme.background.card }]} />

      <View style={[styles.verticalCategoryText, { backgroundColor: colorTheme.background.card }]} />

      {Array.from({ length: 2 }).map((_, index) => (
        <View key={index} style={[styles.productContainer, { backgroundColor: colorTheme.background.card }]}>
          <View style={[styles.productImage, { backgroundColor: colorTheme.background.onCard }]} />
        </View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoSection: {
    width: "98%",
    height: 176,
    alignSelf: "center",
    borderRadius: 28,
  },
  horizontalCategorySection: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  horizontalCategory: {
    width: 145,
    height: 50,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  searchBar: {
    width: "90%",
    height: 40,
    alignSelf: "center",
    borderRadius: 9999,
  },
  verticalCategoryText: {
    width: "40%",
    height: 16,
    marginTop: 35,
    marginHorizontal: 22,
    borderRadius: 9999,
  },
  productContainer: {
    width: "90%",
    height: 180,
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 12,
  },
  productImage: {
    aspectRatio: 1,
    width: "40%",
    marginHorizontal: "2%",
    marginVertical: "5%",
    borderRadius: 9999,
  },
});
