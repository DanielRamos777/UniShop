import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductList.css";

const productos = [
  { id: 1, nombre: "Laptop Gamer", precio: 3500, imagen: "https://dlcdnwebimgs.asus.com/gain/1387056a-60c6-4579-a3f7-ccf65affd7fa/" },
  { id: 2, nombre: "Auriculares Inalámbricos", precio: 250, imagen: "https://pe.tiendasishop.com/cdn/shop/files/JBLT770NCBLKAM.webp?v=1755186506" },
  { id: 3, nombre: "Smartphone", precio: 2200, imagen: "https://images.philips.com/is/image/philipsconsumer/d0c4e6ec07484c8eb473b1cb006d08d6?$pnglarge$&wid=960" },
  { id: 4, nombre: "Mouse RGB", precio: 120, imagen: "https://promart.vteximg.com.br/arquivos/ids/5813050-1000-1000/image-b16932d868c74242978796ba2205bbcb.jpg?v=637877187998770000" },
  { id: 5, nombre: "Teclado Mecánico", precio: 400, imagen: "https://akl.com.pe/1187-large_default/teclado-mecanico-antryx-xtreme-zigra-blu.jpg" },
];

function ProductList() {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="products">
      <h2>Productos</h2>
      <div className="product-grid">
        {productos.map((p) => (
          <div key={p.id} className="product-card">
            <img src={p.imagen} alt={p.nombre} />
            <h3>{p.nombre}</h3>
            <p>Precio: S/ {p.precio.toFixed(2)}</p>
            <button onClick={() => addToCart(p)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;

