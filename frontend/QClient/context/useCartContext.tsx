import React, { createContext, ReactNode, useContext, useState } from "react";

export type CartItem = {
  id: number;
  product: any;
  count: number;
};

export type CartContextType = {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export function useCartContext() {
  return useContext(CartContext);
}

export function CartContextProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
