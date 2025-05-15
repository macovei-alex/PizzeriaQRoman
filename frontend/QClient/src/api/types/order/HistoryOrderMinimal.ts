import { OrderId, OrderStatus } from "./Order";

export type HistoryOrderMinimalDTO = {
  id: OrderId;
  orderStatus: string;
  orderTimestamp: string;
  deliveryTimestamp?: string;
  estimatedPreparationTime?: number;
  additionalNotes: string;
  totalPrice: number;
  totalPriceWithDiscount: number;
  items: {
    productId: number;
    count: number;
  }[];
};

export type HistoryOrderMinimal = {
  id: OrderId;
  orderStatus: OrderStatus;
  orderTimestamp: Date;
  deliveryTimestamp?: Date;
  estimatedPreparationTime?: number;
  additionalNotes: string;
  totalPrice: number;
  totalPriceWithDiscount: number;
  items: {
    productId: number;
    count: number;
  }[];
};
