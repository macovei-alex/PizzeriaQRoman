import React from "react";
import { Dimensions, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { showToast } from "src/utils/toast";

function calculateScrollProgress(scrollY: number, visibleHeight: number, contentHeight: number) {
  const maxScrollable = contentHeight - visibleHeight;
  if (maxScrollable <= 0) return 0;
  return Math.min(scrollY / maxScrollable, 1);
}

function interpolate(percent: number, min: number, max: number) {
  return min + (max - min) * percent;
}

function calculateScrollingStyle(
  scrollY: number,
  visibleHeight: number,
  contentHeight: number,
  screenWidth: number
): StyleProp<ViewStyle> {
  const scrollProgress = calculateScrollProgress(scrollY, visibleHeight, contentHeight);
  return {
    width: interpolate(scrollProgress, screenWidth + 50, 240),
    bottom: interpolate(scrollProgress, -24, -8),
  };
}

type MorphingButtonProps = {
  text: string;
  onPress: () => void;
  scrollY: number;
  visibleHeight: number;
  contentHeight: number;
};

export default function MorphingButton({
  text,
  onPress,
  scrollY,
  visibleHeight,
  contentHeight,
}: MorphingButtonProps) {
  const colorTheme = useColorTheme();
  const screenWidth = Dimensions.get("screen").width;

  const scrollingStyle = calculateScrollingStyle(scrollY, visibleHeight, contentHeight, screenWidth);

  return (
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity
        onPress={() => {
          showToast("Produs adăugat in coș");
          onPress();
        }}
        style={[styles.button, { backgroundColor: colorTheme.background.accent }, scrollingStyle]}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: {
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
  },
});
