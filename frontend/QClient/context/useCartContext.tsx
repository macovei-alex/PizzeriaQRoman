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

  const addCartItem = useCallback((product: Product, options: CartItemOptions) => {
    setCart((prev) => {
      const newCart = [...prev, { id: nextId.current++, product, options, count: 1 }];
      console.log(
        JSON.stringify(
          newCart.map((item) => {
            return {
              id: item.id,
              options: item.options,
            };
          })
        )
      );
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
          console.log(
            JSON.stringify(
              newCart.map((item) => {
                return {
                  id: item.id,
                  options: item.options,
                };
              })
            )
          );
          return newCart;
        });
      } else {
        setCart((prev) => {
          const newCart = [...prev];
          console.log(
            JSON.stringify(
              newCart.map((item) => {
                return {
                  id: item.id,
                  options: item.options,
                };
              })
            )
          );
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
        console.log(
          JSON.stringify(
            newCart.map((item) => {
              return {
                id: item.id,
                options: item.options,
              };
            })
          )
        );
        return newCart;
      });
    },
    [cart]
  );

  return (
    <CartContext.Provider value={{ cart, addCartItem, changeCartItemCount, changeCartItemOptions }}>
      {children}
    </CartContext.Provider>
  );
}
