import { OptionId, OptionListId, Product } from "@/api/types/Product";
import logger from "@/utils/logger";
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from "react";

export type CartItemId = number;
export type CartItemOptions = Record<OptionListId, Record<OptionId, number>>;
export type CartItem = {
  id: CartItemId;
  product: Product;
  options: CartItemOptions;
  count: number;
};

type CartContextType = {
  cart: CartItem[];
  addCartItem: (product: Product, options: CartItemOptions) => void;
  changeCartItemCount: (cartItemId: CartItemId, increment: number) => void;
  changeCartItemOptions: (cartItemId: CartItemId, options: CartItemOptions) => void;
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

  const addCartItem = useCallback(
    (product: Product, options: CartItemOptions) => {
      setCart([...cart, { id: nextId.current++, product, options, count: 1 }]);
    },
    [cart]
  );

  const changeCartItemCount = useCallback(
    (cartItemId: CartItemId, increment: number) => {
      const item = cart.find((item) => item.id === cartItemId);
      if (!item) {
        throw new Error(`Item ( ${cartItemId} ) not found in cart`);
      }

      item.count += increment;
      if (item.count <= 0) {
        setCart(cart.filter((item) => item.id !== cartItemId));
      } else {
        setCart([...cart]);
      }
    },
    [cart]
  );

  const changeCartItemOptions = useCallback(
    (cartItemId: number, options: CartItemOptions) => {
      console.log("changeCartItemOptions", cartItemId);
      const item = cart.find((item) => item.id === cartItemId);
      if (!item) {
        throw new Error(`Item ( ${cartItemId} ) not found in cart`);
      }

      item.options = options;
      setCart([...cart]);
    },
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, addCartItem, changeCartItemCount, changeCartItemOptions }}>
      {children}
    </CartContext.Provider>
  );
}
