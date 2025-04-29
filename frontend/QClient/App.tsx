import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";
import { CartContextProvider } from "src/context/CartContext";
import { ImageContextProvider } from "src/context/ImageContext";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import logger from "src/utils/logger";
import Navigation from "src/navigation/Navigation";
import { AuthContextProvider } from "src/context/AuthContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600 * 1000,
      gcTime: 0,
      retry: 1,
      retryDelay: 0,
    },
  },
});

export default function App() {
  logger.render("App");

  const colorTheme = useColorTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <ImageContextProvider>
          <CartContextProvider>
            <StatusBar style={colorTheme.statusBarStyle} />
            <Navigation />
            {Platform.OS === "ios" && <Toast />}
          </CartContextProvider>
        </ImageContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
}
