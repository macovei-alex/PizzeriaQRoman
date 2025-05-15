import { Address } from "../Address";
import { OrderId, OrderItemId, OrderStatus } from "./Order";
import { OptionId, OptionListId, ProductId, ProductWithOptions } from "../Product";

export type FullOrderItemOptions = {
  id: number;
  optionListId: OptionListId;
  optionId: OptionId;
  count: number;
}[];

export type FullOrderItemDTO = {
  id: OrderItemId;
  productId: ProductId;
  count: number;
  options: FullOrderItemOptions;
};

export type FullOrderItem = {
  id: OrderItemId;
  product: ProductWithOptions;
  count: number;
  options: FullOrderItemOptions;
};

export type FullHistoryOrderDTO = {
  id: OrderId;
  orderStatus: string;
  orderTimestamp: string;
  deliveryTimestamp?: string;
  estimatedPreparationTime?: number;
  additionalNotes: string;
  totalPrice: number;
  totalPriceWithDiscount: number;
  address: Address;
  items: FullOrderItemDTO[];
};

export type FullHistoryOrder = {
  id: OrderId;
  orderStatus: OrderStatus;
  orderTimestamp: Date;
  deliveryTimestamp?: Date;
  estimatedPreparationTime?: number;
  additionalNotes: string;
  totalPrice: number;
  totalPriceWithDiscount: number;
  address: Address;
  items: FullOrderItem[];
};
