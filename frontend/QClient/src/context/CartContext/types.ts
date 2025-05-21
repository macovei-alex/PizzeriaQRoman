import { OptionId, OptionListId, ProductId, ProductWithOptions } from "src/api/types/Product";

export type CartItemId = number;

export type CartItemOptions = Record<OptionListId, Record<OptionId, number>>;

export type CartItem = {
  id: CartItemId;
  product: ProductWithOptions;
  options: CartItemOptions;
  count: number;
};

export type SerializedCartItem = {
  id: CartItemId;
  productId: ProductId;
  options: CartItemOptions;
  count: number;
};

export type Cart = CartItem[];

export type SerializedCart = SerializedCartItem[];
