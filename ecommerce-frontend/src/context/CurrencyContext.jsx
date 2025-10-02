import React, { createContext, useEffect, useMemo, useState } from "react";

const defaultCurrency = "PEN";
const baseCurrency = "PEN";
const rates = {
  PEN: 1,
  USD: 0.27,
  EUR: 0.25,
};
const locales = {
  PEN: "es-PE",
  USD: "en-US",
  EUR: "es-ES",
};

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => defaultCurrency);

  useEffect(() => {
    try {
      localStorage.setItem("currency", defaultCurrency);
    } catch {
      /* ignore */
    }
  }, []);

  const convert = useMemo(() => {
    return (amount, fromCurrency = baseCurrency, toCurrency = currency) => {
      const baseRate = rates[fromCurrency] ?? 1;
      const targetRate = rates[toCurrency] ?? 1;
      return (amount / baseRate) * targetRate;
    };
  }, [currency]);

  const formatPrice = useMemo(() => {
    return (amount, options = {}) => {
      const targetCurrency = options.currency || currency;
      const locale = locales[targetCurrency] || "es-PE";
      const value = convert(amount, baseCurrency, targetCurrency);
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: targetCurrency,
        minimumFractionDigits: 2,
      }).format(value);
    };
  }, [convert, currency]);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      convert,
      formatPrice,
      rates,
      baseCurrency,
    }),
    [convert, currency, formatPrice]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}
