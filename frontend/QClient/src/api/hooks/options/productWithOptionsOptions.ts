import { UseQueryOptions } from "@tanstack/react-query";
import { api } from "src/api";
import { ProductWithOptions } from "src/api/types/Product";

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
