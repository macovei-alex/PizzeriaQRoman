import { CategoryId } from "./Category";

export type ProductId = number;
export type OptionId = number;
export type OptionListId = number;

export type Option = {
  id: OptionId;
  name: string;
  additionalDescription: string;
  price: number;
  minCount: number;
  maxCount: number;
};

export type OptionList = {
  id: OptionListId;
  text: string;
  minChoices: number;
  maxChoices: number;
  options: Option[];
};

export type Product = {
  id: ProductId;
  name: string;
  subtitle: string | null;
  description: string | null;
  price: number;
  imageName: string;
  imageVersion: number;
  categoryId: CategoryId;
};

export type ProductWithIngredients = Product & {
  ingredients: Set<string>;
};

export type ProductWithOptions = Product & {
  optionLists: OptionList[];
};
