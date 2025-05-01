import React from "react";
import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useColorTheme from "src/hooks/useColorTheme";

type Props = {
  text?: string;
};

export default function ScreenActivityIndicator({ text }: Props) {
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView style={styles.loadingContainer}>
      <Text style={styles.loadingText}>{text}</Text>
      <ActivityIndicator size={70} color={colorTheme.background.accent} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loadingText: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
});
