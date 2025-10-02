import React, { useContext, useMemo } from "react";
import { ProductContext } from "../context/ProductContext";
import { CurrencyContext } from "../context/CurrencyContext";
import ProductCard from "./ProductCard";
import "./ProductList.css";

const currencySymbols = {
  PEN: "S/",
  USD: "$",
  EUR: "€",
};

function ProductList() {
  const {
    filteredProducts,
    filters,
    updateFilters,
    resetFilters,
    toggleTagFilter,
    availableCategories,
    availableTags,
  } = useContext(ProductContext);
  const { formatPrice, currency, convert, baseCurrency } = useContext(CurrencyContext);

  const currencySymbol = currencySymbols[currency] || currency;
  const resultsCount = filteredProducts.length;

  const hasActiveFilters = useMemo(
    () =>
      Boolean(
        filters.searchTerm.trim() ||
          filters.category !== "all" ||
          filters.minPrice ||
          filters.maxPrice ||
          filters.tags.length ||
          filters.onlyAvailable
      ),
    [filters]
  );

  const activeFilterChips = useMemo(() => {
    const chips = [];
    if (filters.searchTerm.trim()) chips.push(`Busca: "${filters.searchTerm.trim()}"`);
    if (filters.category !== "all") chips.push(`Categoria: ${filters.category}`);
    if (filters.minPrice) {
      const amount = Number(filters.minPrice);
      if (!Number.isNaN(amount)) {
        const baseValue = convert(amount, currency, baseCurrency);
        chips.push(`Min ${formatPrice(baseValue)}`);
      }
    }
    if (filters.maxPrice) {
      const amount = Number(filters.maxPrice);
      if (!Number.isNaN(amount)) {
        const baseValue = convert(amount, currency, baseCurrency);
        chips.push(`Max ${formatPrice(baseValue)}`);
      }
    }
    if (filters.onlyAvailable) chips.push("Solo disponibles");
    if (filters.tags.length > 0) chips.push(`Etiquetas: ${filters.tags.join(", ")}`);
    return chips;
  }, [filters, formatPrice, convert, currency, baseCurrency]);

  const handleAvailabilityChange = (event) => {
    updateFilters({ onlyAvailable: event.target.checked });
  };

  // Wishlist interactions live inside ProductCard

  const visibleTags = availableTags.slice(0, 12);

  return (
    <div className="products">
      <header className="products-header">
        <div>
          <h2>Productos</h2>
          <p className="products-subtitle">
            Filtra por categoria, precio o etiquetas y encuentra rapido lo que necesitas.
          </p>
        </div>
        <span className="result-count">
          {resultsCount} resultado{resultsCount === 1 ? "" : "s"}
        </span>
      </header>

      <form className="products-filters" onSubmit={(event) => event.preventDefault()}>
        <div className="filter-row">
          <label>
            Buscar
            <input
              type="text"
              placeholder="Nombre o categoria"
              value={filters.searchTerm}
              onChange={(event) => updateFilters({ searchTerm: event.target.value })}
            />
          </label>
          <label>
            Categoria
            <select
              value={filters.category}
              onChange={(event) => updateFilters({ category: event.target.value })}
            >
              <option value="all">Todas</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label className="availability-toggle">
            <input
              type="checkbox"
              checked={filters.onlyAvailable}
              onChange={handleAvailabilityChange}
            />
            Solo disponibles
          </label>
        </div>

        <div className="filter-row">
          <label>
            Precio minimo ({currency})
            <input
              type="number"
              min="0"
              placeholder={`${currencySymbol} 0`}
              value={filters.minPrice}
              onChange={(event) => updateFilters({ minPrice: event.target.value })}
            />
          </label>
          <label>
            Precio maximo ({currency})
            <input
              type="number"
              min="0"
              placeholder={`${currencySymbol} 0`}
              value={filters.maxPrice}
              onChange={(event) => updateFilters({ maxPrice: event.target.value })}
            />
          </label>
        </div>

        {visibleTags.length > 0 && (
          <div className="tag-filter">
            <span className="tag-filter-title">Etiquetas destacadas</span>
            <div className="tag-filter-list">
              {visibleTags.map((tag) => {
                const isActive = filters.tags.some(
                  (item) => item.toLowerCase() === tag.toLowerCase()
                );
                return (
                  <button
                    type="button"
                    key={tag}
                    className={`tag-chip${isActive ? " tag-chip--active" : ""}`}
                    onClick={() => toggleTagFilter(tag)}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </form>

      {hasActiveFilters && (
        <div className="active-filters">
          <div className="active-filters-list">
            {activeFilterChips.map((item) => (
              <span key={item} className="active-filter-chip">
                {item}
              </span>
            ))}
          </div>
          <button type="button" className="reset-filters" onClick={resetFilters}>
            Limpiar filtros
          </button>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="products-empty">
          No encontramos productos con esos filtros. Ajusta la busqueda o reinicia los filtros.
        </p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
