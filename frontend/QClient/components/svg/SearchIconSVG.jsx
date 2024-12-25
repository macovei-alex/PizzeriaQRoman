import React from "react";
import Svg, { Circle, Line } from "react-native-svg";

export default function SearchIconSVG({ style }) {
  return (
    <Svg style={style} viewBox="0 0 30 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Line x1="19.7071" y1="20.2929" x2="24.7071" y2="25.2929" stroke="#B7B7B7" stroke-width="2" />
      <Circle cx="14" cy="15" r="7" fill="#F6F6F6" stroke="#B7B7B7" stroke-width="2" />
    </Svg>
  );
}
