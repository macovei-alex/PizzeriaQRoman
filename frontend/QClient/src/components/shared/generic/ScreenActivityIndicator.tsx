import React from "react";
import { ActivityIndicator, Text } from "react-native";
import { StyleSheet, withUnistyles } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  text?: string;
};

export default function ScreenActivityIndicator({ text }: Props) {
  return (
    <SafeAreaView style={styles.loadingContainer}>
      <Text style={styles.loadingText}>{text}</Text>
      <UActivityIndicator size={70} />
    </SafeAreaView>
  );
}

const UActivityIndicator = withUnistyles(ActivityIndicator, (theme) => ({
  color: theme.text.accent,
}));

const styles = StyleSheet.create((theme) => ({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: theme.background.primary,
  },
  loadingText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    color: theme.text.primary,
  },
}));
