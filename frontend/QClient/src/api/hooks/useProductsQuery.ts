import { useQuery } from "@tanstack/react-query";
import { resApi } from "src/api";
import { Product } from "src/api/types/Product";

export default function useProductsQuery() {
  return useQuery<Product[], Error>({
    queryFn: async () => {
      return (await resApi.axios.get("/product/all")).data as Product[];
    },
    queryKey: ["products"],
  });
}
