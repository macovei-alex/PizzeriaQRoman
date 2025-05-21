import { ProductWithOptions } from "src/api/types/Product";
import logger from "src/utils/logger";
import React, { createContext, ReactNode, useCallback, useContext } from "react";
import { useAuthContext } from "../AuthContext";
import { CartItem, CartItemId, CartItemOptions } from "./types";
import { useHydratedCartItems } from "./useHydratedCartItems";

type CartContextType = {
  cart: CartItem[];
  addCartItem: (product: ProductWithOptions, options: CartItemOptions) => void;
  changeCartItemCount: (cartItemId: CartItemId, increment: number) => void;
  changeCartItemOptions: (cartItemId: CartItemId, options: CartItemOptions) => void;
  emptyCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCartContext must be used within a CartContextProvider");
  return context;
}

export function CartContextProvider({ children }: { children: ReactNode }) {
  logger.render("CartContextProvider");

  const accountId = useAuthContext().account?.id || null;
  const { cart, setCart, nextId } = useHydratedCartItems(accountId);

  const addCartItem = useCallback(
    (product: ProductWithOptions, options: CartItemOptions) => {
      setCart((prev) => [...prev, { id: nextId.current++, product, options, count: 1 }]);
    },
    [setCart, nextId]
  );

  const changeCartItemCount = useCallback(
    (cartItemId: CartItemId, increment: number) => {
      const item = cart.find((item) => item.id === cartItemId);
      if (!item) throw new Error(`Item ( ${cartItemId} ) not found in cart`);
      if (item.count + increment < 0) throw new Error("Item count cannot be negative");

      item.count += increment;
      if (item.count === 0) {
        setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      } else if (item.count > 0) {
        setCart((prev) => [...prev]);
      }
    },
    [cart, setCart]
  );

  const changeCartItemOptions = useCallback(
    (cartItemId: number, options: CartItemOptions) => {
      const item = cart.find((item) => item.id === cartItemId);
      if (!item) throw new Error(`Item ( ${cartItemId} ) not found in cart`);

      item.options = options;
      setCart((prev) => [...prev]);
    },
    [cart, setCart]
  );

  const emptyCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  return (
    <CartContext.Provider
      value={{ cart, addCartItem, changeCartItemCount, changeCartItemOptions, emptyCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
