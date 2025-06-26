import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet, UnistylesRuntime } from "react-native-unistyles";

function calculateScrollProgress(scrollY: number, visibleHeight: number, contentHeight: number) {
  const maxScrollable = contentHeight - visibleHeight;
  if (maxScrollable <= 0) return 0;
  return Math.min(scrollY / maxScrollable, 1);
}

function interpolate(percent: number, min: number, max: number) {
  return min + (max - min) * percent;
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
  return (
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button(visibleHeight, contentHeight, scrollY)}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  floatingButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  button: (visibleHeight: number, contentHeight: number, scrollY: number) => {
    const screenWidth = UnistylesRuntime.screen.width;
    const scrollProgress = calculateScrollProgress(scrollY, visibleHeight, contentHeight);
    return {
      paddingVertical: 12,
      borderRadius: 24,
      alignItems: "center",
      backgroundColor: theme.background.accent,
      width: interpolate(scrollProgress, screenWidth + 50, 240),
      bottom: interpolate(scrollProgress, -24, -8),
    };
  },
  buttonText: {
    fontSize: 18,
    color: theme.text.onAccent,
  },
}));
