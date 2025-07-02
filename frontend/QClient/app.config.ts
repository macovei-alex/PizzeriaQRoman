import "dotenv/config";
import { ExpoConfig } from "@expo/config";

type SchemeSuffix = "dev" | "prev" | "prod";

function getSchemeSuffix(): SchemeSuffix {
  switch (process.env.APP_VARIANT) {
    case "development":
      return "dev";
    case "preview":
      return "prev";
    case "production":
      return "prod";
    default:
      throw new Error(
        `Invalid APP_VARIANT value ( ${process.env.APP_VARIANT} ). Expected 'development', 'preview', or 'production'.`
      );
  }
}

function withDot(suffix: SchemeSuffix): string {
  return suffix !== "prod" ? `.${suffix}` : "";
}

function withDash(suffix: SchemeSuffix): string {
  return suffix !== "prod" ? `-${suffix}` : "";
}

export default function (): ExpoConfig {
  const schemeSuffix = getSchemeSuffix();

  return {
    owner: "mac02",
    name: `PizzeriaQ${withDash(schemeSuffix)}`,
    slug: "pizzeriaq",
    scheme: `com.pizzeriaq.qclient${withDot(schemeSuffix)}`,
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
      package: `com.pizzeriaq.qclient${withDot(schemeSuffix)}`,
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
}
