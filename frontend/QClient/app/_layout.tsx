import React from "react";
import { Slot } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import useColorTheme from "@/hooks/useColorTheme";
import { CartContextProvider } from "@/context/useCartContext";
import { ImageContextProvider } from "@/context/useImageContext";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import logger from "@/utils/logger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600 * 1000,
      gcTime: 3600 * 1000,
    },
  },
});

export default function RootLayout() {
  logger.render("RootLayout");

  const colorTheme = useColorTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <ImageContextProvider>
        <CartContextProvider>
          <StatusBar style={colorTheme.statusBarStyle} />
          <Slot />
          {Platform.OS === "ios" && <Toast />}
        </CartContextProvider>
      </ImageContextProvider>
    </QueryClientProvider>
  );
}
