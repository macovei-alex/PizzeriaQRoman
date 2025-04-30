import React from "react";
import Svg, { Circle, Line } from "react-native-svg";
import { StyleProp, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";

type PlusCircleSvgProps = {
  style?: StyleProp<ViewStyle>;
};

export default function PlusCircleSvg({ style }: PlusCircleSvgProps) {
  const colorTheme = useColorTheme();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Circle x="50" y="50" r="50" fill={colorTheme.background.success} />
      <Line x1="50" y1="25" x2="50" y2="75" stroke="white" strokeWidth="7" />
      <Line x1="25" y1="50" x2="75" y2="50" stroke="white" strokeWidth="7" />
    </Svg>
  );
}
