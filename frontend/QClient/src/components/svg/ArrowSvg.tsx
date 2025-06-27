import React from "react";
import { StyleProp, ViewStyle } from "react-native";
import Svg, { Line } from "react-native-svg";
import { withUnistyles } from "react-native-unistyles";

type ArrowSvgProps = {
  style?: StyleProp<ViewStyle>;
};

export default function ArrowSvg({ style }: ArrowSvgProps) {
  return (
    <Svg style={style} viewBox="0 0 100 100" fill="none">
      <ULine x1="25" y1="50" x2="75" y2="50" strokeWidth="7" strokeLinecap="round" />
      <ULine x1="55" y1="30" x2="75" y2="50" strokeWidth="7" strokeLinecap="round" />
      <ULine x1="55" y1="70" x2="75" y2="50" strokeWidth="7" strokeLinecap="round" />
    </Svg>
  );
}

const ULine = withUnistyles(Line, (theme) => ({
  stroke: theme.text.primary,
}));
