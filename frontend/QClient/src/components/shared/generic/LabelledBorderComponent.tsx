import React from "react";
import { View, Text, StyleProp, ViewStyle, TextStyle } from "react-native";
import { StyleSheet } from "react-native-unistyles";

interface LabelledBorderComponentProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  labelContainerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

export default function LabelledBorderComponent({
  label,
  style,
  containerStyle,
  labelContainerStyle,
  labelStyle,
  children,
}: LabelledBorderComponentProps) {
  const flattenedStyle = style ? StyleSheet.flatten(style) : {};
  const backgroundColor = flattenedStyle?.backgroundColor
    ? { backgroundColor: flattenedStyle.backgroundColor }
    : {};

  return (
    <View style={[styles.container, style, containerStyle]}>
      <View style={[styles.labelContainer, backgroundColor, labelContainerStyle]}>
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    position: "relative",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 16,
    fontSize: 16,
  },
  labelContainer: {
    position: "absolute",
    top: -12,
    left: 16,
    paddingHorizontal: 4,
    zIndex: 1,
    backgroundColor: theme.background.primary,
  },
  label: {
    fontSize: 12,
  },
}));
