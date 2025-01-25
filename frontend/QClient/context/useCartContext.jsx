import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

/**
 * @returns {{cart: Object[], setCart: React.Dispatch<React.SetStateAction<string>>}}
 */
export function useCartContext() {
  return useContext(CartContext);
}

export function CartContextProvider({ children }) {
  const [cart, setCart] = useState([]);

  return <CartContext.Provider value={{ cart, setCart }}>{children}</CartContext.Provider>;
}
