import { useEffect, useMemo, useState } from "react";
import { useImageContext } from "../context/useImageContext";

/**
 * @param {string[] | null} imageNames
 * @returns {{ name: string, data: string }[] }}
 */
export default function useImages(imageNames) {
  const imageContext = useImageContext();
  const [images, setImages] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedImageNames = useMemo(() => imageNames, [JSON.stringify(imageNames)]);

  useEffect(() => {
    if (!memoizedImageNames || memoizedImageNames.length === 0) {
      return;
    }
    imageContext.getImages(memoizedImageNames).then((images) => setImages(images));
  }, [imageContext, memoizedImageNames]);
  return images;
}
