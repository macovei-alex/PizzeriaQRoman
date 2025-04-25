import { useEffect, useState } from "react";
import { useImageContext } from "src/context/ImageContext";
import { ImageFile } from "src/utils/files";

export default function useSingleImage(imageName: string) {
  const imageContext = useImageContext();
  const [image, setImage] = useState<ImageFile>({ name: imageName, data: null });

  useEffect(() => {
    imageContext.getSingleImage(imageName).then((image) => setImage(image));
  }, [imageContext, imageName]);

  return image;
}
