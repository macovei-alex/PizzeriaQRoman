import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { HistoryOrder, HistoryOrderDTO } from "src/api/types/Order";
import { useAuthContext } from "src/context/AuthContext";

export default function useOrderHistoryQuery() {
  const { account } = useAuthContext();

  if (!account) throw new Error("Account is not defined in useOrderHistoryQuery");

  return useQuery<HistoryOrder[], Error>({
    queryFn: async () => {
      const historyOrderDtos = (await api.axios.get(`/accounts/${account.id}/orders`))
        .data as HistoryOrderDTO[];
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
