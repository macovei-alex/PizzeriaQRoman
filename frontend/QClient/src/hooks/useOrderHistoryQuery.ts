import { useQuery } from "@tanstack/react-query";
import api from "src/api";
import { HistoryOrder } from "src/api/types/Order";

export default function useOrderHistoryQuery() {
  return useQuery<HistoryOrder[], Error>({
    queryKey: ["order-history"],
    queryFn: api.fetchOrderHistory,
  });
}
