import Svg, { Circle, Line } from "react-native-svg";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import useColorTheme from "src/hooks/useColorTheme";

type TickCheckboxSvgProps = {
  style?: StyleProp<ViewStyle>;
  checked: boolean;
};

export default function TickCheckboxSvg({ style, checked }: TickCheckboxSvgProps) {
  const colorTheme = useColorTheme();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Circle
        cx="50"
        cy="50"
        r="50"
        fill={checked ? colorTheme.background.success : "none"}
        stroke={!checked ? colorTheme.text.primary : undefined}
      />
      {checked && (
        <>
          <Line
            x1="27"
            y1="52"
            x2="48"
            y2="70"
            stroke={colorTheme.text.success}
            strokeWidth="7"
            strokeLinecap="round"
          />
          <Line
            x1="48"
            y1="70"
            x2="68"
            y2="30"
            stroke={colorTheme.text.success}
            strokeWidth="7"
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
}
