import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { Product } from "src/api/types/Product";

export default function useProductsQuery() {
  return useQuery<Product[], Error>({
    queryFn: async () => {
      return (await api.axios.get<Product[]>(api.routes.products)).data;
    },
    queryKey: ["products"],
  });
}
