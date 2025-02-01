import React from "react";
import { ColorValue, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

type SearchIconSVGProps = {
  style?: StyleProp<ViewStyle> & {
    _stroke?: ColorValue;
    _fillPrimary?: ColorValue;
  };
};

export default function SearchIconSVG({ style }: SearchIconSVGProps) {
  const stroke = style?._stroke ?? "black";
  const fillPrimary = style?._fillPrimary ?? "none";

  return (
    <Svg style={style} viewBox="0 0 30 33">
      <Line x1="19.7071" y1="20.2929" x2="24.7071" y2="25.2929" stroke={stroke} />
      <Circle cx="14" cy="15" r="7" stroke={stroke} fill={fillPrimary} />
    </Svg>
  );
}
