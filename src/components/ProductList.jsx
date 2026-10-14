import { MemoizedProductCard } from "./ProductCard";

export function ProductList({ products, favoriteIds, onAddFavorite, onRemoveFavorite }) {
  if (products.length === 0) {
    return <p className="empty-state">No se encontraron productos</p>;
  }

  return (
    <ul className="product-grid" role="list">
      {products.map((product) => (
        <li key={product.id}>
          <MemoizedProductCard
            product={product}
            isFavorite={favoriteIds.has(product.id)}
            onAddFavorite={onAddFavorite}
            onRemoveFavorite={onRemoveFavorite}
          />
        </li>
      ))}
    </ul>
  );
}