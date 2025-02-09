import React from "react";
import { ColorValue, StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";

type SearchIconSvgProps = {
  style?: StyleProp<ViewStyle>;
  stroke?: ColorValue;
  fillPrimary?: ColorValue;
};

export default function SearchIconSvg({ style, stroke, fillPrimary }: SearchIconSvgProps) {
  stroke = stroke ?? "black";
  fillPrimary = fillPrimary ?? "none";

  return (
    <Svg style={style} viewBox="0 0 30 33">
      <Line x1="19.7071" y1="20.2929" x2="24.7071" y2="25.2929" stroke={stroke} />
      <Circle cx="14" cy="15" r="7" stroke={stroke} fill={fillPrimary} />
    </Svg>
  );
}
