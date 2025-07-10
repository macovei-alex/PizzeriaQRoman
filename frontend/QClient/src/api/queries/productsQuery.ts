import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { api } from "src/api";
import { Product, ProductWithIngredients } from "src/api/types/Product";
import { tokenize } from "src/utils/convertions";

export function productsQueryOptions(): UseQueryOptions<ProductWithIngredients[], Error> {
  return {
    queryFn: async () => {
      const products = (await api.axios.get<Product[]>(api.routes.products)).data;
      return products.map((p) => ({
        ...p,
        ingredients: new Set(tokenize([p.name, p.subtitle ?? "", p.description ?? ""])),
      }));
    },
    queryKey: ["products"],
  };
}

export default function useProductsQuery() {
  return useQuery(productsQueryOptions());
}
