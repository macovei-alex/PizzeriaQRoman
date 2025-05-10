import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import useColorTheme from "src/hooks/useColorTheme";

type MinusCircleProps = {
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function MinusCircleSvg({ style, disabled }: MinusCircleProps) {
  const colorTheme = useColorTheme();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Circle x="50" y="50" r="50" fill={colorTheme.background.success} opacity={disabled ? 0.3 : 1} />
      <Line
        x1="28"
        y1="50"
        x2="72"
        y2="50"
        stroke={colorTheme.text.success}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </Svg>
  );
}
