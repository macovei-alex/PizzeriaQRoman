import { QueriesResults, useQueries } from "@tanstack/react-query";
import { AccountId } from "../AuthContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Cart, SerializedCart, SerializedCartItem } from "./types";
import { storage } from "src/constants/mmkv";
import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/constants/logger";
import { productWithOptionsOptions } from "src/api/queries/productWithOptionsQuery";

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
  const shouldSetSerializedCart = useRef(false);

  const uniqueProductQueries = useMemo(
    () =>
      [...new Set(serializedCart.map((item) => item.productId))].map((id) => productWithOptionsOptions(id)),
    [serializedCart]
  );

  const products = useQueries({
    queries: uniqueProductQueries,
    combine: (results: QueriesResults<ProductWithOptions[]>) => {
      const statuses = results.reduce(
        (acc, q) => {
          ++acc[q.status];
          return acc;
        },
        {
          success: 0,
          pending: 0,
          error: 0,
        }
      );
      const data = results.filter((q) => q.status === "success").map((q) => q.data as ProductWithOptions);
      shouldSetSerializedCart.current = statuses.success < uniqueProductQueries.length;
      return {
        status:
          statuses.success === uniqueProductQueries.length
            ? "success"
            : statuses.pending > 0
              ? "pending"
              : "error",
        data,
      };
    },
  });

  // Sets the cart state, the serialized cart state and updates the cart from device storage
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

  // First cart load from device storage
  useEffect(() => {
    if (accountId) {
      const loadedCart = storage.getObject<SerializedCart>(`cart-${accountId}`);
      const cartIds = loadedCart?.map((item) => item.id) || [];
      nextId.current = cartIds.length > 0 ? Math.max(...cartIds) + 1 : 1;
      if (loadedCart) setSerializedCart(loadedCart);
    }
  }, [accountId]);

  useEffect(() => {
    if (products.status === "pending") return;
    const newCart = serializedCart
      .map((item) => ({
        serializedProduct: item,
        product: products.data.find((product) => product.id === item.productId),
      }))
      .filter((item): item is { product: ProductWithOptions; serializedProduct: SerializedCartItem } => {
        if (item.product === undefined) {
          logger.warn(`Product with ID ${item.serializedProduct.productId} not found in fetched products`);
          return false;
        } else if (item.product.isActive === false) {
          logger.warn(`Product with ID ${item.serializedProduct.productId} is not active`);
          return false;
        }

        return true;
      })
      .map((item) => {
        const hydratedProduct = {
          ...item.serializedProduct,
          product: item.product,
          // Removes the productId because it can be found in product.id
          productId: undefined,
        };
        delete hydratedProduct.productId;

        return hydratedProduct;
      });

    // Updates cart stored on the device if menu got updated and some products were not found based on their id
    if (newCart.length !== serializedCart.length) shouldSetSerializedCart.current = true;

    if (shouldSetSerializedCart.current) {
      shouldSetSerializedCart.current = false;
      setCartWrapper(newCart);
    } else {
      setCart(newCart);
    }
  }, [accountId, products, serializedCart, setCartWrapper]);

  return { cart, setCart: setCartWrapper, nextId };
}
