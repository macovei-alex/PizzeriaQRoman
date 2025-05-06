import { ImageBackground, ImageBackgroundProps } from "expo-image";
import React from "react";
import { useAuthContext } from "src/context/AuthContext";
import { imageUri } from "src/utils/utils";

type RemoteImageBackgroundProps = ImageBackgroundProps & {
  imageName: string;
  imageVersion: number;
};

export default function RemoteImageBackground({
  imageName,
  imageVersion,
  children,
  ...rest
}: RemoteImageBackgroundProps) {
  const authContext = useAuthContext();

  return (
    <ImageBackground
      source={{
        uri: imageUri(imageName, imageVersion),
        headers: {
          Authorization: `Bearer ${authContext.accessToken}`,
        },
      }}
      {...rest}
    >
      {children}
    </ImageBackground>
  );
}
