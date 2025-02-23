// import useColorTheme from "src/hooks/useColorTheme";
// import { StyleSheet, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
// import React, { useCallback, useEffect } from "react";
// import logger from "src/utils/logger";

// export default function AnimatedMenuSkeletonLoader() {
//   logger.render("AnimatedMenuSkeletonLoader");

//   const colorTheme = useColorTheme();

//   const opacity = useSharedValue(0.4);

//   const startAnimation = useCallback(() => {
//     opacity.value = withRepeat(withTiming(1, { duration: 800 }), -1, true);
//   }, [opacity]);

//   useEffect(() => {
//     startAnimation();
//   }, [startAnimation]);

//   const animatedStyle = useAnimatedStyle(() => ({
//     opacity: opacity.value,
//   }));

//   return (
//     <SafeAreaView style={{ backgroundColor: colorTheme.background.primary }}>
//       <Animated.View
//         style={[styles.logoSection, { backgroundColor: colorTheme.background.card }, animatedStyle]}
//       />
//       <View style={[styles.horizontalCategorySection]}>
//         {Array.from({ length: 3 }).map((_, index) => {
//           return (
//             <Animated.View
//               key={index}
//               style={[
//                 styles.horizontalCategory,
//                 { backgroundColor: colorTheme.background.card },
//                 animatedStyle,
//               ]}
//             />
//           );
//         })}
//       </View>

//       <Animated.View
//         style={[styles.searchBar, { backgroundColor: colorTheme.background.card }, animatedStyle]}
//       />

//       <Animated.View
//         style={[styles.verticalCategoryText, { backgroundColor: colorTheme.background.card }, animatedStyle]}
//       />

//       {Array.from({ length: 2 }).map((_, index) => (
//         <Animated.View
//           key={index}
//           style={[styles.productContainer, { backgroundColor: colorTheme.background.card }, animatedStyle]}
//         >
//           <Animated.View
//             style={[styles.productImage, { backgroundColor: colorTheme.background.onCard }, animatedStyle]}
//           />
//         </Animated.View>
//       ))}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   logoSection: {
//     width: "98%",
//     height: 176,
//     alignSelf: "center",
//     borderRadius: 28,
//   },
//   horizontalCategorySection: {
//     flexDirection: "row",
//     paddingVertical: 12,
//   },
//   horizontalCategory: {
//     width: 145,
//     height: 50,
//     borderRadius: 12,
//     marginHorizontal: 8,
//   },
//   searchBar: {
//     width: "90%",
//     height: 40,
//     alignSelf: "center",
//     borderRadius: 9999,
//   },
//   verticalCategoryText: {
//     width: "40%",
//     height: 16,
//     marginTop: 35,
//     marginHorizontal: 22,
//     borderRadius: 9999,
//   },
//   productContainer: {
//     width: "90%",
//     height: 180,
//     flexDirection: "row",
//     alignSelf: "center",
//     marginVertical: 20,
//     borderRadius: 12,
//   },
//   productImage: {
//     aspectRatio: 1,
//     width: "40%",
//     marginHorizontal: "2%",
//     marginVertical: "5%",
//     borderRadius: 9999,
//   },
// });
