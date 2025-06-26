import React from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { images } from "src/constants/images";
import logger from "src/utils/logger";

export default function LogoSection() {
  logger.render("LogoSection");

  return (
    <ImageBackground source={images.menuBackground} style={styles.imageBackground}>
      <View style={styles.centerSection}>
        <Image source={images.logo} style={styles.logoImage} />
        <View style={styles.subtextContainer}>
          <Text style={styles.subtext}>Comanda minimă este de 40 RON</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create((theme) => ({
  imageBackground: {
    width: "100%",
    height: 176,
  },
  centerSection: {
    alignItems: "center",
    justifyContent: "space-around",
    height: "100%",
    paddingVertical: 8,
  },
  logoImage: {
    height: 80,
    width: 200,
    borderRadius: 12,
    resizeMode: "stretch",
  },
  subtextContainer: {
    borderRadius: 8,
    opacity: 0.8,
    backgroundColor: theme.background.success,
  },
  subtext: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    fontWeight: "800",
    color: theme.text.primary,
  },
}));
