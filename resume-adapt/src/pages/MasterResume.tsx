import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { parseLatex } from "../lib/engine";

export default function MasterResume() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("Dr. Ethan Vance — Master Profile");
  const [latexSource, setLatexSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"editor" | "outline">("editor");
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // Fetch master resume on mount
  useEffect(() => {
    async function loadMasterResume() {
      try {
        const res = await fetch("/api/resume/master");
        if (res.ok) {
          const data = await res.json();
          if (data.master) {
            setTitle(data.master.title || "Master Profile");
            setLatexSource(data.master.raw_latex || "");
            setUpdatedAt(data.master.updated_at || null);
          }
        }
      } catch (err) {
        console.error("Failed loading master resume:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMasterResume();
  }, []);

  // Save master resume to SQLite
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const parsed = parseLatex(latexSource);
      const res = await fetch("/api/resume/master", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          raw_latex: latexSource,
          parsed_json: {
            extractedSkills: parsed.extractedSkills,
            sectionCount: parsed.sections.length
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setUpdatedAt(new Date().toLocaleTimeString());
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save master resume: " + err);
    } finally {
      setSaving(false);
    }
  };

  // Upload PDF or LaTeX file
  const handleFileUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        if (data.isLatex) {
          setLatexSource(data.text);
        } else {
          // Wrapped extracted text into basic LaTeX resume template
          const newLatex = `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym,fullpage,hyperref}
\\begin{document}
\\section{Imported Resume Text}
${data.text.replace(/[%$&_#{}]/g, "\\$&")}
\\end{document}`;
          setLatexSource(newLatex);
        }
        setTitle(`Master Profile (${file.name})`);
      } else {
        alert("Upload error: " + (data.error || "Failed to parse file"));
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed uploading resume file: " + err);
    } finally {
      setUploading(false);
    }
  };

  const parsedDoc = parseLatex(latexSource);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-outline-variant/60 flex items-center justify-between px-6 bg-surface-container-lowest sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-stone-800 hover:text-primary transition-colors">
            <img src="/jobi-logo.svg" alt="Jobi" className="w-8 h-8 rounded-lg" />
            <span className="font-extrabold text-lg tracking-tight">Jobi</span>
          </Link>
          <span className="text-stone-300">/</span>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-xl">description</span>
            <span className="text-sm font-bold text-on-surface">Master Resume</span>
          </div>
          <span className="hidden sm:inline-flex text-[10px] font-mono font-bold px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
            PROTECTED SOURCE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/setup"
            className="h-8 px-3 text-stone-600 hover:text-stone-900 border border-stone-200 rounded-full text-xs font-semibold flex items-center gap-1 hover:bg-stone-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            <span>Diagnostics</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="h-9 px-4 bg-white border border-stone-300 hover:border-stone-400 text-stone-800 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">
              {saveSuccess ? "check_circle" : "save"}
            </span>
            <span>{saving ? "Saving..." : (saveSuccess ? "Saved to SQLite!" : "Save Master")}</span>
          </button>
          <Link
            to="/workspace"
            className="h-9 px-5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-full tactile-shadow-orange hover:-translate-y-[1px] active:translate-y-0 transition-transform flex items-center gap-1.5"
          >
            <span>Start Adaptation</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 w-full flex-1 flex flex-col">
        {/* Title and Badge */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight">Your Master Profile</h1>
              <span className="text-xs bg-orange-50 text-primary border border-orange-200 font-bold px-2.5 py-0.5 rounded-full font-mono">
                BASE TRUTH
              </span>
            </div>
            <p className="text-sm text-stone-600">
              This master resume is stored safely in local SQLite. Adaptations for specific jobs create new versions without altering this file.
            </p>
          </div>
          {updatedAt && (
            <div className="text-xs text-stone-500 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Last updated: {updatedAt}</span>
            </div>
          )}
        </div>

        {/* Action Import Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Card 1: Upload File */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="bg-surface-container-lowest border border-outline-variant tactile-card rounded-2xl p-5 cursor-pointer hover:border-orange-300 hover:-translate-y-[2px] transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.tex,.txt"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="flex items-center gap-3.5 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[22px]">
                  {uploading ? "sync" : "upload_file"}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  {uploading ? "Parsing File Locally..." : "Import Existing Resume"}
                </h3>
                <p className="text-xs text-stone-500">Supports PDF, TEX, or TXT documents</p>
              </div>
            </div>
          </div>

          {/* Card 2: Air-gapped Info */}
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-white rounded-xl border border-emerald-200 flex items-center justify-center text-emerald-700">
                <span className="material-symbols-outlined text-[22px]">lock</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Air-Gapped Privacy</h3>
                <p className="text-xs text-emerald-800">Your resume never touches cloud servers or remote AI APIs.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-white text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200">
              100% LOCAL
            </span>
          </div>
        </div>

        {/* Master LaTeX Editor Container */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden flex-1 flex flex-col">
          {/* Tab Header */}
          <div className="h-12 bg-surface-container border-b border-outline-variant px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "editor"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                LaTeX Source
              </button>
              <button
                onClick={() => setActiveTab("outline")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "outline"
                    ? "bg-white text-stone-900 shadow-2xs"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Outline &amp; Skills ({parsedDoc.extractedSkills.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-500">
                {parsedDoc.sections.length} Sections • {parsedDoc.bulletItems.length} Bullets
              </span>
            </div>
          </div>

          {/* Editor View */}
          {activeTab === "editor" ? (
            <div className="p-0 flex-1 flex flex-col min-h-[420px]">
              <textarea
                value={latexSource}
                onChange={(e) => setLatexSource(e.target.value)}
                placeholder="Paste your raw LaTeX resume source code here..."
                spellCheck={false}
                className="w-full flex-1 p-5 font-mono text-xs sm:text-sm text-stone-800 leading-relaxed focus:outline-none resize-none bg-white selection:bg-orange-100"
              />
            </div>
          ) : (
            <div className="p-6 flex-1 overflow-y-auto space-y-6">
              {/* Extracted Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                  Detected Master Skills ({parsedDoc.extractedSkills.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsedDoc.extractedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 bg-surface-container border border-stone-200 rounded-full text-xs font-bold text-stone-700 font-mono"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sections Breakdown */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5">
                  Structured Sections ({parsedDoc.sections.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parsedDoc.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-surface-container-low border border-stone-200 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-stone-900">{sec.name}</span>
                        <span className="text-[10px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-stone-200 text-stone-600">
                          {sec.type}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-500 font-mono">
                        {sec.items ? `${sec.items.length} bullet items` : "Section text"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
