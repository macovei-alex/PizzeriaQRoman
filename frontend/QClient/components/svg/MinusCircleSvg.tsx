import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Line, Rect } from "react-native-svg";

type MinusCircleProps = {
  style?: StyleProp<ViewStyle>;
};

export default function MinusCircleSvg({ style }: MinusCircleProps) {
  return (
    <Svg style={style} viewBox="0 0 35 38" fill="none">
      <Rect x="0.150391" y="0.652374" width="34.6559" height="36.3861" rx="17.3279" fill="#428820" />
      <Line x1="7.14783" y1="17.8454" x2="27.1416" y2="17.8454" stroke="white" stroke-width="2" />
    </Svg>
  );
}
