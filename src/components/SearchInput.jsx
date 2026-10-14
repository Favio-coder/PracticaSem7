export function SearchInput({ value, onChange, placeholder = "Buscar productos..." }) {
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
        <button
          type="button"
          className="search-clear"
          onClick={() => onChange("")}
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      )}
    </label>
  );
}