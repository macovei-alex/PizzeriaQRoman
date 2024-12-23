import { Stack } from "expo-router";
import { GlobalContextProvider } from "../context/useGlobalContext";
import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 3600 * 1000,
      cache: 3600 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name="menu/index" options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name="menu/product" options={{ headerShown: false }}></Stack.Screen>
          <Stack.Screen name="test/index" options={{ headerShown: false }}></Stack.Screen>
        </Stack>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
}
