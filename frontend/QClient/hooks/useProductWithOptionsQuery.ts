import { useQuery } from "react-query";
import api from "@/api";
import { ProductId, ProductWithOptions } from "@/api/types/Product";

export default function useProductWithOptionsQuery(productId: ProductId) {
  const productQuery = useQuery<ProductWithOptions, Error>({
    queryFn: () => api.fetchProductWithOptions(productId),
    queryKey: ["product", productId],
  });

  return productQuery;
}
