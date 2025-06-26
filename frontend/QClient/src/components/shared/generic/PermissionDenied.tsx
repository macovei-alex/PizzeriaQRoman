import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";

type PermissionDeniedProps = {
  text: string;
};

export default function PermissionDenied({ text }: PermissionDeniedProps) {
  const { theme } = useUnistyles();
  return (
    <SafeAreaView style={styles.container}>
      <AntDesign name="exclamationcircleo" size={50} color={theme.background.accent} />
      <Text style={styles.text} numberOfLines={4}>
        {text}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 32,
    backgroundColor: theme.background.primary,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.text.primary,
  },
}));
