import { ColorValue } from "react-native";

export type Theme = {
  name: "light" | "dark";
  statusBarStyle: "light" | "dark";
  background: {
    primary: ColorValue;
    card: ColorValue;
    onCard: ColorValue;
    success: ColorValue;
    accent: ColorValue;
    navbar: ColorValue;
    elevated: ColorValue;
  };
  text: {
    primary: ColorValue;
    secondary: ColorValue;
    accent: ColorValue;
    onAccent: ColorValue;
    success: ColorValue;
    disabled: ColorValue;
    onDarkOverlay: ColorValue;
  };
};
