import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { ProductId, ProductWithOptions } from "src/api/types/Product";

export default function useProductWithOptionsQuery(productId: ProductId) {
  return useQuery<ProductWithOptions, Error>({
    queryFn: async () => {
      return (await api.axios.get<ProductWithOptions>(api.routes.product(productId))).data;
    },
    queryKey: ["product", productId],
  });
}
