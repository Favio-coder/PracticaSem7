import { useTheme } from "../context/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${theme === "light" ? "oscuro" : "claro"}`}
      title={`Tema actual: ${theme}`}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}