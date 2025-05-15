import { Address } from "../Address";
import { OrderId, OrderItemId, OrderStatus } from "./Order";
import { OptionId, OptionListId, ProductId, ProductWithOptions } from "../Product";

export type FullOrderItemDTO = {
  id: OrderItemId;
  productId: ProductId;
  count: number;
  options: {
    id: number;
    optionListId: OptionListId;
    optionId: OptionId;
    count: number;
  }[];
};

export type FullOrderItem = {
  id: OrderItemId;
  product: ProductWithOptions;
  count: number;
  options: {
    id: number;
    optionListId: OptionListId;
    optionId: OptionId;
    count: number;
  }[];
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
