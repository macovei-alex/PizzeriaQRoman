import React from "react";
import Svg, { Circle, Line } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";
import { useUnistyles } from "react-native-unistyles";

type PlusCircleSvgProps = {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function PlusCircleSvg({ style, disabled }: PlusCircleSvgProps) {
  const { theme } = useUnistyles();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Circle x="50" y="50" r="50" fill={theme.background.success} opacity={disabled ? 0.3 : 1} />
      <Line
        x1="50"
        y1="28"
        x2="50"
        y2="72"
        stroke={theme.text.success}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <Line
        x1="28"
        y1="50"
        x2="72"
        y2="50"
        stroke={theme.text.success}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </Svg>
  );
}
