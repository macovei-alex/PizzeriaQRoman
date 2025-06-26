import React from "react";
import { ImageBackground, Text, View } from "react-native";
import { StyleSheet, useUnistyles } from "react-native-unistyles";
import { images } from "src/constants/images";
import { useAuthContext } from "src/context/AuthContext";
import { convertToRGBA } from "src/utils/convertions";
import logger from "src/utils/logger";

export default function TitleSection() {
  logger.render("ProfileTitleSection");

  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account not found");

  const { theme } = useUnistyles();

  return (
    <ImageBackground source={images.menuBackground} style={styles.image}>
      <View style={styles.overlay()} />
      <Text style={[styles.titleText, { color: theme.text.onAccent }]} numberOfLines={2}>
        Bună, {authContext.account.givenName}!
      </Text>
      <Text style={styles.subtitleText}>Bine ai venit in contul tău!</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  image: {
    width: "100%",
    height: 240,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    marginBottom: -40,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 16,
    color: theme.text.onAccent,
  },
  overlay: () => {
    const rgba = convertToRGBA(theme.background.accent);
    return {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: rgba ? `rgba(${rgba.r},${rgba.g},${rgba.b},0.6)` : "rgba(0,0,0,0.6)",
    };
  },
}));
