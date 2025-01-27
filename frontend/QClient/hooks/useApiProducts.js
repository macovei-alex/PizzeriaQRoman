import { useQuery } from "react-query";
import api from "../api";

export default function useApiProducts() {
  const productsQuery = useQuery({
    queryKey: ["products"],
    queryFn: api.fetchProducts,
  });

  return productsQuery;
}
