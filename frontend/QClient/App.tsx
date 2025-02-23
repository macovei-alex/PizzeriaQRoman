import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { CartContextProvider } from "src/context/useCartContext";
import { ImageContextProvider } from "src/context/useImageContext";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import logger from "src/utils/logger";
import Navigation from "src/navigation/Navigation";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB,
  scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600 * 1000,
      gcTime: 3600 * 1000,
    },
  },
});

export default function App() {
  logger.render("App");

  const colorTheme = useColorTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ImageContextProvider>
        <CartContextProvider>
          <StatusBar style={colorTheme.statusBarStyle} />
          <Navigation />
          {Platform.OS === "ios" && <Toast />}
        </CartContextProvider>
      </ImageContextProvider>
    </QueryClientProvider>
  );
}
