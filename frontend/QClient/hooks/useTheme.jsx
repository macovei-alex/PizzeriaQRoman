import { useColorScheme } from "react-native";
import { lightTheme } from "../assets/colors/light";
import { darkTheme } from "../assets/colors/dark";

export function useColorTheme() {
  const colorScheme = useColorScheme();
  if (colorScheme === "light") {
    return lightTheme;
  } else if (colorScheme === "dark") {
    return darkTheme;
  }
  return lightTheme;
}
