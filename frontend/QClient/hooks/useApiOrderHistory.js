import { useQuery } from "react-query";
import api from "../api";

export default function useApiOrderHistory() {
  return useQuery({
    queryKey: ["order-history"],
    queryFn: api.fetchOrderHistory,
  });
}
