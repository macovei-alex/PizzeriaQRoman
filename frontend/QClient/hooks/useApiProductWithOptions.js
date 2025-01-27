import { useQuery } from "react-query";
import api from "../api";

export default function useApiProductWithOptions(productId) {
  const productQuery = useQuery({
    queryFn: () => api.fetchProductWithOptions(productId),
    queryKey: ["product", productId],
  });

  return productQuery;
}
