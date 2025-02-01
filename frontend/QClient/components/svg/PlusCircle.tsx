import React from "react";
import Svg, { Line, Rect } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";

type PlusCircleProps = {
  style?: StyleProp<ViewStyle>;
};

export default function PlusCircle({ style }: PlusCircleProps) {
  return (
    <Svg style={style} viewBox="0 0 36 38" fill="none">
      <Rect x="0.460205" y="0.652374" width="34.6559" height="36.3861" rx="17.3279" fill="#428820" />
      <Line x1="18.3306" y1="8" x2="18.3306" y2="28.992" stroke="white" stroke-width="2" />
      <Line x1="8" y1="18.1957" x2="27.9938" y2="18.1957" stroke="white" stroke-width="2" />
    </Svg>
  );
}
