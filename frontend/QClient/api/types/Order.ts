import { ProductId } from "./Product";

export type PlacedOrder = {
  items: {
    productId: ProductId;
    count: number;
  }[];
  additionalNotes: string | null;
};

export type HistoryOrder = {
  id: number;
  orderStatus: string;
  orderTimestamp: Date;
  deliveryTimestamp: Date;
  estimatedPreparationTime: number;
  additionalNotes: string;
  totalPrice: number;
  totalPriceWithDiscount: number;
  items: {
    productId: number;
    count: number;
  }[];
};
