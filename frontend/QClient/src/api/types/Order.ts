import { OptionId, OptionListId, ProductId } from "./Product";

export type OrderStatus = "RECEIVED" | "IN_PREPARATION" | "IN_DELIVERY" | "DELIVERED";

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

export type HistoryOrder = {
  id: number;
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
  id: number;
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
