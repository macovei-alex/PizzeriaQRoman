import { Theme } from "../types/Theme";

const background = {
  primary: "#fcfcfc",
  card: "#dceadb",
  onCard: "#ddf1db",
  navbar: "#ffffff",
  success: "#5ab02d",
  accent: "#cf4949",
  elevated: "#f0f0f0",
};

const text = {
  primary: "#000000",
  secondary: "#898080",
  accent: "#cf4949",
  onAccent: "#ffffff",
  success: "#ffffff",
  disabled: "#b0b0b0",
  onDarkOverlay: "white",
};

export const lightTheme: Theme = { name: "light", statusBarStyle: "dark", background, text };
