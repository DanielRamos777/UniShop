import React, { useContext } from "react";
import { CurrencyContext } from "../context/CurrencyContext";
import "./CurrencySelector.css";

const labels = {
  PEN: "Soles (PEN)",
  USD: "Dolares (USD)",
  EUR: "Euros (EUR)",
};

function CurrencySelector() {
  const { currency, setCurrency } = useContext(CurrencyContext);

  const handleChange = (event) => {
    setCurrency(event.target.value);
  };

  return (
    <label className="currency-selector">
      <span>Moneda</span>
      <select value={currency} onChange={handleChange} aria-label="Seleccionar moneda">
        {Object.keys(labels).map((code) => (
          <option key={code} value={code}>
            {labels[code]}
          </option>
        ))}
      </select>
    </label>
  );
}

export default CurrencySelector;
