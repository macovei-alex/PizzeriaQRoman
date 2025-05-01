import useColorTheme from "src/hooks/useColorTheme";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef } from "react";
import logger from "src/utils/logger";

const opacityAnimParams = { min: 0.5, max: 1, duration: 500 };

export default function MenuSkeletonLoader() {
  logger.render("MenuSkeletonLoader");

  const colorTheme = useColorTheme();
  const opacityAnim = useRef(new Animated.Value(opacityAnimParams.min)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: opacityAnimParams.max,
          duration: opacityAnimParams.duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(opacityAnim, {
          toValue: opacityAnimParams.min,
          duration: opacityAnimParams.duration,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
      <Animated.View
        style={[styles.logoSection, { backgroundColor: colorTheme.background.card, opacity: opacityAnim }]}
      />
      <View style={[styles.horizontalCategorySection]}>
        {Array.from({ length: 3 }).map((_, index) => {
          return (
            <Animated.View
              key={index}
              style={[
                styles.horizontalCategory,
                { backgroundColor: colorTheme.background.card, opacity: opacityAnim },
              ]}
            />
          );
        })}
      </View>

      <Animated.View
        style={[styles.searchBar, { backgroundColor: colorTheme.background.card, opacity: opacityAnim }]}
      />

      <Animated.View
        style={[
          styles.verticalCategoryText,
          { backgroundColor: colorTheme.background.card, opacity: opacityAnim },
        ]}
      />

      {Array.from({ length: 2 }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.productContainer,
            { backgroundColor: colorTheme.background.card, opacity: opacityAnim },
          ]}
        >
          <Animated.View
            style={[
              styles.productImage,
              { backgroundColor: colorTheme.background.onCard, opacity: opacityAnim },
            ]}
          />
        </Animated.View>
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
