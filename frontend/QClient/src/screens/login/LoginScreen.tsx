import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  GoogleSignin,
  GoogleSigninButton,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import logger from "src/utils/logger";
import { useKeycloakRequest as useKeycloakAuth } from "src/hooks/useKeycloakRequest";
import useColorTheme from "src/hooks/useColorTheme";

WebBrowser.maybeCompleteAuthSession();

// TODO: Test this for iOS
async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    console.log(JSON.stringify(response));
    if (!isSuccessResponse(response)) {
      // sign in was cancelled by user
      logger.warn("cancelled");
    }
  } catch (error) {
    logger.error("Sign-In Error:", error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_REQUIRED:
          // user needs to sign in
          logger.log("SIGN_IN_REQUIRED");
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          // user cancelled the login flow
          logger.log("SIGN_IN_CANCELLED");
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          logger.log("IN_PROGRESS");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android only, play services not available or outdated
          logger.log("PLAY_SERVICES_NOT_AVAILABLE");
          break;
        default:
          // some other error happened
          logger.log("An unknown error occured:", error.message);
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
}

export default function LoginScreen() {
  const colorTheme = useColorTheme();
  const kc = useKeycloakAuth();

  return (
    <SafeAreaView style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
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
