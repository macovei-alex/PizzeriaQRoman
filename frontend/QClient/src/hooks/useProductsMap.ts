import { useMemo } from "react";
import useProductsQuery from "src/api/hooks/queries/useProductsQuery";
import { Product, ProductId } from "src/api/types/Product";

export function useProductsMap() {
  const productsQuery = useProductsQuery();

  const productsMap = useMemo<Map<ProductId, Product>>(() => {
    if (!productsQuery.data) return new Map<ProductId, Product>();
    return productsQuery.data.reduce((acc, product) => {
      acc.set(product.id, product);
      return acc;
    }, new Map<ProductId, Product>());
  }, [productsQuery.data]);

  return productsMap;
}
