import { Image, ImageProps } from "expo-image";
import React from "react";
import { images } from "src/constants";
import { useAuthContext } from "src/context/AuthContext";
import { imageUri } from "src/utils/utils";

type RemoteImageProps = ImageProps & {
  imageName?: string;
  imageVersion: number;
};

export default function RemoteImage({ imageName, imageVersion, ...rest }: RemoteImageProps) {
  const authContext = useAuthContext();

  return (
    <Image
      source={
        imageName
          ? {
              uri: imageUri(imageName, imageVersion),
              headers: {
                Authorization: `Bearer ${authContext.accessToken}`,
              },
            }
          : images.defaultPizza
      }
      {...rest}
    />
  );
}
