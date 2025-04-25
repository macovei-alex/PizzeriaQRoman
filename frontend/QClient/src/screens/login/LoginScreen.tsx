import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import logger from "src/utils/logger";
import useColorTheme from "src/hooks/useColorTheme";
import { useAuthContext } from "src/context/AuthContext";

export default function LoginScreen() {
  const colorTheme = useColorTheme();
  const authContext = useAuthContext();

  useEffect(() => {
    if (authContext.isAuthenticated) {
      logger.log(authContext.account);
    }
  }, [authContext.isAuthenticated, authContext.account]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={authContext.login}
        style={[styles.button, { backgroundColor: colorTheme.background.card }]}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
      <View style={{ alignContent: "flex-start" }}>
        {authContext.isAuthenticated &&
          Object.entries(authContext.account!).map(([key, value]) => (
            <Text key={key}>
              {key}: {value}
            </Text>
          ))}
      </View>
      <TouchableOpacity
        onPress={authContext.logout}
        style={[styles.button, { backgroundColor: colorTheme.background.card }]}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
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
