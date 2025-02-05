import { ColorValue } from "react-native";

export type Theme = {
  name: "light" | "dark";
  statusBarStyle: "light" | "dark";
  background: {
    100: ColorValue;
    200: ColorValue;
    300: ColorValue;
    400: ColorValue;
    500: ColorValue;
    600: ColorValue;
    700: ColorValue;
  };
  text: {
    100: ColorValue;
    200: ColorValue;
    300: ColorValue;
    400: ColorValue;
  };
};
