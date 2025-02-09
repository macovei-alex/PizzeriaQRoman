import { Theme } from "./theme-type";

const background = {
  primary: "#f2f2f2",
  card: "#c9d3c4",
  navbar: "#ffffff",
  success: "#55dd00",
  accent: "#cf4949",
  onCard: "#dceadb",
  700: "#f6f6f6",
};

const text = {};

export const darkTheme: Theme = { name: "dark", statusBarStyle: "light", background, text };
