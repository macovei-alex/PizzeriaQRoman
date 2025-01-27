import { useColorScheme } from "react-native";
import { lightTheme } from "../assets/themes/light";
import { darkTheme } from "../assets/themes/dark";

export default function useColorTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === "dark" ? darkTheme : lightTheme;
}
