import { useQuery } from "@tanstack/react-query";
import { FullHistoryOrder, FullHistoryOrderDTO, OrderId, OrderStatusSchema } from "../types/Order";
import { api } from "..";
import { useAuthContext } from "src/context/AuthContext";
import logger from "src/utils/logger";

export function useFullOrderQuery(orderId: OrderId) {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in useFullOrderQuery");
  const accountId = authContext.account.id;

  return useQuery<FullHistoryOrder, Error>({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const response = await api.axios.get<FullHistoryOrderDTO>(api.routes.account(accountId).order(orderId));

      const dto = response.data;
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
    },
  });
}
