import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import { withUnistyles } from "react-native-unistyles";

type MinusCircleProps = {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function MinusCircleSvg({ style, disabled }: MinusCircleProps) {
  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <UCircle x="50" y="50" r="50" opacity={disabled ? 0.3 : 1} />
      <ULine x1="28" y1="50" x2="72" y2="50" strokeWidth="7" strokeLinecap="round" />
    </Svg>
  );
}

const UCircle = withUnistyles(Circle, (theme) => ({
  fill: theme.background.success,
}));

const ULine = withUnistyles(Line, (theme) => ({
  stroke: theme.text.success,
}));
