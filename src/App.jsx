import { useState, useEffect } from "react";
import { ThemeProvider } from "./context";
import { useTheme } from "./context";
import { SearchInput } from "./components/SearchInput";
import { ProductList } from "./components/ProductList";
import { ThemeToggle } from "./components/ThemeToggle";
import "./App.css";

const API_URL = "https://dummyjson.com/products?limit=20";

function AppContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(new Set());
  const [independentCount, setIndependentCount] = useState(0);

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

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!cancelled && !signal.aborted) {
          setProducts(data.products || []);
        }
      } catch (err) {
        if (err.name === "AbortError" || signal.aborted || cancelled) {
          return;
        }
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled && !signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Explorador de Productos</h1>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="counter-btn"
            onClick={() => setIndependentCount((c) => c + 1)}
            aria-label="Incrementar contador independiente"
          >
            Contador UI: {independentCount}
          </button>
          <span className="favorites-count" aria-live="polite">
            Favoritos: {favorites.size}
          </span>
        </div>
      </header>

      <SearchInput value={searchTerm} onChange={setSearchTerm} />

      {loading && <p className="loading-state">Cargando productos...</p>}
      {error && <p className="error-state" role="alert">Error: {error}</p>}
      {!loading && !error && (
        <ProductList
          products={filteredProducts}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      )}
    </main>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}

function ThemedApp() {
  const { theme } = useTheme();

  return (
    <div className={`app-root ${theme}`}>
      <AppContent />
    </div>
  );
}

export default App;