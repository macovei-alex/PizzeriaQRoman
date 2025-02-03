import { useQuery } from "@tanstack/react-query";
import api from "@/api";
import { HistoryOrder } from "@/api/types/Order";

export default function useOrderHistoryQuery() {
  return useQuery<HistoryOrder[], Error>({
    queryKey: ["order-history"],
    queryFn: api.fetchOrderHistory,
  });
}
