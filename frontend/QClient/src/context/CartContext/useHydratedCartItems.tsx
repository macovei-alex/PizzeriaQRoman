import { QueriesResults, useQueries } from "@tanstack/react-query";
import { AccountId } from "../AuthContext";
import { productWithOptionsOptions } from "src/api/hooks/options/productWithOptionsOptions";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cart, SerializedCart } from "./types";
import { storage } from "src/constants/mmkv";
import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/constants/logger";

export function logCart(cart: Cart) {
  logger.log(
    JSON.stringify(
      cart.map((item) => {
        return {
          id: item.id,
          options: item.options,
        };
      })
    )
  );
}

export function useHydratedCartItems(accountId: AccountId | null) {
  const [serializedCart, setSerializedCart] = useState<SerializedCart>([]);
  const [cart, setCart] = useState<Cart>([]);
  const nextId = useRef(0);

  const uniqueProductids = useMemo(
    () => [...new Set(serializedCart.map((item) => item.productId))],
    [serializedCart]
  );

  const products = useQueries({
    queries: uniqueProductids.map((id) => productWithOptionsOptions(id)),
    combine: (results: QueriesResults<ProductWithOptions[]>) => {
      const allFetched = results.every((q) => q.status === "success");
      const data = allFetched ? results.map((q) => q.data as ProductWithOptions) : [];
      return {
        status: allFetched ? "success" : "loading",
        data,
      };
    },
  });

  const setCartWrapper: React.Dispatch<React.SetStateAction<Cart>> = useCallback(
    (action) => {
      setCart((prevCart) => {
        const nextCart = typeof action === "function" ? (action as (prev: Cart) => Cart)(prevCart) : action;
        const serialized: SerializedCart = nextCart.map((item) => {
          const serialized = {
            ...item,
            product: undefined,
            productId: item.product.id,
          };
          delete serialized.product;
          return serialized;
        });

        setSerializedCart(serialized);
        if (accountId) {
          storage.setObject<SerializedCart>(`cart-${accountId}`, serialized);
        }

        return nextCart;
      });
    },
    [accountId]
  );

  useEffect(() => {
    if (accountId) {
      const loadedCart = storage.getObject<SerializedCart>(`cart-${accountId}`);
      const cartIds = loadedCart?.map((item) => item.id) || [];
      nextId.current = cartIds.length > 0 ? Math.max(...cartIds) + 1 : 1;
      if (loadedCart) setSerializedCart(loadedCart);
    }
  }, [accountId]);

  useEffect(() => {
    if (products.status !== "success") return;
    const newCart = serializedCart.map((serializedProduct) => {
      const product = products.data.find((product) => product.id === serializedProduct.productId);
      if (!product) throw new Error(`Product with id ${serializedProduct.productId} not found`);
      const hydratedProduct = {
        ...serializedProduct,
        product,
        productId: undefined,
      };
      delete hydratedProduct.productId;
      return hydratedProduct;
    });
    setCart(newCart);
  }, [products, serializedCart]);

  return { cart, setCart: setCartWrapper, nextId };
}
