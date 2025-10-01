import { useContext, useMemo, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { ProductContext } from "../context/ProductContext";
import "./AdminDashboard.css";

const emptyProduct = {
  nombre: "",
  precio: "",
  stock: "",
  imagen: "",
};

const ORDER_STATUSES = ["pendiente", "preparando", "enviado", "entregado"];
const ORDERS_PER_PAGE = 8;
const STOCK_LOW_THRESHOLD = 5;
const STOCK_LOG_KEY = "stockChangesLog";

function AdminDashboard() {
  const { isAdmin, user } = useContext(AuthContext);
  const { products, addProduct, updateProduct, removeProduct, setStock } =
    useContext(ProductContext);

  const [productForm, setProductForm] = useState(emptyProduct);
  const [editingId, setEditingId] = useState(null);
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders")) || [];
    } catch (error) {
      console.warn("No se pudieron leer las ordenes", error);
      return [];
    }
  });
  const [stockFilter, setStockFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderPage, setOrderPage] = useState(1);
  const [inventoryFeedback, setInventoryFeedback] = useState("");
  const [showImport, setShowImport] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [stockChanges, setStockChanges] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STOCK_LOG_KEY) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STOCK_LOG_KEY, JSON.stringify(stockChanges));
  }, [stockChanges]);

  useEffect(() => {
    if (!inventoryFeedback) return;
    const timer = setTimeout(() => setInventoryFeedback(""), 4000);
    return () => clearTimeout(timer);
  }, [inventoryFeedback]);

  const totalVentas = useMemo(
    () => orders.reduce((acc, order) => acc + (order.total || 0), 0),
    [orders]
  );

  const totalProductos = useMemo(
    () => products.reduce((acc, product) => acc + Number(product.stock || 0), 0),
    [products]
  );

  const lowStockProducts = useMemo(
    () =>
      products.filter((product) => {
        const value = Number(product.stock || 0);
        return value <= STOCK_LOW_THRESHOLD;
      }),
    [products]
  );

  const outOfStockCount = useMemo(
    () => lowStockProducts.filter((product) => Number(product.stock || 0) === 0).length,
    [lowStockProducts]
  );

  const filteredProducts = useMemo(() => {
    if (stockFilter === "low") {
      return products.filter((product) => {
        const value = Number(product.stock || 0);
        return value > 0 && value <= STOCK_LOW_THRESHOLD;
      });
    }
    if (stockFilter === "out") {
      return products.filter((product) => Number(product.stock || 0) === 0);
    }
    return products;
  }, [products, stockFilter]);

  const filteredOrders = useMemo(() => {
    const term = orderSearch.trim().toLowerCase();
    return orders.filter((order) => {
      const currentStatus = order.status || "pendiente";
      const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;
      const matchesTerm =
        term.length === 0 ||
        order.id.toLowerCase().includes(term) ||
        (order.userEmail || "").toLowerCase().includes(term);
      return matchesStatus && matchesTerm;
    });
  }, [orders, statusFilter, orderSearch]);

  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));

  useEffect(() => {
    setOrderPage(1);
  }, [statusFilter, orderSearch]);

  useEffect(() => {
    setOrderPage((page) => Math.min(page, totalOrderPages));
  }, [totalOrderPages]);

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ORDERS_PER_PAGE;
    return filteredOrders.slice(start, start + ORDERS_PER_PAGE);
  }, [filteredOrders, orderPage]);

  const handleProductSubmit = (event) => {
    event.preventDefault();
    if (!productForm.nombre || !productForm.precio || !productForm.stock) return;

    const payload = {
      nombre: productForm.nombre,
      precio: Number(productForm.precio),
      stock: Number(productForm.stock),
      imagen: productForm.imagen,
    };

    if (editingId) {
      updateProduct(editingId, payload);
      setInventoryFeedback(`Producto ${productForm.nombre} actualizado.`);
    } else {
      addProduct(payload);
      setInventoryFeedback(`Producto ${productForm.nombre} agregado.`);
    }

    setProductForm(emptyProduct);
    setEditingId(null);
  };

  const startEdit = (product) => {
    setProductForm({
      nombre: product.nombre,
      precio: product.precio,
      stock: product.stock,
      imagen: product.imagen,
    });
    setEditingId(product.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setProductForm(emptyProduct);
  };

  const handleDelete = (id) => {
    if (window.confirm("Eliminar este producto?")) {
      removeProduct(id);
      setInventoryFeedback("Producto eliminado.");
    }
  };

  const handleStockUpdate = (id, value) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    const nextStock = Number(value);
    if (!Number.isFinite(nextStock) || nextStock < 0) {
      setInventoryFeedback("Ingresa un stock valido (>= 0).");
      return;
    }
    const previousStock = Number(product.stock || 0);
    if (nextStock === previousStock) return;
    const confirmed = window.confirm(
      `Actualizar stock de ${product.nombre} de ${previousStock} a ${nextStock}?`
    );
    if (!confirmed) {
      setInventoryFeedback("Actualizacion cancelada.");
      return;
    }
    setStock(id, nextStock);
    setStockChanges((prev) => [
      {
        id,
        nombre: product.nombre,
        oldStock: previousStock,
        newStock: nextStock,
        date: new Date().toISOString(),
        actor: user?.email || "admin",
      },
      ...prev,
    ].slice(0, 50));
    setInventoryFeedback(`Stock de ${product.nombre} actualizado (${previousStock} ? ${nextStock}).`);
  };

  const handleStatusChange = (orderId, status) => {
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      );
      localStorage.setItem("orders", JSON.stringify(updated));
      return updated;
    });
  };

  const refreshOrders = () => {
    try {
      const latest = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(latest);
      setInventoryFeedback("Pedidos refrescados.");
    } catch (error) {
      console.warn("No se pudieron leer las ordenes", error);
    }
  };

  const handleImportSubmit = () => {
    const rawInput = bulkInput.trim();
    if (!rawInput) {
      setInventoryFeedback("Ingresa datos para importar.");
      return;
    }

    let entries = [];
    try {
      if (rawInput.startsWith("{") || rawInput.startsWith("[")) {
        const parsed = JSON.parse(rawInput);
        entries = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        entries = rawInput
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => {
            const [nombre = "", precio = "", stock = "", imagen = ""] = line
              .split(",")
              .map((part) => part.trim());
            return { nombre, precio, stock, imagen };
          });
      }
    } catch (error) {
      setInventoryFeedback("Error al procesar datos: " + error.message);
      return;
    }

    let imported = 0;
    const errors = [];

    entries.forEach((entry, index) => {
      const nombre = (entry.nombre || entry.name || "").trim();
      const precioValue = Number(entry.precio ?? entry.price);
      const stockValue = Number(entry.stock ?? entry.quantity ?? entry.qty);
      const imagen = (entry.imagen || entry.image || entry.url || "").trim();

      if (!nombre || Number.isNaN(precioValue) || Number.isNaN(stockValue)) {
        errors.push(index + 1);
        return;
      }

      addProduct({
        nombre,
        precio: precioValue,
        stock: stockValue,
        imagen,
      });
      imported += 1;
    });

    if (imported) {
      const errorMessage = errors.length ? ` Se omitieron entradas: ${errors.join(", ")}.` : "";
      setInventoryFeedback(`Importados ${imported} productos.${errorMessage}`);
      setBulkInput("");
      setShowImport(false);
    } else {
      setInventoryFeedback("No se importaron productos validos.");
    }
  };

  const clearStockLog = () => {
    if (!stockChanges.length) return;
    if (window.confirm("¿Limpiar historial de cambios de stock?")) {
      setStockChanges([]);
      localStorage.removeItem(STOCK_LOG_KEY);
      setInventoryFeedback("Historial de stock limpiado.");
    }
  };

  if (!isAdmin) {
    return (
      <div className="admin-locked">
        <h2>Zona restringida</h2>
        <p>Debes iniciar sesion como administrador para acceder a este panel.</p>
        <p>
          Usa las credenciales <code>admin@unishop.com</code> / <code>admin123</code> en el
          formulario de login.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div>
          <h2>Panel de administrador</h2>
          <p>Bienvenido, {user?.displayName || user?.email}</p>
        </div>
        <div className="admin-metrics">
          <div className="metric">
            <span>Total de productos</span>
            <strong>{products.length}</strong>
          </div>
          <div className="metric">
            <span>Stock acumulado</span>
            <strong>{totalProductos}</strong>
          </div>
          <div className="metric">
            <span>Ventas registradas</span>
            <strong>S/ {totalVentas.toFixed(2)}</strong>
          </div>
        </div>
      </header>

      <section className="admin-section">
        <div className="section-header">
          <h3>{editingId ? "Editar producto" : "Agregar producto"}</h3>
          {editingId && (
            <button className="link-button" onClick={cancelEdit}>
              Cancelar edicion
            </button>
          )}
        </div>
        <form className="product-form" onSubmit={handleProductSubmit}>
          <label>
            Nombre
            <input
              type="text"
              value={productForm.nombre}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, nombre: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Precio (S/)
            <input
              type="number"
              step="0.01"
              value={productForm.precio}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, precio: e.target.value }))
              }
              required
            />
          </label>
          <label>
            Stock
            <input
              type="number"
              min="0"
              value={productForm.stock}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, stock: e.target.value }))
              }
              required
            />
          </label>
          <label>
            URL de imagen
            <input
              type="url"
              value={productForm.imagen}
              onChange={(e) =>
                setProductForm((prev) => ({ ...prev, imagen: e.target.value }))
              }
              placeholder="https://..."
            />
          </label>
          <button type="submit">
            {editingId ? "Guardar cambios" : "Agregar producto"}
          </button>
        </form>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h3>Inventario</h3>
          <div className="inventory-toolbar">
            <label>
              Disponibilidad
              <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                <option value="all">Todos</option>
                <option value="low">Stock bajo (&lt;=5)</option>
                <option value="out">Sin stock</option>
              </select>
            </label>
            <button
              type="button"
              className="link-button"
              onClick={() => setShowImport((value) => !value)}
            >
              {showImport ? "Cerrar importacion" : "Importar CSV/JSON"}
            </button>
          </div>
        </div>
        {inventoryFeedback && <p className="inventory-feedback">{inventoryFeedback}</p>}
        {lowStockProducts.length > 0 && (
          <div className="inventory-alert">
            Hay {lowStockProducts.length} productos con stock critico ({outOfStockCount} sin stock, {lowStockProducts.length - outOfStockCount} {'<='} {STOCK_LOW_THRESHOLD}).
          </div>
        )}
        {showImport && (
          <div className="inventory-import">
            <textarea
              rows={6}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="Pega aqui un JSON (lista de objetos) o lineas CSV: nombre,precio,stock,imagen"
            />
            <div className="import-actions">
              <button type="button" onClick={handleImportSubmit}>
                Cargar productos
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setBulkInput("");
                  setShowImport(false);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
        {products.length === 0 ? (
          <p>No hay productos registrados.</p>
        ) : filteredProducts.length === 0 ? (
          <p>No hay productos que coincidan con el filtro.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const numericStock = Number(product.stock || 0);
                  const rowClass =
                    numericStock === 0
                      ? "stock-out-row"
                      : numericStock <= STOCK_LOW_THRESHOLD
                      ? "stock-low-row"
                      : "";
                  return (
                    <tr key={product.id} className={rowClass}>
                      <td>{product.id}</td>
                      <td className="product-cell">
                        <img src={product.imagen} alt={product.nombre} />
                        <span>{product.nombre}</span>
                      </td>
                      <td>S/ {Number(product.precio).toFixed(2)}</td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                        />
                      </td>
                      <td className="actions">
                        <button onClick={() => startEdit(product)}>Editar</button>
                        <button className="danger" onClick={() => handleDelete(product.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h3>Registro de cambios de stock</h3>
          {stockChanges.length > 0 && (
            <button className="link-button" onClick={clearStockLog}>
              Limpiar historial
            </button>
          )}
        </div>
        {stockChanges.length === 0 ? (
          <p>No hay movimientos registrados.</p>
        ) : (
          <ul className="stock-log-list">
            {stockChanges.slice(0, 20).map((entry) => (
              <li key={entry.date + entry.id}>
                <div className="stock-log-meta">
                  <span>{new Date(entry.date).toLocaleString()}</span>
                  <span>{entry.actor}</span>
                </div>
                <p>
                  {entry.nombre}: {entry.oldStock} ? {entry.newStock}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h3>Pedidos</h3>
          <div className="orders-toolbar">
            <div className="filter-group">
              <label>
                Estado
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Todos</option>
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Buscar
                <input
                  type="text"
                  placeholder="ID o correo"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                />
              </label>
            </div>
            <button className="link-button" onClick={refreshOrders}>
              Actualizar pedidos
            </button>
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <p>No hay pedidos registrados que coincidan con el filtro.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.userEmail}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>S/ {Number(order.total || 0).toFixed(2)}</td>
                    <td>
                      <select
                        value={order.status || "pendiente"}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <details>
                        <summary>Ver productos</summary>
                        <ul>
                          {order.items.map((item) => (
                            <li key={item.id}>
                              {item.nombre} x {item.cantidad} - S/ {(item.precio * item.cantidad).toFixed(2)}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalOrderPages > 1 && (
              <div className="orders-pagination">
                <button
                  type="button"
                  onClick={() => setOrderPage((page) => Math.max(1, page - 1))}
                  disabled={orderPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Pagina {orderPage} de {totalOrderPages}
                </span>
                <button
                  type="button"
                  onClick={() => setOrderPage((page) => Math.min(totalOrderPages, page + 1))}
                  disabled={orderPage === totalOrderPages}
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
