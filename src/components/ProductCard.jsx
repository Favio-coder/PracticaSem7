import { memo } from "react";

function ProductCard({ product, isFavorite, onAddFavorite, onRemoveFavorite }) {
  const imageUrl = product.thumbnail || product.image;
  const productName = product.title || product.name;

  return (
    <article className="product-card">
      {imageUrl
        ? <img src={imageUrl} alt={productName} className="product-image" loading="lazy" />
        : <div className="product-image product-placeholder" aria-hidden="true">Producto</div>}
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{productName}</h3>
        <p className="product-price">${product.price}</p>
      </div>
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={() => isFavorite ? onRemoveFavorite(product.id) : onAddFavorite(product)}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        aria-pressed={isFavorite}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </article>
  );
}

export const MemoizedProductCard = memo(ProductCard);