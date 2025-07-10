import { useEffect, useMemo, useState } from "react";
import useProductsQuery from "src/api/queries/productsQuery";
import { ProductWithIngredients } from "src/api/types/Product";
import { useDebounced } from "./useDebounced";
import { tokenize } from "src/utils/convertions";

function ingredientScore(userIngredients: string[], productIngredients: Set<string>): number {
  const intersection = new Set(userIngredients.filter((x) => productIngredients.has(x)));
  const union = new Set([...userIngredients, ...productIngredients]);
  return intersection.size / (union.size || 1);
}

export function useDebounceSearch(searchQuery: string, delay: number) {
  const productsQuery = useProductsQuery();
  const [matches, setMatches] = useState<ProductWithIngredients[]>([]);

  const searchableProducts = useMemo(
    () =>
      productsQuery.data?.filter(
        (p) => p.subtitle?.includes("1+1") || !p.name.toLowerCase().startsWith("pizza")
      ),
    [productsQuery.data]
  );

  const debouncedSearch = useDebounced(async (products: ProductWithIngredients[], searchQuery: string) => {
    if (products.length === 0 || !searchQuery) return [];

    const userIngredients = tokenize(searchQuery);

    return products
      .map((product) => ({
        product,
        score: ingredientScore(userIngredients, product.ingredients),
      }))
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);
  }, delay);

  useEffect(() => {
    if (!searchableProducts || searchableProducts.length === 0 || !searchQuery) {
      setMatches([]);
      return;
    }

    let isMounted = true;
    debouncedSearch.delayedExecute(searchableProducts, searchQuery).then((results) => {
      if (isMounted) {
        setMatches((prev) => {
          if (prev.length !== results.length) return results;
          if (prev.some((product, index) => results[index] !== product)) return results;
          return prev;
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, searchableProducts, searchQuery]);

  return matches;
}
