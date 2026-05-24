import { createContext, useContext, useEffect, useState } from "react";
import { CURRENCY_SYMBOLS } from "./constants";

const CurrencyContext = createContext();

const currencySymbols = CURRENCY_SYMBOLS;

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem("currency") || "INR";
  });

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  const symbol = currencySymbols[currency] || "₹";

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, symbol }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
