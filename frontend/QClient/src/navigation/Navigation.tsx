import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./TabNavigator";
import { useAuthContext } from "src/context/AuthContext";
import LoginStackNavigator from "./LoginStackNavigator";

export default function Navigation() {
  const authContext = useAuthContext();

  return (
    <NavigationContainer>
      {authContext.isAuthenticated ? <TabNavigator /> : <LoginStackNavigator />}
    </NavigationContainer>
  );
}
