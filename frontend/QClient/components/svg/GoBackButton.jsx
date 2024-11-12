import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const MySvgComponent = () => {
  return (
    <Svg width="46" height="46" viewBox="0 0 46 46" fill="none">
      <Circle cx="23" cy="23" r="20" fill="white" />
      <Path
        d="M17.1868 22.1868C16.7377 22.6359 16.7377 23.3641 17.1868 23.8132L24.5054 31.1317C24.9545 31.5808 25.6826 31.5808 26.1317 31.1317C26.5808 30.6826 26.5808 29.9545 26.1317 29.5054L19.6263 23L26.1317 16.4946C26.5808 16.0455 26.5808 15.3174 26.1317 14.8683C25.6826 14.4192 24.9545 14.4192 24.5054 14.8683L17.1868 22.1868ZM19 21.85H18V24.15H19V21.85Z"
        fill="black"
      />
    </Svg>
  );
};

export default MySvgComponent;
