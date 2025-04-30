import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Circle, Line } from "react-native-svg";
import useColorTheme from "src/hooks/useColorTheme";

type MinusCircleProps = {
  style?: StyleProp<ViewStyle>;
};

export default function MinusCircleSvg({ style }: MinusCircleProps) {
  const colorTheme = useColorTheme();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Circle x="50" y="50" r="50" fill={colorTheme.background.success} />
      <Line x1="25" y1="50" x2="75" y2="50" stroke="white" strokeWidth="7" />
    </Svg>
  );
}
