import { useEffect, useState } from "react";
import { useImageContext } from "src/context/useImageContext";
import { ImageFile } from "src/utils/files";

export default function useImages(imageNames: string[]) {
  const imageContext = useImageContext();
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    imageContext.getImages(imageNames).then((images) => setImages(images));
  }, [imageContext, imageNames]);

  return images;
}
