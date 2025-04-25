import { useEffect, useState } from "react";
import { useImageContext } from "src/context/ImageContext";
import { ImageFile } from "src/utils/files";
import logger from "src/utils/logger";

export default function useImages(imageNames: string[]) {
  const imageContext = useImageContext();
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    imageContext
      .getImages(imageNames)
      .then((images) => setImages(images))
      .catch((error) => {
        logger.error("Error fetching images", error);
      });
  }, [imageContext, imageNames]);

  return images;
}
