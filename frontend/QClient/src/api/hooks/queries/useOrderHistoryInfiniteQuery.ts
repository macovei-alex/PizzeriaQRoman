import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "src/api";
import { OrderStatusSchema } from "src/api/types/order/Order";
import { useAuthContext } from "src/context/AuthContext";
import logger from "src/utils/logger";
import { HistoryOrderMinimal, HistoryOrderMinimalDTO } from "../../types/order/HistoryOrderMinimal";

const PAGE_SIZE = 5;

export default function useOrderHistoryInfiniteQuery() {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in useOrderHistoryQuery");
  const accountId = authContext.account.id;

  return useInfiniteQuery<HistoryOrderMinimal[], Error>({
    queryKey: ["order-history", accountId],
    queryFn: async ({ pageParam }) => {
      const response = await api.axios.get<HistoryOrderMinimalDTO[]>(api.routes.account(accountId).orders, {
        params: {
          page: pageParam,
          pageSize: PAGE_SIZE,
        },
      });

      const dtos = response.data;

      return dtos.map((dto) => {
        const statusResult = OrderStatusSchema.safeParse(dto.orderStatus);
        if (!statusResult.success) {
          logger.warn(`Order status is not valid: ${dto.orderStatus}`);
        }
        return {
          ...dto,
          orderStatus: statusResult.success ? statusResult.data : "RECEIVED",
          orderTimestamp: new Date(dto.orderTimestamp),
          deliveryTimestamp: dto.deliveryTimestamp ? new Date(dto.deliveryTimestamp) : undefined,
        };
      });
    },
    getNextPageParam: (lastPage, allPages) => (lastPage.length < PAGE_SIZE ? undefined : allPages.length),
    initialPageParam: 0,
  });
}
