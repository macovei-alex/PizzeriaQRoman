import React, { useMemo } from "react";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { images } from "src/constants";
import { useAuthContext } from "src/context/AuthContext";
import useColorTheme from "src/hooks/useColorTheme";
import { convertToRGBA } from "src/utils/convertions";
import logger from "src/utils/logger";

export default function TitleSection() {
  logger.render("ProfileTitleSection");

  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account not found");

  const colorTheme = useColorTheme();
  const accentRgba = useMemo(
    () => convertToRGBA(colorTheme.background.accent),
    [colorTheme.background.accent]
  );

  return (
    <ImageBackground source={images.menuBackground} style={styles.image}>
      <View
        style={[
          styles.overlay,
          {
            backgroundColor: accentRgba
              ? `rgba(${accentRgba.r},${accentRgba.g},${accentRgba.b},0.6)`
              : "rgba(0,0,0,0.6)",
          },
        ]}
      />
      <Text style={[styles.titleText, { color: colorTheme.text.onAccent }]} numberOfLines={2}>
        Bună, {authContext.account.givenName}!
      </Text>
      <Text style={[styles.subtitleText, { color: colorTheme.text.onAccent }]}>
        Bine ai venit in contul tău!
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
