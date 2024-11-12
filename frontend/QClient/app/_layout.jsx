import { Stack } from "expo-router";
import { GlobalContextProvider } from "../context/useGlobalContext";

export default function RootLayout() {
  return (
    <GlobalContextProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="menu/index"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="menu/product"
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="test-component/index"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </GlobalContextProvider>
  );
}
