import { useQuery } from "react-query";
import { loadSingleImage } from "../utils/files";

/**
 * @param {string} imageName
 */
export default function useSingleDiskImage(imageName) {
  const imageQuery = useQuery({
    queryFn: async () => {
      return loadSingleImage(imageName);
    },
    queryKey: ["single-disk-image", imageName],
    enabled: !!imageName,
  });
  return imageQuery;
}
