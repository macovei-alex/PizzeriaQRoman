import { useQuery } from "react-query";
import { loadImages } from "../utils/files";

/**
 * @param {string[]} imageNames
 */
export default function useDiskImages(imageNames) {
  const imagesQuery = useQuery({
    queryFn: async () => {
      return loadImages(imageNames);
    },
    queryKey: ["disk-images", imageNames],
    enabled: !!imageNames?.length,
  });
  return imagesQuery;
}
