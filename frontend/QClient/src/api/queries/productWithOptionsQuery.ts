import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { ProductId, ProductWithOptions } from "src/api/types/Product";
import { api } from "..";

export function productWithOptionsOptions(
  productId: number | null
): UseQueryOptions<ProductWithOptions, Error> {
  return {
    queryFn: async () => {
      if (!productId) throw new Error("productId is null. This should never happen");
      return (await api.axios.get<ProductWithOptions>(api.routes.product(productId))).data;
    },
    queryKey: ["product", productId],
    enabled: !!productId,
  };
}

export default function useProductWithOptionsQuery(productId: ProductId) {
  return useQuery<ProductWithOptions, Error>(productWithOptionsOptions(productId));
}
