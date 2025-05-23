import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useColorTheme from "src/hooks/useColorTheme";

type PermissionDeniedProps = {
  text: string;
};

export default function PermissionDenied({ text }: PermissionDeniedProps) {
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorTheme.background.primary }]}>
      <AntDesign name="exclamationcircleo" size={50} color={colorTheme.background.accent} />
      <Text style={[styles.text, { color: colorTheme.text.primary }]} numberOfLines={4}>
        {text}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 32,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
