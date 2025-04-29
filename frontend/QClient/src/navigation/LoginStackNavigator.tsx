import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "src/screens/login/LoginScreen";

export type LoginStackParamList = {
  LoginScreen: undefined;
};

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export default function LoginStackNavigator() {
  return (
    <LoginStack.Navigator screenOptions={{ headerShown: false }}>
      <LoginStack.Screen name="LoginScreen" component={LoginScreen} />
    </LoginStack.Navigator>
  );
}
