import { Theme } from "./theme-type";

const background = {
  primary: "#f2f2f2",
  card: "#dceadb",
  onCard: "#ddf1db",
  navbar: "#ffffff",
  success: "#5ab02d",
  accent: "#cf4949",
  elevated: "#f6f6f6",
};

const text = {
  primary: "#000000",
  secondary: "#898080",
  accent: "#cf4949",
  onAccent: "#ffffff",
  success: "#ffffff",
};

export const lightTheme: Theme = { name: "light", statusBarStyle: "dark", background, text };
