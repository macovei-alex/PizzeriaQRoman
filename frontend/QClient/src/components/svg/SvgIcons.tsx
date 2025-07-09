import React from "react";
import { ColorValue, StyleProp, ViewStyle } from "react-native";
import HomeIconSvg from "./HomeIconSvg";
import SearchIconSvg from "./SearchIconSvg";
import CartIconSvg from "./CartIconSvg";
import ProfileIconSvg from "./ProfileIconSvg";

export type SvgIconProps = {
  style?: StyleProp<ViewStyle>;
  stroke?: ColorValue;
  fillPrimary?: ColorValue;
  fillSecondary?: ColorValue;
};

const iconsHolder: Record<string, React.FC<SvgIconProps>> = {
  home: HomeIconSvg,
  search: SearchIconSvg,
  menu: SearchIconSvg,
  cart: CartIconSvg,
  profile: ProfileIconSvg,
} as const;

type SvgIconsProps = SvgIconProps & { name: string };

export default function SvgIcons({ name, style, stroke, fillPrimary, fillSecondary }: SvgIconsProps) {
  const svgIcon = iconsHolder[name];
  if (!svgIcon) throw new Error(`SvgIcons: Icon ${name} not found`);

  return React.createElement(svgIcon, { style, stroke, fillPrimary, fillSecondary });
}
