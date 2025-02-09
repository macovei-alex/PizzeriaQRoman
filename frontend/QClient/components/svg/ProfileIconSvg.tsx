import { ColorValue, StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type ProfileIconSvgProps = {
  style?: StyleProp<ViewStyle>;
  stroke?: ColorValue;
  fillPrimary?: ColorValue;
  fillSecondary?: ColorValue;
};

export default function ProfileIconSvg({ style, stroke, fillPrimary, fillSecondary }: ProfileIconSvgProps) {
  stroke = stroke ?? "black";
  fillPrimary = fillPrimary ?? "white";
  fillSecondary = fillSecondary ?? "white";

  return (
    <Svg style={style} viewBox="0 0 32 32" fill="none">
      <Path
        d="M17.5 16H14.5C7.04416 16 1 22.0442 1 29.5C1 30.3284 1.67157 31 2.5 31H29.5C30.3284 31 31 30.3284 31 29.5C31 22.0442 24.9558 16 17.5 16Z"
        fill={fillSecondary}
        stroke={stroke}
      />
      <Path
        d="M4 28C4.75238 22.833 9.22011 18.9987 14.4868 19H17.5132C22.7799 18.9987 27.2476 22.833 28 28H4Z"
        fill={fillPrimary}
        stroke={stroke}
      />
      <Path
        d="M23.5 8.5C23.5 4.35787 20.1421 1 16 1C11.8579 1 8.5 4.35787 8.5 8.5C8.5 12.6421 11.8579 16 16 16C17.9891 16 19.8968 15.2098 21.3033 13.8033C22.7098 12.3968 23.5 10.4891 23.5 8.5Z"
        fill={fillSecondary}
        stroke={stroke}
      />
      <Path
        d="M16 13C13.5147 13 11.5 10.9853 11.5 8.5C11.5 6.01472 13.5147 4 16 4C18.4853 4 20.5 6.01472 20.5 8.5C20.5 9.69348 20.0259 10.8381 19.182 11.682C18.3381 12.5259 17.1935 13 16 13Z"
        fill={fillPrimary}
        stroke={stroke}
      />
    </Svg>
  );
}
