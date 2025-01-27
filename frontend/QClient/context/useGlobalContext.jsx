import React, { createContext, useContext } from "react";

const GlobalContext = createContext();

export function useGlobalContext() {
  return useContext(GlobalContext);
}

export function GlobalContextProvider({ children }) {
  return <GlobalContext.Provider value={null}>{children}</GlobalContext.Provider>;
}
