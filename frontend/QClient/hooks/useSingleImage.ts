import { useEffect, useState } from "react";
import { useImageContext } from "../context/useImageContext";
import { ImageFile } from "@/utils/files";

export default function useSingleImage(imageName: string) {
  const imageContext = useImageContext();
  const [image, setImage] = useState<ImageFile>({ name: imageName, data: null });
  useEffect(() => {
    if (!imageContext) {
      return;
    }
    imageContext.getSingleImage(imageName).then((image) => setImage(image));
  });
  return image;
}
