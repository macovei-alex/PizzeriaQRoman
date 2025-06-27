import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";

type PermissionDeniedProps = {
  text: string;
};

export default function PermissionDenied({ text }: PermissionDeniedProps) {
  return (
    <SafeAreaView style={styles.container}>
      <UAntDesign name="exclamationcircleo" size={50} />
      <Text style={styles.text} numberOfLines={4}>
        {text}
      </Text>
    </SafeAreaView>
  );
}

const UAntDesign = withUnistyles(AntDesign, (theme) => ({
  color: theme.background.accent,
}));

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
