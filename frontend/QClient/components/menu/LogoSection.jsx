import { View, Text, ImageBackground, TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";
import GoBackButtonSVG from "../svg/GoBackButtonSVG";
import { images } from "../../constants";

export default function LogoSection({ onBackButtonPress }) {
  return (
    <View>
      <ImageBackground source={images.menuBackground} style={styles.imageBackground}>
        <TouchableOpacity onPress={onBackButtonPress} style={styles.goBackButton}>
          <GoBackButtonSVG style={styles.goBackButtonSvg} />
        </TouchableOpacity>
        <View style={styles.centerSection}>
          <Image source={images.logo} style={styles.logoImage} />
          <View style={styles.subtextContainer}>
            <Text style={styles.subtext}>Comanda minimă este de 40 RON</Text>
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
    width: 180,
    borderRadius: 12,
    resizeMode: "stretch",
  },
  subtextContainer: {
    borderRadius: 8,
    opacity: 0.8,
    backgroundColor: "#5d0",
  },
  subtext: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    fontWeight: "800",
  },
});
