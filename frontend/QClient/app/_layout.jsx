import { Tabs, usePathname, useRouter } from "expo-router";
import { GlobalContextProvider } from "../context/useGlobalContext";
import { QueryClientProvider, QueryClient } from "react-query";
import { useEffect } from "react";
import { Alert, BackHandler, StyleSheet } from "react-native";
import HomeIconSvg from "../components/svg/HomeIconSvg";
import { useColorTheme } from "../hooks/useTheme";
import CartIconSvg from "../components/svg/CartIconSvg";

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
  const pathname = usePathname();
  const colorTheme = useColorTheme();

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
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        <Tabs
          screenOptions={{
            popToTopOnBlur: true,
            tabBarStyle: [styles.tabBar, { backgroundColor: colorTheme.background[100] }],
          }}
        >
          <Tabs.Screen name="index" options={{ href: null }}></Tabs.Screen>
          <Tabs.Screen
            name="menu"
            options={{ title: "Menu", headerShown: false, tabBarIcon: () => <HomeIconSvg /> }}
          ></Tabs.Screen>
          <Tabs.Screen
            name="test/index"
            options={{ title: "Test", headerShown: false, lazy: true, tabBarIcon: () => <CartIconSvg /> }}
          ></Tabs.Screen>
        </Tabs>
      </GlobalContextProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
  },
});
