import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import logger from "src/utils/logger";
import { useKeycloakRequest as useKeycloakAuth } from "src/hooks/useKeycloakRequest";
import useColorTheme from "src/hooks/useColorTheme";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colorTheme = useColorTheme();
  const kc = useKeycloakAuth();

  useEffect(() => {
    if (kc.tokens) {
      logger.log(kc.tokens.accessToken);
    }
  }, [kc.tokens]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={kc.startAuth}
        style={[styles.button, { backgroundColor: colorTheme.background.card }]}
      >
        <Text style={styles.buttonText}>Sign In with Email and Password</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    borderRadius: 8,
  },
  buttonText: {
    padding: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    fontWeight: "bold",
  },
});
