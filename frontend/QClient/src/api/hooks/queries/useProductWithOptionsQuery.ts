import { useQuery } from "@tanstack/react-query";
import { ProductId, ProductWithOptions } from "src/api/types/Product";
import { productWithOptionsOptions } from "../options/productWithOptionsOptions";

export default function useProductWithOptionsQuery(productId: ProductId) {
  return useQuery<ProductWithOptions, Error>(productWithOptionsOptions(productId));
}
