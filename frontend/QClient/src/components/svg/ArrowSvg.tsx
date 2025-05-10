import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Line } from "react-native-svg";
import useColorTheme from "src/hooks/useColorTheme";

type ArrowSvgProps = {
  style?: StyleProp<ViewStyle>;
};

export default function ArrowSvg({ style }: ArrowSvgProps) {
  const colorTheme = useColorTheme();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Line
        x1="25"
        y1="50"
        x2="75"
        y2="50"
        stroke={colorTheme.text.primary}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <Line
        x1="55"
        y1="30"
        x2="75"
        y2="50"
        stroke={colorTheme.text.primary}
        strokeWidth="7"
        strokeLinecap="round"
      />
      <Line
        x1="55"
        y1="70"
        x2="75"
        y2="50"
        stroke={colorTheme.text.primary}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </Svg>
  );
}
