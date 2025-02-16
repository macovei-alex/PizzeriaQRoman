import React from "react";
import { Tabs } from "expo-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Platform, StyleSheet } from "react-native";
import HomeIconSvg from "@/components/svg/HomeIconSvg";
import useColorTheme from "@/hooks/useColorTheme";
import CartIconSvg from "@/components/svg/CartIconSvg";
import { CartContextProvider } from "@/context/useCartContext";
import { ImageContextProvider } from "@/context/useImageContext";
import Toast from "react-native-toast-message";
import ProfileIconSvg from "@/components/svg/ProfileIconSvg";
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
  const svgColors = {
    stroke: colorTheme.text.primary,
    fillPrimary: colorTheme.background.primary,
    fillSecondary: colorTheme.background.primary,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ImageContextProvider>
        <CartContextProvider>
          <StatusBar style={colorTheme.statusBarStyle} />
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarStyle: [styles.tabBar, { backgroundColor: colorTheme.background.navbar }],
            }}
          >
            <Tabs.Screen name="index" options={{ href: null }}></Tabs.Screen>
            <Tabs.Screen
              name="menu"
              options={{
                title: "Meniu",
                tabBarIcon: () => (
                  <HomeIconSvg
                    stroke={svgColors.stroke}
                    fillPrimary={svgColors.fillPrimary}
                    fillSecondary={svgColors.fillSecondary}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="cart"
              options={{
                title: "Coș",
                tabBarIcon: () => (
                  <CartIconSvg
                    stroke={svgColors.stroke}
                    fillPrimary={svgColors.fillPrimary}
                    fillSecondary={svgColors.fillSecondary}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profil",
                tabBarIcon: () => (
                  <ProfileIconSvg
                    stroke={svgColors.stroke}
                    fillPrimary={svgColors.fillPrimary}
                    fillSecondary={svgColors.fillSecondary}
                  />
                ),
              }}
            />
            <Tabs.Screen
              name="test"
              options={{
                title: "Test",
                tabBarIcon: () => (
                  <CartIconSvg
                    stroke={svgColors.stroke}
                    fillPrimary={svgColors.fillPrimary}
                    fillSecondary={svgColors.fillSecondary}
                  />
                ),
              }}
            />
          </Tabs>
          {Platform.OS === "ios" && <Toast />}
        </CartContextProvider>
      </ImageContextProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
});
