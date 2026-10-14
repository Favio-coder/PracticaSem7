import { ProductCard } from "./ProductCard";

export function ProductList({ products, favorites, onToggleFavorite }) {
  if (products.length === 0) {
    return <p className="empty-state">No se encontraron productos</p>;
  }

  return (
    <ul className="product-grid" role="list">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard
            product={product}
            isFavorite={favorites.has(product.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}