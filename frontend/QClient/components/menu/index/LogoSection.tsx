import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import React from "react";
import { images } from "@/constants";
import useColorTheme from "@/hooks/useColorTheme";

export default function LogoSection() {
  const colorTheme = useColorTheme();

  return (
    <View>
      <ImageBackground source={images.menuBackground} style={styles.imageBackground}>
        <View style={styles.centerSection}>
          <Image source={images.logo} style={styles.logoImage} />
          <View style={[styles.subtextContainer, { backgroundColor: colorTheme.background[300] }]}>
            <Text style={[styles.subtext, { color: colorTheme.text[100] }]}>
              Comanda minimă este de 40 RON
            </Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: "100%",
    height: 176,
  },
  goBackButton: {
    position: "absolute",
    marginTop: 16,
    marginLeft: 8,
  },
  goBackButtonSvg: {
    width: 38,
    height: 38,
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
  },
  subtext: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    fontWeight: "800",
  },
});
