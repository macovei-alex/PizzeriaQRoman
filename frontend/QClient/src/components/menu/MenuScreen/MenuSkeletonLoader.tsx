import { Animated, Easing, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useRef } from "react";
import logger from "src/utils/logger";

const opacityAnimParams = { min: 0.5, max: 1, duration: 500 };

export default function MenuSkeletonLoader() {
  logger.render("MenuSkeletonLoader");

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
    <SafeAreaView style={styles.screen}>
      <Animated.View style={styles.logoSection(opacityAnim)} />
      <View style={[styles.horizontalCategorySection]}>
        {Array.from({ length: 3 }).map((_, index) => {
          return <Animated.View key={index} style={[styles.horizontalCategory(opacityAnim)]} />;
        })}
      </View>

      <Animated.View style={styles.searchBar(opacityAnim)} />
      <Animated.View style={styles.verticalCategoryText(opacityAnim)} />

      {Array.from({ length: 2 }).map((_, index) => (
        <Animated.View key={index} style={styles.productContainer(opacityAnim)}>
          <Animated.View style={styles.productImage(opacityAnim)} />
        </Animated.View>
      ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  screen: { backgroundColor: theme.background.primary },
  logoSection: (opacityAnim: Animated.Value) => ({
    width: "98%",
    height: 176,
    alignSelf: "center",
    borderRadius: 28,
    backgroundColor: theme.background.card,
    opacity: opacityAnim,
  }),
  horizontalCategorySection: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  horizontalCategory: (opacityAnim: Animated.Value) => ({
    width: 145,
    height: 50,
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: theme.background.card,
    opacity: opacityAnim,
  }),
  searchBar: (opacityAnim: Animated.Value) => ({
    width: "90%",
    height: 40,
    alignSelf: "center",
    borderRadius: 9999,
    backgroundColor: theme.background.card,
    opacity: opacityAnim,
  }),
  verticalCategoryText: (opacityAnim: Animated.Value) => ({
    width: "40%",
    height: 16,
    marginTop: 35,
    marginHorizontal: 22,
    borderRadius: 9999,
    backgroundColor: theme.background.card,
    opacity: opacityAnim,
  }),
  productContainer: (opacityAnim: Animated.Value) => ({
    width: "90%",
    height: 180,
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 20,
    borderRadius: 12,
    backgroundColor: theme.background.card,
    opacity: opacityAnim,
  }),
  productImage: (opacityAnim: Animated.Value) => ({
    aspectRatio: 1,
    width: "40%",
    marginHorizontal: "2%",
    marginVertical: "5%",
    borderRadius: 9999,
    backgroundColor: theme.background.onCard,
    opacity: opacityAnim,
  }),
}));
