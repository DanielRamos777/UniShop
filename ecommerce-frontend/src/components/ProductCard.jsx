import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { WishlistContext } from "../context/WishlistContext";
import { CurrencyContext } from "../context/CurrencyContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { isInWishlist, toggleWishlist, canManageWishlist } = useContext(WishlistContext);
  const { formatPrice } = useContext(CurrencyContext);
  const [isOpen, setIsOpen] = useState(false);

  const favorited = isInWishlist(product.id);

  const handleWishlist = () => {
    if (!canManageWishlist) {
      window.alert("Inicia sesion para guardar favoritos.");
      return;
    }
    toggleWishlist(product.id);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  return (
    <>
      <article className="product-card">
        <div className="product-card-header">
          <span className="product-category">{product.categoria}</span>
          <button
            type="button"
            className={`wishlist-button${favorited ? " is-active" : ""}`}
            onClick={handleWishlist}
          >
            {favorited ? "En favoritos" : "Guardar"}
          </button>
        </div>
        <img src={product.imagen} alt={product.nombre} />
        <h3>{product.nombre}</h3>
        {product.descripcion && (
          <p className="product-description">{product.descripcion}</p>
        )}
        <p>Precio: {formatPrice(product.precio)}</p>
        <p className={product.stock > 0 ? "stock-ok" : "stock-out"}>Stock: {product.stock}</p>
        {product.etiquetas?.length > 0 && (
          <div className="product-tags">
            {product.etiquetas.map((tag) => (
              <span key={tag} className="product-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="product-actions">
          <button type="button" className="secondary" onClick={() => setIsOpen(true)}>
            Ver
          </button>
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={() => addToCart(product)}
          >
            {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
          </button>
        </div>
      </article>

      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsOpen(false)} aria-label="Cerrar">
              ×
            </button>
            <div className="modal-body">
              <img src={product.imagen} alt={product.nombre} className="modal-image" />
              <div className="modal-content">
                <h3 className="modal-title">{product.nombre}</h3>
                {product.descripcion && <p className="modal-description">{product.descripcion}</p>}
                <p className="modal-price">Precio: {formatPrice(product.precio)}</p>
                <p className="modal-stock">
                  Stock disponible: <strong>{product.stock}</strong>
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    disabled={product.stock <= 0}
                    onClick={() => {
                      addToCart(product);
                      setIsOpen(false);
                    }}
                  >
                    {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                  </button>
                  <button type="button" className="secondary" onClick={() => setIsOpen(false)}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;

