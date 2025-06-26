import "dotenv/config";
import { ExpoConfig } from "@expo/config";

export default (): ExpoConfig => {
  return {
    owner: "mac02",
    name: "PizzeriaQ",
    slug: "pizzeriaq",
    scheme: "com.pizzeriaq",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    userInterfaceStyle: "automatic",
    platforms: ["android", "ios"],
    newArchEnabled: true,
    jsEngine: "hermes",
    plugins: [
      "expo-secure-store",
      "expo-web-browser",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow PizzeriaQ to use your location.",
        },
      ],
      "expo-notifications",
      "react-native-edge-to-edge",
    ],
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.pizzeriaq",
      edgeToEdgeEnabled: false,
      softwareKeyboardLayoutMode: "pan",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      googleServicesFile: "./google-services.json",
    },
    ios: {
      supportsTablet: true,
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
    updates: {
      url: "https://u.expo.dev/eed8e08d-d2de-457f-a2ad-3b9e362d4684",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: "eed8e08d-d2de-457f-a2ad-3b9e362d4684",
      },
    },
  };
};
