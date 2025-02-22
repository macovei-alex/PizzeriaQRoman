import { useQuery } from "@tanstack/react-query";
import api from "src/api";
import { ProductId, ProductWithOptions } from "src/api/types/Product";

export default function useProductWithOptionsQuery(productId: ProductId) {
  const productQuery = useQuery<ProductWithOptions, Error>({
    queryFn: () => api.fetchProductWithOptions(productId),
    queryKey: ["product", productId],
  });

  return productQuery;
}
