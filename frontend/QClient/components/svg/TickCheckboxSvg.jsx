import Svg, { Circle, Path } from "react-native-svg";
import React from "react";

// eslint-disable-next-line react/prop-types
export default function TickCheckboxSvg({ style, checked }) {
  const checkStroke = style?._checkStroke ?? "white";
  const checkedFill = style?._checkedFill ?? "#428820";
  const uncheckedFill = style?._uncheckedFill ?? "white";

  return (
    <Svg style={style} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="15" cy="15" r="15" fill={checked ? checkedFill : uncheckedFill} />
      {checked && <Path d="M8.00007 16.49L14.5012 20.8129" stroke={checkStroke} stroke-width="2" />}
      {checked && <Path d="M14.0151 21.3223L20.4753 9.00001" stroke={checkStroke} stroke-width="2" />}
    </Svg>
  );
}
