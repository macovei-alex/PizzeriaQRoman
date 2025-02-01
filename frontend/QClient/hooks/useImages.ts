import { useEffect, useMemo, useState } from "react";
import { useImageContext } from "@/context/useImageContext";
import { ImageFile } from "@/utils/files";

export default function useImages(imageNames: string[]) {
  const imageContext = useImageContext();
  const [images, setImages] = useState<ImageFile[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedImageNames = useMemo(() => imageNames, [JSON.stringify(imageNames)]);

  useEffect(() => {
    if (!imageContext) {
      return;
    }
    if (!memoizedImageNames || memoizedImageNames.length === 0) {
      return;
    }
    imageContext.getImages(memoizedImageNames).then((images) => setImages(images));
  }, [imageContext, memoizedImageNames]);
  return images;
}
