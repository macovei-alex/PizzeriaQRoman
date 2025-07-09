import React, { useEffect, useRef } from "react";
import { View, Text, ImageBackground, Image, Animated } from "react-native";
import { StyleSheet } from "react-native-unistyles";
import { images } from "src/constants/images";
import logger from "src/constants/logger";

type LogoSectionProps = {
  minimumOrderValue?: number;
};

export default function LogoSection({ minimumOrderValue }: LogoSectionProps) {
  logger.render("LogoSection");

  const scaleAnim = useRef(new Animated.Value(0));

  useEffect(() => {
    if (minimumOrderValue !== undefined) {
      Animated.spring(scaleAnim.current, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 10,
      }).start();
    }
  }, [minimumOrderValue]);

  return (
    <ImageBackground source={images.menuBackground} style={styles.imageBackground}>
      <View style={styles.centerSection}>
        <Image source={images.logo} style={styles.logoImage} />
        {minimumOrderValue !== undefined && (
          <Animated.View style={[styles.subtextContainer, { transform: [{ scale: scaleAnim.current }] }]}>
            <Text style={styles.subtext}>Comanda minimă este de {minimumOrderValue} RON</Text>
          </Animated.View>
        )}
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
