import { useQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { HistoryOrder, HistoryOrderDTO } from "src/api/types/Order";
import { useAuthContext } from "src/context/AuthContext";

export default function useOrderHistoryQuery() {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in useOrderHistoryQuery");

  const accountId = authContext.account.id;

  return useQuery<HistoryOrder[], Error>({
    queryFn: async () => {
      const historyOrderDtos = (await api.axios.get<HistoryOrderDTO[]>(api.routes.account(accountId).orders))
        .data;
      return historyOrderDtos.map((dto) => {
        return {
          ...dto,
          orderTimestamp: new Date(dto.orderTimestamp),
          deliveryTimestamp: !!dto.deliveryTimestamp ? new Date(dto.deliveryTimestamp) : undefined,
        };
      });
    },
    queryKey: ["order-history"],
  });
}
