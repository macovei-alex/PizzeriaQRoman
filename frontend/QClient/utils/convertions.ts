import { CartItemOptions } from "@/context/useCartContext";
import { PlacedOrderOptionList } from "../api/types/Order";

export function convertCartItemOptions(cartItemOptions: CartItemOptions): PlacedOrderOptionList[] {
  return Object.entries(cartItemOptions).map(([optionListId, optionList]) => ({
    optionListId: Number(optionListId),
    options: Object.entries(optionList).map(([optionId, optionCount]) => ({
      optionId: Number(optionId),
      count: optionCount,
    })),
  }));
}
