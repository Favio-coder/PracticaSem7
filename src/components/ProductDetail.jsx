import { useState } from "react";
import { useFetch } from "../hooks/useFetch.js";

export function ProductDetail() {
  const [productId, setProductId] = useState("1");
  const { data: product, loading, error } = useFetch(
    `https://dummyjson.com/products/${productId}`,
  );

  return (
    <section className="detail-panel" aria-labelledby="detail-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Segunda consulta independiente</p>
          <h2 id="detail-title">Detalle de producto</h2>
        </div>
        <label className="detail-select-label">
          ID
          <select
            value={productId}
            onChange={(event) => setProductId(event.target.value)}
            aria-label="ID del producto a consultar"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 999].map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </label>
      </div>
      <p className="detail-help">
        Cambia el ID para iniciar otra URL; el ID 999 permite revisar la respuesta HTTP de error.
      </p>

      {loading && <p className="loading-state">Cargando detalle...</p>}
      {error && <p className="error-state" role="alert">Error: {error}</p>}
      {!loading && !error && product && (
        <div className="detail-content">
          {product.thumbnail && (
            <img src={product.thumbnail} alt="" className="detail-image" />
          )}
          <div>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p className="product-price">${product.price}</p>
          </div>
        </div>
      )}
    </section>
  );
}
