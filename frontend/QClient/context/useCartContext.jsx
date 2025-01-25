import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

/**
 * @returns {{cart: {id: number, product: Object, count: number}[], setCart: React.Dispatch<React.SetStateAction<string>>}}
 */
export function useCartContext() {
  return useContext(CartContext);
}

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
