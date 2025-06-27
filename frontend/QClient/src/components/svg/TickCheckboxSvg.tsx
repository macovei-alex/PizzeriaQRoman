import Svg, { Circle, Line } from "react-native-svg";
import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import { useUnistyles, withUnistyles } from "react-native-unistyles";

type TickCheckboxSvgProps = {
  style?: StyleProp<ViewStyle>;
  checked: boolean;
};

export default function TickCheckboxSvg({ style, checked }: TickCheckboxSvgProps) {
  const { theme } = useUnistyles();

  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <Circle
        cx="50"
        cy="50"
        r="50"
        fill={checked ? theme.background.success : "none"}
        stroke={!checked ? theme.text.primary : undefined}
      />
      {checked && (
        <>
          <ULine x1="27" y1="52" x2="48" y2="70" strokeWidth="7" strokeLinecap="round" />
          <ULine x1="48" y1="70" x2="68" y2="30" strokeWidth="7" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
}

const ULine = withUnistyles(Line, (theme) => ({
  stroke: theme.text.success,
}));
