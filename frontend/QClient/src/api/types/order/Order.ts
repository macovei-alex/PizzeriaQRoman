import { z } from "zod";

export const OrderStatusSchema = z.enum(["RECEIVED", "IN_PREPARATION", "IN_DELIVERY", "DELIVERED"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export type OrderId = number;
export type OrderItemId = number;
