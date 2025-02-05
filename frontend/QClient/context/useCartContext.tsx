import { Product } from "@/api/types/Product";
import logger from "@/utils/logger";
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";

export type CartItem = {
  id: number;
  product: Product;
  count: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, count: number) => void;
  removeFromCart: (cartItemId: number, count: number) => void;
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

  const addToCart = useCallback(
    (product: Product, count: number) => {
      const item = cart.find((item) => item.product.id === product.id);
      if (item) {
        item.count += count;
        setCart([...cart]);
      } else {
        setCart([...cart, { id: nextId.current++, product, count }]);
      }
    },
    [cart]
  );

  const removeFromCart = useCallback(
    (cartItemId: number, count: number) => {
      const item = cart.find((item) => item.id === cartItemId);
      if (item) {
        item.count -= count;
        if (item.count <= 0) {
          setCart(cart.filter((item) => item.id !== cartItemId));
        } else {
          setCart([...cart]);
        }
      }
    },
    [cart]
  );

  return <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>{children}</CartContext.Provider>;
}
