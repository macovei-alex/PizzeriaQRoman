import { useQuery } from "@tanstack/react-query";
import { resApi } from "src/api";
import { HistoryOrder, HistoryOrderDTO } from "src/api/types/Order";

export default function useOrderHistoryQuery() {
  return useQuery<HistoryOrder[], Error>({
    queryFn: async () => {
      const historyOrderDtos = (await resApi.axios.get("/order/history")).data as HistoryOrderDTO[];
      return historyOrderDtos.map((dto) => {
        return {
          ...dto,
          orderTimestamp: new Date(dto.orderTimestamp),
          deliveryTimestamp: !!dto.deliveryTimestamp ? new Date(dto.deliveryTimestamp) : null,
        } as HistoryOrder;
      });
    },
    queryKey: ["order-history"],
  });
}
