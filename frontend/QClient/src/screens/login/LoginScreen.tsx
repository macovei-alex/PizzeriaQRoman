import React from "react";
import { Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { useAuthContext } from "src/context/AuthContext";
import { images } from "src/constants";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const colorTheme = useColorTheme();
  const authContext = useAuthContext();

  return (
    <View style={styles.container}>
      <ImageBackground source={images.menuBackground} style={styles.imageBackground}>
        <View style={styles.overlay} />

        <View style={styles.logoContainer}>
          <Image source={images.logo} style={styles.logoImage} />
        </View>

        <View style={[styles.bottomSheet, { backgroundColor: colorTheme.background.primary }]}>
          <Text style={[styles.subText, { color: colorTheme.text.primary }]}>Vă rugăm să vă conectați</Text>

          <TouchableOpacity
            onPress={authContext.login}
            style={[styles.button, { backgroundColor: colorTheme.background.onCard }]}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text.primary }]}>Conectare</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  logoImage: {
    height: 90,
    width: 220,
    marginBottom: 20,
    borderRadius: 12,
    resizeMode: "stretch",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  subText: {
    fontSize: 20,
    marginBottom: 32,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 8,
    ...Platform.select({
      android: {
        elevation: 2,
      },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});
