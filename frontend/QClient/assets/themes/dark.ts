import { Theme } from "./theme-type";

const background = {
  100: "#ffffff",
  200: "#c9d3c4",
  300: "#55dd00",
  400: "#dceadb",
  500: "#cf4949",
  600: "#f0f0f0",
  700: "#f6f6f6",
};

const text = {
  100: "#000000",
  200: "#898080",
  300: "#ffffff",
  400: "#cf4949",
};

export const darkTheme: Theme = { name: "dark", statusBarStyle: "light", background, text };
