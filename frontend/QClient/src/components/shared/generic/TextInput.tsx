import React, { RefObject } from "react";
import { View, Text, TextInput, StyleSheet, TextInputProps, StyleProp, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";

interface TextInputComponentProps extends TextInputProps {
  label: string;
  style?: StyleProp<ViewStyle>;
  ref?: RefObject<TextInput>;
}

export default function TextInputComponent({
  ref,
  label,
  placeholder,
  style,
  ...rest
}: TextInputComponentProps) {
  const colorTheme = useColorTheme();
  const flattenedStyle = style ? StyleSheet.flatten(style) : undefined;

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.labelContainer,
          { backgroundColor: flattenedStyle?.backgroundColor ?? colorTheme.background.primary },
        ]}
      >
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput ref={ref} style={[styles.input, style]} placeholder={placeholder} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    paddingVertical: 12,
  },
  labelContainer: {
    position: "absolute",
    top: 2,
    left: 16,
    paddingHorizontal: 4,
    zIndex: 1,
  },
  label: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
});
