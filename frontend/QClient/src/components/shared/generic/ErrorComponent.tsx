import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "src/constants/images";
import { useAuthContext } from "src/context/AuthContext";

type ErrorComponentProps = {
  onRetry?: () => void;
  size?: "fullscreen" | "small";
};

export default function ErrorComponent({ onRetry, size = "fullscreen" }: ErrorComponentProps) {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();

  return (
    <SafeAreaView style={styles.container}>
      {/* title */}
      <Text style={styles.title}>Ceva nu a mers bine...</Text>

      {/* image */}
      {size === "fullscreen" && <Image source={images.sadChef} style={styles.image} />}

      <View style={styles.buttonSection}>
        {/* retry button */}
        <TouchableOpacity
          style={styles.retryButtonContainer}
          onPress={() => {
            queryClient.invalidateQueries({ refetchType: "active" });
            if (onRetry) onRetry();
          }}
        >
          <Text style={styles.retryButtonText}>Reîncercare</Text>
        </TouchableOpacity>

        {/* disconnect button */}
        <TouchableOpacity
          style={styles.disconnectButtonContainer}
          onPress={() => {
            queryClient.invalidateQueries({ refetchType: "none" });
            authContext.logout();
          }}
        >
          <Text style={styles.disconnectButtonText}>Deconectare</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: theme.background.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.text.primary,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  buttonSection: {
    width: "100%",
    gap: 16,
  },
  retryButtonContainer: {
    padding: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    backgroundColor: theme.background.accent,
  },
  disconnectButtonContainer: {
    padding: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: theme.background.primary,
    borderColor: theme.text.primary,
  },
  retryButtonText: {
    fontSize: 18,
    fontWeight: "400",
    color: theme.text.onAccent,
  },
  disconnectButtonText: {
    fontSize: 18,
    fontWeight: "400",
    color: theme.text.primary,
  },
}));
