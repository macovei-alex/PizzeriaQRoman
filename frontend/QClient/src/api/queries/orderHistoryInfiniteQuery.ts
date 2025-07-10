import { InfiniteData, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { api } from "src/api";
import { OrderStatusSchema } from "src/api/types/order/Order";
import { useValidAccountId } from "src/context/AuthContext";
import logger from "src/constants/logger";
import { HistoryOrderMinimal, HistoryOrderMinimalDTO } from "../types/order/HistoryOrderMinimal";

const PAGE_SIZE = 5;

export function orderHistoryInfiniteQueryOptions(
  accountId: string
): UseInfiniteQueryOptions<
  HistoryOrderMinimal[],
  Error,
  InfiniteData<HistoryOrderMinimal[]>,
  HistoryOrderMinimal[],
  string[],
  number
> {
  return {
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
  };
}

export default function useOrderHistoryInfiniteQuery() {
  const accountId = useValidAccountId();
  return useInfiniteQuery(orderHistoryInfiniteQueryOptions(accountId));
}
