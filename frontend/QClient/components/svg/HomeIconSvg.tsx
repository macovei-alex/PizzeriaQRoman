import React from "react";
import { ColorValue, StyleProp, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

type HomeIconSvgProps = {
  style?: StyleProp<ViewStyle>;
  stroke?: ColorValue;
  fillPrimary?: ColorValue;
  fillSecondary?: ColorValue;
};

export default function HomeIconSvg({ style, stroke, fillPrimary, fillSecondary }: HomeIconSvgProps) {
  stroke = stroke ?? "black";
  fillPrimary = fillPrimary ?? "white";
  fillSecondary = fillSecondary ?? "white";

  return (
    <Svg style={style} viewBox="0 0 32 32">
      <Path
        d="M30.4911 12.7846L27.9969 10.6273L26.7197 9.57014L16.9681 1.35536C16.4009 0.881548 15.552 0.881548 14.9847 1.35536L5.23313 9.57014L3.95596 10.6273L1.46171 12.7846C0.881595 13.3144 0.843187 14.1846 1.37457 14.7588C1.90596 15.3329 2.81865 15.4073 3.44509 14.9276L3.95596 14.499V26.714C3.95596 29.0811 5.97411 31 8.46363 31H12.9713C13.8011 31 14.4739 30.3604 14.4739 29.5713V22.4281C14.4739 21.639 15.1466 20.9994 15.9764 20.9994C16.3802 21.0047 16.7647 21.1644 17.0432 21.4423C17.3273 21.6983 17.4853 22.0559 17.479 22.4281V29.5713C17.479 30.3604 18.1517 31 18.9815 31H23.4892C25.9787 31 27.9969 29.0811 27.9969 26.714V14.499L28.5078 14.9276C29.1304 15.4476 30.0783 15.3901 30.6264 14.799C31.1732 14.207 31.1127 13.3057 30.4911 12.7846Z"
        stroke={stroke}
        fill={fillSecondary}
      />
      <Path
        d="M24.9918 26.714C24.9918 27.503 24.319 28.1427 23.4892 28.1427H20.4841V22.428C20.4841 20.0609 18.4659 18.142 15.9764 18.142C13.4869 18.142 11.4687 20.0609 11.4687 22.428V28.1427H8.46362C7.63378 28.1427 6.96106 27.503 6.96106 26.714V11.956L15.9764 4.34122L24.9918 11.956V26.714Z"
        stroke={stroke}
        fill={fillPrimary}
      />
    </Svg>
  );
}
