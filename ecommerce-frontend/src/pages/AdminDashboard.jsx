import { useContext, useMemo, useState } from "react";
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

  const totalVentas = useMemo(
    () => orders.reduce((acc, order) => acc + (order.total || 0), 0),
    [orders]
  );

  const totalProductos = useMemo(
    () => products.reduce((acc, p) => acc + Number(p.stock || 0), 0),
    [products]
  );

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!productForm.nombre || !productForm.precio || !productForm.stock) return;

    const payload = {
      nombre: productForm.nombre,
      precio: Number(productForm.precio),
      stock: Number(productForm.stock),
      imagen: productForm.imagen,
    };

    if (editingId) {
      updateProduct(editingId, payload);
    } else {
      addProduct(payload);
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
    }
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

  const handleStockUpdate = (id, stock) => {
    setStock(id, stock);
  };

  const refreshOrders = () => {
    try {
      const latest = JSON.parse(localStorage.getItem("orders")) || [];
      setOrders(latest);
    } catch (error) {
      console.warn("No se pudieron leer las ordenes", error);
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
          <p>Bienvenido, {user?.name || user?.email}</p>
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
        <h3>Inventario</h3>
        {products.length === 0 ? (
          <p>No hay productos registrados.</p>
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
                {products.map((product) => (
                  <tr key={product.id}>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h3>Pedidos</h3>
          <button className="link-button" onClick={refreshOrders}>
            Actualizar pedidos
          </button>
        </div>
        {orders.length === 0 ? (
          <p>No hay pedidos registrados todavia.</p>
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
                {orders
                  .slice()
                  .reverse()
                  .map((order) => (
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
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;

