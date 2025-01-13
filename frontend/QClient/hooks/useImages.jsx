import { useEffect, useState } from "react";
import { useImageContext } from "../context/useImageContext";

/**
 * @param {string[] | null} imageNames
 * @returns {{ name: string, data: string }[] }}
 */
export default function useImages(imageNames) {
  const imageContext = useImageContext();
  const [images, setImages] = useState([]);
  useEffect(() => {
    if (!imageNames) {
      return;
    }
    imageContext.getImages(imageNames).then((images) => setImages(images));
  });
  return images;
}
