import React, { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function GlobalContextProvider({ children }) {
  const [gProduct, gSetProduct] = useState(null);

  return (
    <GlobalContext.Provider value={{ gProduct, gSetProduct }}>
      {children}
    </GlobalContext.Provider>
  );
}
