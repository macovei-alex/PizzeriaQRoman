import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { Product } from "@/api/types/Product";

export default function useProductsQuery() {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: api.fetchProducts,
  });
}
