import { OptionId, OptionListId, ProductId } from "../Product";

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
  clientExpectedPrice: number;
};
