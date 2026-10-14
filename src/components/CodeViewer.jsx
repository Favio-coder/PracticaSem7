import { useState } from "react";
import PHASE_CODE from "../data/phaseCode";

const PHASES = [
  { id: "fase1", label: "Fase 1", desc: "useState, Props, Re-renders" },
  { id: "fase2", label: "Fase 2", desc: "useEffect, Fetch API" },
  { id: "fase3", label: "Fase 3", desc: "ThemeContext, useContext" },
  { id: "fase4", label: "Fase 4", desc: "useReducer, localStorage" },
  { id: "fase5", label: "Fase 5", desc: "useMemo, useCallback, memo" },
  { id: "fase6", label: "Fase 6", desc: "useFetch Hook personalizado" },
];

export function CodeViewer({ onClose }) {
  const [activePhase, setActivePhase] = useState("fase1");
  const [activeFile, setActiveFile] = useState(null);

  const phaseData = PHASE_CODE[activePhase];
  const fileNames = phaseData ? Object.keys(phaseData.files) : [];
  const selectedFile = activeFile && phaseData.files[activeFile] ? activeFile : (fileNames[0] || null);

  if (!phaseData) return null;

  return (
    <section className="code-viewer" aria-label="Código por fases">
      <header className="code-viewer-header">
        <div>
          <p className="code-viewer-kicker">Explora la implementación</p>
          <h2 className="code-viewer-title">Código por fases</h2>
        </div>
        <button
          type="button"
          className="code-viewer-toggle"
          onClick={onClose}
          aria-label="Cerrar panel de código"
        >
          ✕
        </button>
      </header>

      <nav className="phase-tabs" role="tablist" aria-label="Fases de la práctica">
        {PHASES.map((phase) => (
          <button
            key={phase.id}
            role="tab"
            aria-selected={activePhase === phase.id}
            aria-controls={`panel-${phase.id}`}
            id={`tab-${phase.id}`}
            className={`phase-tab ${activePhase === phase.id ? "active" : ""}`}
            onClick={() => { setActivePhase(phase.id); setActiveFile(null); }}
          >
            <span className="phase-tab-label">{phase.label}</span>
            <span className="phase-tab-desc">{phase.desc}</span>
          </button>
        ))}
      </nav>

      <div className="code-viewer-content" role="tabpanel" id={`panel-${activePhase}`} aria-labelledby={`tab-${activePhase}`}>
        <p className="code-phase-title">{phaseData.title}</p>
        <div className="file-tabs" role="tablist" aria-label="Archivos de la fase">
          {fileNames.map((fileName) => (
            <button
              key={fileName}
              role="tab"
              aria-selected={selectedFile === fileName}
              aria-controls={`file-${fileName.replace(/[^a-z0-9]/gi, "-")}`}
              id={`file-tab-${fileName.replace(/[^a-z0-9]/gi, "-")}`}
              className={`file-tab ${selectedFile === fileName ? "active" : ""}`}
              onClick={() => setActiveFile(fileName)}
              title={fileName}
            >
              {fileName.split("/").pop()}
            </button>
          ))}
        </div>

        {selectedFile && (
          <pre className="code-block" role="tabpanel" id={`file-${selectedFile.replace(/[^a-z0-9]/gi, "-")}`} aria-labelledby={`file-tab-${selectedFile.replace(/[^a-z0-9]/gi, "-")}`}>
            <code>{phaseData.files[selectedFile]}</code>
          </pre>
        )}
      </div>

      <footer className="code-viewer-footer">
        <span className="code-viewer-hint">Click en una fase → Selecciona archivo</span>
      </footer>
    </section>
  );
}