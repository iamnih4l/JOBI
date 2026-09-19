import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface SystemStatus {
  ollama: {
    connected: boolean;
    url: string;
    models: string[];
  };
  latex: {
    available: boolean;
    version: string | null;
    error: string | null;
  };
  database: {
    ready: boolean;
    type: string;
    error?: string;
  };
}

export default function Setup() {
  const [system, setSystem] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    return localStorage.getItem("jobi_selected_model") || "llama3.1:latest";
  });

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/system/status");
      if (res.ok) {
        const data: SystemStatus = await res.json();
        setSystem(data);
        if (data.ollama.models && data.ollama.models.length > 0) {
          if (!data.ollama.models.includes(selectedModel)) {
            setSelectedModel(data.ollama.models[0]);
            localStorage.setItem("jobi_selected_model", data.ollama.models[0]);
          }
        }
      }
    } catch (e) {
      console.error("Failed fetching system status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    localStorage.setItem("jobi_selected_model", model);
  };

  const isOllamaConnected = system?.ollama.connected ?? false;
  const isLatexAvailable = system?.latex.available ?? false;
  const isDbReady = system?.database.ready ?? false;
  const models = system?.ollama.models || [];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface px-4 py-8">
      <div className="w-full max-w-xl bg-surface-container-lowest tactile-card rounded-3xl p-6 sm:p-8 border border-outline-variant">
        {/* Brand Header */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="/jobi-logo.svg" alt="Jobi" className="w-10 h-10 rounded-xl" />
          <h2 className="text-headline-md font-extrabold text-on-surface tracking-tight">Jobi System Health</h2>
        </div>
        <p className="text-body-md text-on-surface-variant text-center mb-6">
          Jobi runs completely air-gapped on your local hardware. Verify your local environment below.
        </p>

        {/* Status Grid */}
        <div className="flex flex-col gap-3 mb-6">
          {/* 1. Database Status */}
          <div className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-outline-variant/70">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-stone-600 text-xl">database</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Local Database</div>
                <div className="text-sm font-semibold text-on-surface">SQLite Persistence</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isDbReady ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isDbReady ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                {loading ? 'CHECKING...' : (isDbReady ? 'READY' : 'ERROR')}
              </span>
            </div>
          </div>

          {/* 2. Ollama Engine Status */}
          <div className="bg-surface-container rounded-2xl p-4 flex items-center justify-between border border-outline-variant/70">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-xl">memory</span>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-stone-500">Local AI Engine</div>
                <div className="text-sm font-semibold text-on-surface">Ollama Air-Gapped LLM</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isOllamaConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isOllamaConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                {loading ? 'CHECKING...' : (isOllamaConnected ? 'CONNECTED' : 'OFFLINE')}
              </span>
            </div>
          </div>

          {/* 3. Model Selector */}
          {isOllamaConnected ? (
            <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs">
              <label className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                Active Local Model ({models.length} installed)
              </label>
              {models.length > 0 ? (
                <select
                  value={selectedModel}
                  onChange={(e) => handleModelChange(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant text-stone-800 font-mono text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary"
                >
                  {models.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <div className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200">
                  No local models downloaded yet. Run <code className="font-mono font-bold">ollama run llama3.1</code> in your terminal.
                </div>
              )}
            </div>
          ) : (
            <div className="text-xs text-stone-600 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/80">
              <div className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                <span>💡</span> Ollama isn't running
              </div>
              <div>
                Jobi runs 100% of resume parsing, editing, and ATS matching without Ollama. To enable AI adaptations, start Ollama (<a href="https://ollama.ai" target="_blank" rel="noreferrer" className="underline text-primary font-semibold">ollama.ai</a>) and run:
                <div className="font-mono bg-white p-1.5 rounded-lg border border-amber-200 text-stone-800 mt-1.5 font-bold">ollama run llama3.1</div>
              </div>
            </div>
          )}

          {/* 4. LaTeX Compiler Status */}
          <div className="bg-surface-container rounded-2xl p-4 flex flex-col gap-2 border border-outline-variant/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-xl">picture_as_pdf</span>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-stone-500">PDF Compiler</div>
                  <div className="text-sm font-semibold text-on-surface">Local LaTeX Engine (pdflatex)</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isLatexAvailable ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${isLatexAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'}`}>
                  {loading ? 'CHECKING...' : (isLatexAvailable ? 'AVAILABLE' : 'PREVIEW ONLY')}
                </span>
              </div>
            </div>
            {!isLatexAvailable && !loading && (
              <div className="text-[11px] text-stone-500 pt-1 border-t border-outline-variant/40">
                <span>LaTeX not found on PATH. You can still write, edit, and preview resumes. To compile real PDFs locally, install <a href="https://miktex.org" target="_blank" rel="noreferrer" className="underline text-primary">MiKTeX</a> (Windows) or TeX Live.</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex-1 bg-surface-container text-on-surface font-bold text-xs tracking-wide uppercase px-4 py-3 rounded-full text-center hover:bg-surface-container-high transition-colors"
          >
            Home
          </Link>
          <button
            type="button"
            onClick={checkStatus}
            className="h-10 px-4 bg-white border border-stone-200 text-stone-700 rounded-full text-xs font-semibold hover:bg-stone-50 transition-colors flex items-center justify-center"
            title="Refresh Environment Health"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
          </button>
          <Link
            to="/master"
            className="flex-2 bg-primary text-on-primary font-bold text-xs tracking-wide uppercase px-6 py-3 rounded-full tactile-shadow-orange hover:-translate-y-[1px] active:translate-y-0 transition-transform text-center flex items-center justify-center gap-1.5"
          >
            <span>Continue to Master Resume</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
