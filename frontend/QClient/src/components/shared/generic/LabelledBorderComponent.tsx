import React from "react";
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";

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
  const colorTheme = useColorTheme();
  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  return (
    <View style={[styles.container, style, containerStyle]}>
      <View
        style={[
          styles.labelContainer,
          { backgroundColor: flattenedStyle?.backgroundColor ?? colorTheme.background.primary },
          labelContainerStyle,
        ]}
      >
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
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
  },
  label: {
    fontSize: 12,
  },
});
