import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthContext } from "src/context/AuthContext";
import LoginStackNavigator from "./LoginStackNavigator";
import RootStackNavigator from "./RootStackNavigator";

export default function Navigation() {
  const authContext = useAuthContext();

  return (
    <NavigationContainer>
      {authContext.isAuthenticated ? <RootStackNavigator /> : <LoginStackNavigator />}
    </NavigationContainer>
  );
}
