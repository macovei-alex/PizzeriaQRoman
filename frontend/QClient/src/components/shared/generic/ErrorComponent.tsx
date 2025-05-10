import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ErrorComponentProps = {
  onRetry?: () => void;
};

export default function ErrorComponent({ onRetry }: ErrorComponentProps) {
  const queryClient = useQueryClient();
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Something went wrong</Text>
      <Button
        title="Retry"
        onPress={() => {
          queryClient.invalidateQueries({ refetchType: "active" });
          if (onRetry) onRetry();
        }}
      />
    </SafeAreaView>
  );
}
