const PHASE_CODE = {
  fase1: {
    title: "Fase 1: useState, Props y Re-renders",
    files: {
      "src/App.jsx": `import { useState } from "react";
import { products } from "./data/products";
import { SearchInput } from "./components/SearchInput";
import { ProductList } from "./components/ProductList";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [independentCount, setIndependentCount] = useState(0);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Explorador de Productos</h1>
        <div className="header-actions">
          <button onClick={() => setIndependentCount(c => c + 1)}>
            Contador UI: {independentCount}
          </button>
          <span>Favoritos: {favorites.size}</span>
        </div>
      </header>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <ProductList products={filteredProducts} favorites={favorites} onToggleFavorite={toggleFavorite} />
    </main>
  );
}`,
      "src/components/SearchInput.jsx": `export function SearchInput({ value, onChange, placeholder = "Buscar productos..." }) {
  return (
    <label className="search-label">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="search"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar productos"
      />
      {value && (
        <button type="button" className="search-clear" onClick={() => onChange("")} aria-label="Limpiar búsqueda">
          ✕
        </button>
      )}
    </label>
  );
}`,
      "src/components/ProductList.jsx": `import { ProductCard } from "./ProductCard";

export function ProductList({ products, favorites, onToggleFavorite }) {
  if (products.length === 0) return <p className="empty-state">No se encontraron productos</p>;

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
}`,
      "src/components/ProductCard.jsx": `export function ProductCard({ product, isFavorite, onToggleFavorite }) {
  return (
    <article className="product-card">
      <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
      <div className="product-info">
        <span className="product-category">{product.category}</span>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">\${product.price}</p>
      </div>
      <button className={\`favorite-btn \${isFavorite ? "active" : ""}\`} onClick={() => onToggleFavorite(product.id)} aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"} aria-pressed={isFavorite}>
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </article>
  );
}`,
    },
  },
  fase2: {
    title: "Fase 2: useEffect y Fetch de API",
    files: {
      "src/App.jsx (useEffect)": `import { useState, useEffect } from "react";

const API_URL = "https://dummyjson.com/products?limit=20";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancelled = false;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(API_URL, { signal });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const data = await response.json();
        if (!cancelled && !signal.aborted) setProducts(data.products || []);
      } catch (err) {
        if (err.name === "AbortError" || signal.aborted || cancelled) return;
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled && !signal.aborted) setLoading(false);
      }
    }

    fetchProducts();
    return () => { cancelled = true; controller.abort(); };
  }, []);

  // ... resto del componente
}`,
    },
  },
  fase3: {
    title: "Fase 3: ThemeContext (useContext)",
    files: {
      "src/context/ThemeContext.js": `import { createContext } from "react";
export const ThemeContext = createContext(null);`,
      "src/context/ThemeContext.jsx": `import { useState, useMemo, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "light" ? "dark" : "light");
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}`,
      "src/context/useTheme.js": `import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
}`,
      "src/components/ThemeToggle.jsx": `import { useTheme } from "../context/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label={\`Cambiar a tema \${theme === "light" ? "oscuro" : "claro"}\`}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}`,
    },
  },
  fase4: {
    title: "Fase 4: Favoritos con useReducer + localStorage",
    files: {
      "src/reducers/favoritesReducer.js": `export const FAVORITE_ACTIONS = { ADD: "ADD", REMOVE: "REMOVE", CLEAR: "CLEAR" };

export function favoritesReducer(state, action) {
  switch (action.type) {
    case FAVORITE_ACTIONS.ADD:
      return state.some(p => p.id === action.product.id) ? state : [...state, action.product];
    case FAVORITE_ACTIONS.REMOVE:
      return state.filter(p => p.id !== action.id);
    case FAVORITE_ACTIONS.CLEAR:
      return [];
    default:
      return state;
  }
}`,
      "src/hooks/useFavorites.js": `import { useReducer, useEffect } from "react";
import { favoritesReducer, FAVORITE_ACTIONS } from "../reducers/favoritesReducer";

const STORAGE_KEY = "app_favorites";

export function useFavorites() {
  const [favorites, dispatch] = useReducer(favoritesReducer, [], () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const add = (product) => dispatch({ type: FAVORITE_ACTIONS.ADD, product });
  const remove = (id) => dispatch({ type: FAVORITE_ACTIONS.REMOVE, id });
  const clear = () => dispatch({ type: FAVORITE_ACTIONS.CLEAR });

  return { favorites, add, remove, clear };
}`,
    },
  },
  fase5: {
    title: "Fase 5: useMemo, useCallback, React.memo, Profiler",
    files: {
      "src/App.jsx (optimizaciones)": `const memoizedProducts = useMemo(
  () => calculateVisibleProducts(products, searchTerm, sortOrder),
  [products, searchTerm, sortOrder]
);

const addFavorite = useCallback((product) => {
  setStateFavorites(prev => prev.some(p => p.id === product.id) ? prev : [...prev, product]);
  dispatchFavorite({ type: FAVORITE_ACTIONS.ADD, product });
}, []);

const removeFavorite = useCallback((id) => {
  setStateFavorites(prev => prev.filter(p => p.id !== id));
  dispatchFavorite({ type: FAVORITE_ACTIONS.REMOVE, id });
}, []);

<Profiler id="product-list" onRender={handleProductListProfile}>
  <ProductList products={memoizedProducts} favoriteIds={favoriteIds} onAddFavorite={addFavorite} onRemoveFavorite={removeFavorite} />
</Profiler>`,
      "src/components/ProductCard.jsx": `import { memo } from "react";

function ProductCard({ product, isFavorite, onAddFavorite, onRemoveFavorite }) {
  // ... JSX del componente
}

export const MemoizedProductCard = memo(ProductCard);`,
    },
  },
  fase6: {
    title: "Fase 6: Hook useFetch reutilizable",
    files: {
      "src/hooks/useFetch.js": `import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(url, { signal });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const json = await response.json();
        if (!cancelled && !signal.aborted) setData(json);
      } catch (err) {
        if (err.name === "AbortError" || signal.aborted || cancelled) return;
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled && !signal.aborted) setLoading(false);
      }
    }

    if (url) fetchData();
    return () => { cancelled = true; controller.abort(); };
  }, [url]);

  return { data, loading, error };
}`,
      "src/components/ProductDetail.jsx": `import { useFetch } from "../hooks/useFetch";

export function ProductDetail() {
  const [selectedId, setSelectedId] = useState(null);
  const { data, loading, error } = useFetch(selectedId ? \`https://dummyjson.com/products/\${selectedId}\` : null);

  if (!selectedId) return <p className="product-placeholder">Selecciona un producto para ver detalles</p>;
  if (loading) return <p className="loading-state">Cargando detalle...</p>;
  if (error) return <p className="error-state">Error: {error}</p>;

  const p = data;
  return (
    <div className="detail-content">
      <img src={p.thumbnail} alt={p.title} className="detail-image" />
      <div>
        <h3>{p.title}</h3>
        <p>{p.description}</p>
        <p className="product-price">\${p.price}</p>
        <p>Stock: {p.stock} | Categoría: {p.category}</p>
      </div>
    </div>
  );
}`,
    },
  },
};

export default PHASE_CODE;