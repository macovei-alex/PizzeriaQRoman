import { useQuery } from "react-query";
import api from "../api";

export default function useApiProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: api.fetchProducts,
  });
}
