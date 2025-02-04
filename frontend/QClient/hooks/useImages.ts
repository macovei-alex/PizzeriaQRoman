import { useEffect, useState } from "react";
import { useImageContext } from "@/context/useImageContext";
import { ImageFile } from "@/utils/files";

export default function useImages(imageNames: string[]) {
  const imageContext = useImageContext();
  const [images, setImages] = useState<ImageFile[]>([]);

  useEffect(() => {
    if (!imageContext) throw new Error("ImageContext is not initialized");
    imageContext.getImages(imageNames).then((images) => setImages(images));
  }, [imageContext, imageNames]);
  return images;
}
