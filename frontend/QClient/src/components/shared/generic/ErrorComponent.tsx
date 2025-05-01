import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ErrorComponentProps = {
  onRetry: () => void;
};

export default function ErrorComponent({ onRetry }: ErrorComponentProps) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Something went wrong</Text>
      <Button title="Retry" onPress={onRetry} />
    </SafeAreaView>
  );
}
