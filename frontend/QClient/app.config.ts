import "dotenv/config";
import { ExpoConfig } from "@expo/config";
import { z } from "zod";

const fullEnvSchema = z.object({
  EXPO_PUBLIC_KEYCLOAK_REALM_URL: z.string().url(),
  EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
  EXPO_PUBLIC_API_BASE_URL: z.string().url(),
  GOOGLE_MAPS_API_KEY: z.string(),
});

const envUnwrapped = {
  EXPO_PUBLIC_KEYCLOAK_REALM_URL: process.env.EXPO_PUBLIC_KEYCLOAK_REALM_URL,
  EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
};

export default (): ExpoConfig => {
  try {
    fullEnvSchema.parse(envUnwrapped);
  } catch (error) {
    throw new Error("Invalid environment variables: " + error);
  }

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
