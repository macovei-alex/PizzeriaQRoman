import { OptionId, OptionListId, ProductWithOptions } from "src/api/types/Product";
import logger from "src/utils/logger";
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";

function logCart(cart: CartItem[]) {
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

export type CartItemId = number;
export type CartItemOptions = Record<OptionListId, Record<OptionId, number>>;
export type CartItem = {
  id: CartItemId;
  product: ProductWithOptions;
  options: CartItemOptions;
  count: number;
};

type CartContextType = {
  cart: CartItem[];
  addCartItem: (product: Readonly<ProductWithOptions>, options: CartItemOptions) => void;
  changeCartItemCount: (cartItemId: CartItemId, increment: number) => void;
  changeCartItemOptions: (cartItemId: CartItemId, options: CartItemOptions) => void;
  emptyCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within a CartContextProvider");
  }
  return context;
}

export function CartContextProvider({ children }: { children: ReactNode }) {
  logger.render("CartContextProvider");

  const [cart, setCart] = useState<CartItem[]>([]);
  const nextId = useRef(1);

  const addCartItem = useCallback((product: Readonly<ProductWithOptions>, options: CartItemOptions) => {
    setCart((prev) => {
      const newCart = [...prev, { id: nextId.current++, product, options, count: 1 }];
      logCart(newCart);
      return newCart;
    });
  }, []);

  const changeCartItemCount = useCallback(
    (cartItemId: CartItemId, increment: number) => {
      const item = cart.find((item) => item.id === cartItemId);
      if (!item) {
        throw new Error(`Item ( ${cartItemId} ) not found in cart`);
      }

      item.count += increment;
      if (item.count <= 0) {
        setCart((prev) => {
          const newCart = prev.filter((item) => item.id !== cartItemId);
          logCart(newCart);
          return newCart;
        });
      } else {
        setCart((prev) => {
          const newCart = [...prev];
          logCart(newCart);
          return newCart;
        });
      }
    },
    [cart]
  );

  const changeCartItemOptions = useCallback(
    (cartItemId: number, options: CartItemOptions) => {
      const item = cart.find((item) => item.id === cartItemId);
      if (!item) {
        throw new Error(`Item ( ${cartItemId} ) not found in cart`);
      }

      item.options = options;
      setCart((prev) => {
        const newCart = [...prev];
        logCart(newCart);
        return newCart;
      });
    },
    [cart]
  );

  const emptyCart = useCallback(() => {
    setCart(() => []);
  }, [setCart]);

  return (
    <CartContext.Provider
      value={{ cart, addCartItem, changeCartItemCount, changeCartItemOptions, emptyCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
