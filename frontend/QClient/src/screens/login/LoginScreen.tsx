import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { useAuthContext } from "src/context/AuthContext";
import { images } from "src/constants";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

const AnimatedLogo = Animated.createAnimatedComponent(Image);
const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground);

export default function LoginScreen() {
  const colorTheme = useColorTheme();
  const authContext = useAuthContext();

  const logoOpacityAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetTranslationAnim = useRef(new Animated.Value(350)).current;
  const backgroundScaleAnim = useRef(new Animated.Value(1.8)).current;
  const backgroundImageRotationAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.timing(bottomSheetTranslationAnim, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.out(Easing.cubic),
    }).start();
    Animated.timing(logoOpacityAnim, {
      toValue: 0.88,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.in(Easing.cubic),
    }).start();
    Animated.timing(backgroundScaleAnim, {
      toValue: 1.2,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    }).start();
    Animated.timing(backgroundImageRotationAnim, {
      toValue: 0,
      duration: 1200,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.cubic),
    }).start();
  }, [bottomSheetTranslationAnim, logoOpacityAnim, backgroundScaleAnim, backgroundImageRotationAnim]);

  const backgroundImageRotation = backgroundImageRotationAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* background image */}
      <AnimatedImageBackground
        source={images.menuBackground}
        style={[
          styles.imageBackground,
          {
            transform: [{ scale: backgroundScaleAnim }, { rotate: backgroundImageRotation }],
          },
        ]}
      />

      <View style={styles.contentContainer}>
        {/* logo */}
        <View style={styles.logoContainer}>
          <AnimatedLogo source={images.logo} style={[styles.logoImage, { opacity: logoOpacityAnim }]} />
        </View>

        {/* bottom sheet */}
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              backgroundColor: colorTheme.background.primary,
              transform: [{ translateY: bottomSheetTranslationAnim }],
            },
          ]}
        >
          <Text style={[styles.subText, { color: colorTheme.text.primary }]}>Bine ați venit!</Text>

          <TouchableOpacity
            onPress={authContext.login}
            style={[styles.button, { backgroundColor: colorTheme.background.onCard }]}
          >
            <Text style={[styles.buttonText, { color: colorTheme.text.primary }]}>Conectare</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  contentContainer: {
    zIndex: 1,
    alignItems: "center",
    height: "100%",
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    opacity: 0.88,
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
  },
  subText: {
    fontSize: 20,
    marginBottom: 24,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 8,
    marginBottom: 24,
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
