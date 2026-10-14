export function ProductCard({ product, isFavorite, onToggleFavorite }) {
  const imageUrl = product.thumbnail || product.image;
  const productName = product.title || product.name;

  return (
    <article className="product-card">
      <img
        src={imageUrl}
        alt={productName}
        className="product-image"
        loading="lazy"
      />
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{productName}</h3>
        <p className="product-price">${product.price}</p>
      </div>
      <button
        className={`favorite-btn ${isFavorite ? "active" : ""}`}
        onClick={() => onToggleFavorite(product.id)}
        aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        aria-pressed={isFavorite}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </article>
  );
}