import { useQuery } from "@tanstack/react-query";
import api from "src/api";
import { ProductId, ProductWithOptions } from "src/api/types/Product";

export default function useProductWithOptionsQuery(productId: ProductId) {
  return useQuery<ProductWithOptions, Error>({
    queryFn: () => api.fetchProductWithOptions.queryFn(productId),
    queryKey: api.fetchProductWithOptions.queryKey(productId),
  });
}
