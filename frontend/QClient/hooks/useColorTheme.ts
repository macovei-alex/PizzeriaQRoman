// import { useColorScheme } from "react-native";
import { lightTheme } from "@/assets/themes/light";
// import { darkTheme } from "@/assets/themes/dark";
// import { useState } from "react";

export default function useColorTheme() {
  // TODO: Add dark mode colors before uncommenting this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const colorScheme = useColorScheme();
  // return colorScheme === "dark" ? darkTheme : lightTheme;
  return lightTheme;
}
