import { z } from "zod";
import { OptionId, OptionListId, ProductId } from "./Product";

export const OrderStatusSchema = z.enum(["RECEIVED", "IN_PREPARATION", "IN_DELIVERY", "DELIVERED"]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export type PlacedOrderOption = {
  optionId: OptionId;
  count: number;
};

export type PlacedOrderOptionList = {
  optionListId: OptionListId;
  options: PlacedOrderOption[];
};

export type PlacedOrder = {
  addressId: number;
  items: {
    productId: ProductId;
    count: number;
    optionLists: PlacedOrderOptionList[];
  }[];
  additionalNotes: string | null;
};

export type OrderId = number;

export type HistoryOrder = {
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

export type HistoryOrderDTO = {
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

export type FullHistoryOrder = {
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
    // optionLists: {
    //   optionListId: OptionListId;
    //   options: {
    //     optionId: OptionId;
    //     count: number;
    //   }[];
    // }[];
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
  items: {
    productId: number;
    count: number;
    // optionLists: {
    //   optionListId: OptionListId;
    //   options: {
    //     optionId: OptionId;
    //     count: number;
    //   }[];
    // }[];
  }[];
};
