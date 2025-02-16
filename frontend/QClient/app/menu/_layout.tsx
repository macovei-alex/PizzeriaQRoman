import React, { useEffect } from "react";
import { Stack, usePathname } from "expo-router";
import { Alert, BackHandler } from "react-native";

export default function MenuLayout() {
  const pathname = usePathname();
  useEffect(() => {
    function handleBackPress() {
      if (pathname === "/menu") {
        Alert.alert("Parasire aplicatie", "Sunteti sigur ca doriti sa parasiti aplicatia?", [
          { text: "Anulare", style: "cancel" },
          { text: "OK", onPress: () => BackHandler.exitApp() },
        ]);
        // Prevent default action
        return true;
      }
      // Allow default back action
      return false;
    }

    BackHandler.addEventListener("hardwareBackPress", handleBackPress);

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
    };
  }, [pathname]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="product" />
      <Stack.Screen name="test-loading" />
    </Stack>
  );
}
