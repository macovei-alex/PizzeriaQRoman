import Svg, { Circle, Path } from "react-native-svg";
import React from "react";
import { ColorValue, StyleProp, ViewStyle } from "react-native";

type TickCheckboxSvgProps = {
  style?: StyleProp<ViewStyle> & {
    _checkStroke?: ColorValue;
    _checkedFill?: ColorValue;
    _uncheckedFill?: ColorValue;
  };
  checked: boolean;
};

export default function TickCheckboxSvg({ style, checked }: TickCheckboxSvgProps) {
  const checkStroke = style?._checkStroke ?? "white";
  const checkedFill = style?._checkedFill ?? "#428820";
  const uncheckedFill = style?._uncheckedFill ?? "white";

  return (
    <Svg style={style} viewBox="0 0 30 30" fill="none">
      <Circle cx="15" cy="15" r="15" fill={checked ? checkedFill : uncheckedFill} />
      {checked && <Path d="M8.00007 16.49L14.5012 20.8129" stroke={checkStroke} stroke-width="2" />}
      {checked && <Path d="M14.0151 21.3223L20.4753 9.00001" stroke={checkStroke} stroke-width="2" />}
    </Svg>
  );
}
