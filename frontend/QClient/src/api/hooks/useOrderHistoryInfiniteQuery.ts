import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { HistoryOrder, HistoryOrderDTO } from "src/api/types/Order";
import { useAuthContext } from "src/context/AuthContext";

const PAGE_SIZE = 5;

export default function useOrderHistoryInfiniteQuery() {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in useOrderHistoryQuery");

  const accountId = authContext.account.id;

  return useInfiniteQuery<HistoryOrder[], Error>({
    queryKey: ["order-history", accountId],
    queryFn: async ({ pageParam }) => {
      const response = await api.axios.get<HistoryOrderDTO[]>(api.routes.account(accountId).orders, {
        params: {
          page: pageParam,
          pageSize: PAGE_SIZE,
        },
      });

      const historyOrderDtos = response.data;

      return historyOrderDtos.map((dto) => ({
        ...dto,
        orderTimestamp: new Date(dto.orderTimestamp),
        deliveryTimestamp: dto.deliveryTimestamp ? new Date(dto.deliveryTimestamp) : undefined,
      }));
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.length < PAGE_SIZE ? undefined : allPages.length),
    initialPageParam: 0,
  });
}
