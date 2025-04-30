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
          <Line x1="25" y1="50" x2="48" y2="72" stroke={colorTheme.text.success} strokeWidth="7" />
          <Line x1="48" y1="72" x2="70" y2="28" stroke={colorTheme.text.success} strokeWidth="7" />
        </>
      )}
    </Svg>
  );
}
