import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  isErrorWithCode,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";
import { StyleSheet } from "react-native";

// TODO: Test this for iOS
async function signIn() {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    console.log(JSON.stringify(response));
    if (isSuccessResponse(response)) {
      // setUserState({ userInfo: response.data });
      console.log(JSON.stringify(response));
    } else {
      // sign in was cancelled by user
      console.log("cancelled");
    }
  } catch (error) {
    console.error("Sign-In Error:", error);
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.SIGN_IN_REQUIRED:
          // user needs to sign in
          console.log("SIGN_IN_REQUIRED");
          break;
        case statusCodes.SIGN_IN_CANCELLED:
          // user cancelled the login flow
          console.log("SIGN_IN_CANCELLED");
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          console.log("IN_PROGRESS");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // Android only, play services not available or outdated
          console.log("PLAY_SERVICES_NOT_AVAILABLE");
          break;
        default:
          // some other error happened
          console.log("An unknown error occured:", error.message);
      }
    } else {
      // an error that's not related to google sign in occurred
    }
  }
}

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
