import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "src/constants";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";

type ErrorComponentProps = {
  onRetry?: () => void;
};

export default function ErrorComponent({ onRetry }: ErrorComponentProps) {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();
  const colorTheme = useColorTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colorTheme.background.primary }]}>
      {/* title */}
      <Text style={[styles.title, { color: colorTheme.text.primary }]}>Ceva nu a mers bine...</Text>

      {/* image */}
      <Image source={images.sadChef} style={styles.image} />

      <View style={styles.buttonSection}>
        {/* retry button */}
        <TouchableOpacity
          style={[styles.buttonContainer, { backgroundColor: colorTheme.background.accent }]}
          onPress={() => {
            queryClient.invalidateQueries({ refetchType: "active" });
            if (onRetry) onRetry();
          }}
        >
          <Text style={[styles.buttonText, { color: colorTheme.text.onAccent }]}>Reîncercare</Text>
        </TouchableOpacity>

        {/* disconnect button */}
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            styles.buttonBorder,
            { backgroundColor: colorTheme.background.primary, borderColor: colorTheme.text.primary },
          ]}
          onPress={() => {
            queryClient.invalidateQueries({ refetchType: "none" });
            authContext.logout();
          }}
        >
          <Text style={[styles.buttonText, { color: colorTheme.text.primary }]}>Deconectare</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  buttonSection: {
    width: "100%",
    gap: 16,
  },
  buttonContainer: {
    padding: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "400",
  },
  buttonBorder: {
    borderWidth: 1,
  },
});
