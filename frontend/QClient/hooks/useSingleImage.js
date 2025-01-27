import { useEffect, useState } from "react";
import { useImageContext } from "../context/useImageContext";

/**
 * @param {string | null} imageName
 * @returns {{ name: string | null, data: string } | null }
 */
export default function useSingleImage(imageName) {
  const imageContext = useImageContext();
  const [image, setImage] = useState({ name: imageName, data: null });
  useEffect(() => {
    if (!imageName) {
      return;
    }
    imageContext.getSingleImage(imageName).then((image) => setImage(image));
  });
  return image;
}
