import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";
import { CartContextProvider } from "src/context/CartContext/CartContext";
import Toast from "react-native-toast-message";
import { StatusBar } from "expo-status-bar";
import logger from "src/utils/logger";
import Navigation from "src/navigation/Navigation";
import { AuthContextProvider } from "src/context/AuthContext";
import * as Notifications from "expo-notifications";
import NotificationProvider from "src/context/NotificationContext";
import { useUnistyles } from "react-native-unistyles";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600 * 1000,
      gcTime: 3600 * 1000,
      retry: false,
    },
  },
});

export default function App() {
  logger.render("App");

  const { theme } = useUnistyles();

  return (
    <NotificationProvider>
      <QueryClientProvider client={queryClient}>
        <AuthContextProvider>
          <CartContextProvider>
            <StatusBar style={theme.statusBarStyle} />
            <Navigation />
            {Platform.OS === "ios" && <Toast />}
          </CartContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </NotificationProvider>
  );
}
