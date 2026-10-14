import { useRef } from "react";

export function SearchInput({ value, onChange, placeholder = "Buscar productos..." }) {
  const inputRef = useRef(null);

  return (
    <div className="search-controls">
      <label className="search-label">
        <span className="search-icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          type="search"
          className="search-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
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
      <button
        type="button"
        className="secondary-btn focus-search-btn"
        onClick={() => inputRef.current?.focus()}
      >
        Enfocar búsqueda
      </button>
    </div>
  );
}