import { useQueries, useQuery } from "@tanstack/react-query";
import { OrderId, OrderStatusSchema } from "../types/order/Order";
import { api } from "..";
import { useAuthContext } from "src/context/AuthContext";
import { FullHistoryOrder, FullHistoryOrderDTO } from "../types/order/FullHistoryOrder";
import { ProductWithOptions } from "../types/Product";
import { useMemo } from "react";

export function useFullOrderQuery(orderId: OrderId) {
  const authContext = useAuthContext();
  if (!authContext.account) throw new Error("Account is not defined in useFullOrderQuery");
  const accountId = authContext.account.id;

  const orderQuery = useQuery<FullHistoryOrderDTO, Error>({
    queryKey: ["orders", orderId],
    queryFn: async () =>
      (await api.axios.get<FullHistoryOrderDTO>(api.routes.account(accountId).order(orderId))).data,
  });

  const uniqueProductQueries = useMemo(() => {
    if (!orderQuery.data) return [];
    const productIds = new Set();
    return orderQuery.data.items
      .map((item) => {
        if (productIds.has(item.productId)) return null;
        productIds.add(item.productId);
        return {
          queryKey: ["product", item.productId],
          queryFn: async () =>
            (await api.axios.get<ProductWithOptions>(api.routes.product(item.productId))).data,
          enabled: !!orderQuery.data,
        };
      })
      .filter((query) => query !== null);
  }, [orderQuery]);

  const productsQueries = useQueries({ queries: uniqueProductQueries });

  const products = useMemo(() => {
    if (productsQueries.find((query) => !query.data || query.isFetching)) return undefined;
    return productsQueries.map((response) => response.data as ProductWithOptions);
  }, [productsQueries]);

  const data = useMemo<FullHistoryOrder | undefined>(() => {
    if (!orderQuery.data || orderQuery.isFetching || !products) return undefined;

    const orderDto = orderQuery.data;

    const statusResult = OrderStatusSchema.safeParse(orderDto.orderStatus);
    if (!statusResult.success) throw new Error(`Order status is not valid: ${orderDto.orderStatus}`);

    return {
      ...orderDto,
      items: orderDto.items.map((item) => {
        const product = products.find((product) => product.id === item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        return {
          ...item,
          product,
        };
      }),
      orderStatus: statusResult.success ? statusResult.data : "RECEIVED",
      orderTimestamp: new Date(orderDto.orderTimestamp),
      deliveryTimestamp: orderDto.deliveryTimestamp ? new Date(orderDto.deliveryTimestamp) : undefined,
    };
  }, [orderQuery, products]);

  const mergedQueryObject = useMemo(() => {
    const isLoading = orderQuery.isLoading || productsQueries.some((q) => q.isLoading);
    const isFetching = orderQuery.isFetching || productsQueries.some((q) => q.isFetching);
    const isError = orderQuery.isError || productsQueries.some((q) => q.isError);

    return {
      data,
      error: orderQuery.error || productsQueries.find((q) => q.error)?.error,
      isLoading,
      isFetching,
      isError,
      refetch: async () => {
        await Promise.all([orderQuery.refetch(), ...productsQueries.map((q) => q.refetch())]);
      },
    };
  }, [orderQuery, productsQueries, data]);

  return mergedQueryObject;
}
