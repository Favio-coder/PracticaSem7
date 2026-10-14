import { Profiler, useState, useMemo, useCallback, useReducer } from "react";
import { ThemeProvider, useTheme } from "./context";
import { SearchInput } from "./components/SearchInput";
import { ProductList } from "./components/ProductList";
import { ProductDetail } from "./components/ProductDetail";
import { ThemeToggle } from "./components/ThemeToggle";
import { CodeViewer } from "./components/CodeViewer";
import { performanceProducts } from "./data/performanceProducts.js";
import { useFetch } from "./hooks/useFetch.js";
import { FAVORITE_ACTIONS, favoritesReducer } from "./reducers/favoritesReducer.js";
import "./App.css";

const API_URL = "https://dummyjson.com/products?limit=20";
const EMPTY_FAVORITES = [];

function calculateVisibleProducts(products, searchTerm, sortOrder) {
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
  const filtered = products.filter((product) =>
    (product.title || product.name || "").toLocaleLowerCase().includes(normalizedSearch)
  );

  return filtered.sort((first, second) => {
    if (sortOrder === "name") {
      return (first.title || first.name || "").localeCompare(second.title || second.name || "");
    }
    return sortOrder === "price-desc"
      ? second.price - first.price
      : first.price - second.price;
  });
}

function AppContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("price-asc");
  const [favoriteImplementation, setFavoriteImplementation] = useState("reducer");
  const [calculationMode, setCalculationMode] = useState("memo");
  const [usePerformanceData, setUsePerformanceData] = useState(false);
  const [profileEnabled, setProfileEnabled] = useState(false);
  const [showDetail, setShowDetail] = useState(true);
  const [independentCount, setIndependentCount] = useState(0);
  const [showCodeViewer, setShowCodeViewer] = useState(true);
  const [stateFavorites, setStateFavorites] = useState(EMPTY_FAVORITES);
  const [reducerFavorites, dispatchFavorite] = useReducer(favoritesReducer, EMPTY_FAVORITES);
  const { data, loading, error } = useFetch(API_URL);

  const apiProducts = data?.products ?? [];
  const products = usePerformanceData ? performanceProducts : apiProducts;

  const memoizedProducts = useMemo(
    () => calculationMode === "memo"
      ? calculateVisibleProducts(products, searchTerm, sortOrder)
      : null,
    [calculationMode, products, searchTerm, sortOrder],
  );

  const visibleProducts = calculationMode === "memo"
    ? memoizedProducts
    : calculateVisibleProducts(products, searchTerm, sortOrder);

  const displayedFavorites = favoriteImplementation === "reducer"
    ? reducerFavorites
    : stateFavorites;

  const favoriteIds = useMemo(
    () => new Set(displayedFavorites.map((product) => product.id)),
    [displayedFavorites],
  );

  const addFavorite = useCallback((product) => {
    setStateFavorites((previous) => previous.some((item) => item.id === product.id)
      ? previous
      : [...previous, product]);
    dispatchFavorite({ type: FAVORITE_ACTIONS.ADD, product });
  }, []);

  const removeFavorite = useCallback((id) => {
    setStateFavorites((previous) => previous.some((item) => item.id === id)
      ? previous.filter((item) => item.id !== id)
      : previous);
    dispatchFavorite({ type: FAVORITE_ACTIONS.REMOVE, id });
  }, []);

  const clearFavorites = useCallback(() => {
    setStateFavorites((previous) => previous.length === 0 ? previous : []);
    dispatchFavorite({ type: FAVORITE_ACTIONS.CLEAR });
  }, []);

  const handleProductListProfile = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      if (profileEnabled) {
        console.info("[React Profiler]", {
          id,
          phase,
          actualDuration: `${actualDuration.toFixed(2)} ms`,
          baseDuration: `${baseDuration.toFixed(2)} ms`,
          startTime: `${startTime.toFixed(2)} ms`,
          commitTime: `${commitTime.toFixed(2)} ms`,
        });
      }
    },
    [profileEnabled],
  );

  return (
    <div className={`app-layout ${showCodeViewer ? "" : "sidebar-hidden"}`}>
      <aside className="app-sidebar" aria-label="Panel lateral de código">
        {showCodeViewer && <CodeViewer onClose={() => setShowCodeViewer(false)} />}
      </aside>

      <main className="app-main" role="main">
        <header className="app-header">
          <div className="header-brand">
            <p className="eyebrow">Catálogo interactivo</p>
            <h1>Explorador de Productos</h1>
          </div>
          <div className="header-actions">
            <ThemeToggle />
            <button
              className="counter-btn"
              onClick={() => setIndependentCount((count) => count + 1)}
              aria-label="Incrementar contador independiente"
            >
              Contador UI: {independentCount}
            </button>
            <span className="favorites-count" aria-live="polite">
              Favoritos: {displayedFavorites.length}
            </span>
            <button
              className="sidebar-toggle"
              onClick={() => setShowCodeViewer((v) => !v)}
              aria-label={showCodeViewer ? "Ocultar panel de código" : "Mostrar panel de código"}
              aria-expanded={showCodeViewer}
            >
              {showCodeViewer ? "⟨ Código" : "Código ⟩"}
            </button>
          </div>
        </header>

        <section className="practice-panel" aria-labelledby="favorites-practice-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fase 4 · Transiciones de estado</p>
              <h2 id="favorites-practice-title">Práctica de favoritos</h2>
            </div>
            <label className="control-label">
              Implementación visible
              <select
                value={favoriteImplementation}
                onChange={(event) => setFavoriteImplementation(event.target.value)}
              >
                <option value="reducer">useReducer (recomendada)</option>
                <option value="state">useState (alternativa)</option>
              </select>
            </label>
          </div>
          <p className="panel-copy">
            Ambas versiones reciben las mismas acciones para poder compararlas. La lista visible usa{" "}
            <strong>{favoriteImplementation === "reducer" ? "useReducer" : "useState"}</strong>.
            Pulsa el corazón para añadir o quitar un producto.
          </p>
          <div className="favorites-section">
            <div className="section-heading compact-heading">
              <h3>Mis favoritos ({displayedFavorites.length})</h3>
              <button
                type="button"
                className="secondary-btn"
                onClick={clearFavorites}
                disabled={displayedFavorites.length === 0}
              >
                Vaciar favoritos
              </button>
            </div>
            {displayedFavorites.length === 0
              ? <p className="empty-inline">Aún no has guardado productos.</p>
              : (
                <ul className="favorite-list">
                  {displayedFavorites.map((product) => (
                    <li key={product.id}>
                      <span>{product.title || product.name}</span>
                      <button
                        type="button"
                        className="remove-favorite-btn"
                        onClick={() => removeFavorite(product.id)}
                        aria-label={`Quitar ${product.title || product.name} de favoritos`}
                      >
                        Quitar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
          </div>
        </section>

        <section className="catalog-section" aria-labelledby="catalog-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Fase 5 · Referencias y rendimiento</p>
              <h2 id="catalog-title">Productos</h2>
            </div>
            <div className="catalog-controls">
              <label className="control-label">
                Datos
                <select
                  value={usePerformanceData ? "performance" : "api"}
                  onChange={(event) => setUsePerformanceData(event.target.value === "performance")}
                >
                  <option value="api">Catálogo real (API)</option>
                  <option value="performance">Prueba local (1,000 items)</option>
                </select>
              </label>
              <label className="control-label">
                Cálculo
                <select
                  value={calculationMode}
                  onChange={(event) => setCalculationMode(event.target.value)}
                >
                  <option value="memo">useMemo (memoizado)</option>
                  <option value="direct">Directo (nueva referencia)</option>
                </select>
              </label>
              <label className="control-label">
                Orden
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                >
                  <option value="price-asc">Precio: menor a mayor</option>
                  <option value="price-desc">Precio: mayor a menor</option>
                  <option value="name">Nombre: A-Z</option>
                </select>
              </label>
            </div>
          </div>

          <div className="search-row">
            <SearchInput value={searchTerm} onChange={setSearchTerm} />
            <span className="result-count" aria-live="polite">
              {visibleProducts.length} resultados
            </span>
          </div>

          <div className="profiler-controls">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={profileEnabled}
                onChange={(event) => setProfileEnabled(event.target.checked)}
              />
              Registrar commits de la lista en la consola
            </label>
            <span>La medición no añade demoras artificiales.</span>
          </div>

          {loading && !usePerformanceData && <p className="loading-state">Cargando productos...</p>}
          {error && !usePerformanceData && <p className="error-state" role="alert">Error: {error}</p>}
          {(!loading || usePerformanceData) && (data || usePerformanceData) && (
            <Profiler id="product-list" onRender={handleProductListProfile}>
              <ProductList
                products={visibleProducts}
                favoriteIds={favoriteIds}
                onAddFavorite={addFavorite}
                onRemoveFavorite={removeFavorite}
              />
            </Profiler>
          )}
        </section>

        <div className="section-heading detail-toggle-row">
          <div>
            <p className="eyebrow">Fase 6 · Consulta reutilizable</p>
            <h2>Hook useFetch(url)</h2>
          </div>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setShowDetail((visible) => !visible)}
          >
            {showDetail ? "Desmontar consulta" : "Montar consulta"}
          </button>
        </div>
        {showDetail && <ProductDetail />}
        <p className="learning-note">
          Cambiar <code>ref.current</code> no programa un render. Usa estado para la interfaz
          y refs para acciones imperativas como enfocar este buscador.
        </p>
        <span className="sr-only" aria-live="polite">
          Contador independiente: {independentCount}
        </span>
      </main>
    </div>
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