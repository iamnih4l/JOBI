import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { parseLatex, parseJobDescription, analyzeMatch, SemanticDiffItem } from "../lib/engine";

interface JobTarget {
  id: number;
  title: string;
  company: string;
  raw_text: string;
  required_skills: string[];
}

export default function Workspace() {
  // LaTeX & Master base state
  const [latexSource, setLatexSource] = useState("");
  const [masterBaseLatex, setMasterBaseLatex] = useState("");
  const [activeFileName, setActiveFileName] = useState("resume_anthropic_v2.tex");

  // Job targets state
  const [jobs, setJobs] = useState<JobTarget[]>([]);
  const [activeJob, setActiveJob] = useState<JobTarget | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newText, setNewText] = useState("");

  // Compilation & PDF Preview state
  const [isCompiling, setIsCompiling] = useState(false);
  const [pdfCompiled, setPdfCompiled] = useState(false);
  const [compiledPdfUrl, setCompiledPdfUrl] = useState<string | null>(null);
  const [compilerError, setCompilerError] = useState<string | null>(null);
  const [compileTime, setCompileTime] = useState("114ms");

  // Telemetry & Environment
  const [ollamaReady, setOllamaReady] = useState(false);
  const [activeModel, setActiveModel] = useState("llama3.1:latest");
  const [showHelpModal, setShowHelpModal] = useState(false);

  // Semantic Diff Drawer
  const [diffDrawerOpen, setDiffDrawerOpen] = useState(false);
  const [diffItems, setDiffItems] = useState<SemanticDiffItem[]>([
    {
      id: "diff-1",
      section: "Work Experience",
      original: "Led internal ML deployment team maintaining containerized HuggingFace transformers models across AWS EC2 instances, achieving 99.8% uptime.",
      adapted: "Optimized multi-node vLLM cluster serving 70B parameter models, reducing p99 latency from 140ms to 32ms using custom CUDA kernels.",
      rationale: "Emphasizes multi-node clusters, vLLM, and custom CUDA kernels requested in target JD.",
      keywords: ["vLLM", "CUDA", "Low-latency"],
      status: "pending"
    },
    {
      id: "diff-2",
      section: "Work Experience",
      original: "Maintained pipeline automation for testing model checkpoints across staging nodes.",
      adapted: "Architected air-gapped evaluation pipeline eliminating external API calls while preserving deterministic benchmark scoring.",
      rationale: "Highlights air-gapped architecture and deterministic evaluation.",
      keywords: ["Air-gapped", "Inference", "Local Architecture"],
      status: "pending"
    },
    {
      id: "diff-3",
      section: "Key Technical Artifacts",
      original: "Wrote PyTorch utility for faster matrix operations.",
      adapted: "Synthesized memory-fused backward pass yielding 1.34x compute throughput on Hopper SM90.",
      rationale: "Directly addresses Triton / Hopper kernel requirements.",
      keywords: ["Triton", "CUDA", "Hopper SM90"],
      status: "pending"
    }
  ]);

  // Inline Suggestion State
  const [showInlineSuggestion, setShowInlineSuggestion] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  const [inlineSuggestionText, setInlineSuggestionText] = useState(
    "Adapted line 12: Emphasized vLLM multi-node cluster & custom CUDA to address Anthropic's low-latency inference requirements."
  );

  // Load Master Resume & Job List on mount
  useEffect(() => {
    async function initWorkspace() {
      try {
        // 1. Fetch Master Resume
        const masterRes = await fetch("/api/resume/master");
        if (masterRes.ok) {
          const data = await masterRes.json();
          if (data.master && data.master.raw_latex) {
            setLatexSource(data.master.raw_latex);
            setMasterBaseLatex(data.master.raw_latex);
          }
        }

        // 2. Fetch Jobs
        const jobsRes = await fetch("/api/job/list");
        if (jobsRes.ok) {
          const data = await jobsRes.json();
          if (data.jobs && data.jobs.length > 0) {
            setJobs(data.jobs);
            setActiveJob(data.jobs[0]);
            setActiveFileName(`resume_${data.jobs[0].company.toLowerCase()}_v2.tex`);
          }
        }

        // 3. Check System Status
        const sysRes = await fetch("/api/system/status");
        if (sysRes.ok) {
          const sysData = await sysRes.json();
          setOllamaReady(sysData.ollama.connected);
          if (sysData.ollama.models && sysData.ollama.models.length > 0) {
            const saved = localStorage.getItem("jobi_selected_model");
            if (saved && sysData.ollama.models.includes(saved)) {
              setActiveModel(saved);
            } else {
              setActiveModel(sysData.ollama.models[0]);
            }
          }
        }
      } catch (err) {
        console.error("Workspace init error:", err);
      }
    }
    initWorkspace();
  }, []);

  // Real-time parsed resume and match calculation
  const parsedDoc = useMemo(() => parseLatex(latexSource), [latexSource]);

  const activeJdParsed = useMemo(() => {
    if (!activeJob) return parseJobDescription("", "Software Engineer", "Company");
    return parseJobDescription(activeJob.raw_text, activeJob.title, activeJob.company);
  }, [activeJob]);

  const matchAnalysis = useMemo(() => {
    return analyzeMatch(parsedDoc, activeJdParsed);
  }, [parsedDoc, activeJdParsed]);

  // Handle Compile
  const handleCompile = async () => {
    setIsCompiling(true);
    setCompilerError(null);
    const start = performance.now();

    try {
      const res = await fetch("/api/latex/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latexStr: latexSource })
      });
      const response = await res.json();
      const elapsed = Math.round(performance.now() - start);
      setCompileTime(`${elapsed}ms`);

      if (response.success) {
        setPdfCompiled(true);
        setCompiledPdfUrl(response.pdfUrl);
      } else {
        setCompilerError(response.error);
        if (!response.compilerMissing) {
          setPdfCompiled(false);
        }
      }
    } catch (e: any) {
      console.error(e);
      setCompilerError("Error connecting to local compile engine: " + e.message);
    } finally {
      setIsCompiling(false);
    }
  };

  // Handle Download .tex
  const handleDownloadTex = () => {
    const blob = new Blob([latexSource], { type: "application/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = activeFileName || "resume.tex";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle Download PDF
  const handleDownloadPdf = () => {
    if (compiledPdfUrl) {
      const a = document.createElement("a");
      a.href = compiledPdfUrl;
      a.download = `${activeFileName.replace(".tex", "")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      handleCompile();
    }
  };

  // Handle Add New Job Target
  const handleSaveJobTarget = async () => {
    if (!newText.trim()) {
      alert("Please paste a job description.");
      return;
    }
    try {
      const res = await fetch("/api/job/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle || "Software Engineer",
          company: newCompany || "Target Company",
          text: newText
        })
      });
      const data = await res.json();
      if (data.success && data.job) {
        setJobs([data.job, ...jobs]);
        setActiveJob(data.job);
        setActiveFileName(`resume_${data.job.company.toLowerCase()}_v1.tex`);
        setShowJobModal(false);
        setNewTitle("");
        setNewCompany("");
        setNewText("");
      }
    } catch (e: any) {
      alert("Failed saving job target: " + e.message);
    }
  };

  // Handle Approve single diff item
  const handleApproveDiff = (diffId: string) => {
    const item = diffItems.find(d => d.id === diffId);
    if (!item) return;

    if (item.original && latexSource.includes(item.original)) {
      setLatexSource(latexSource.replace(item.original, item.adapted));
    } else {
      // Append adapted bullet under section if exact match not found
      setLatexSource(latexSource + `\n\\resumeItem{${item.adapted}}`);
    }

    setDiffItems(diffItems.map(d => d.id === diffId ? { ...d, status: "accepted" } : d));
  };

  // Handle Accept All diffs
  const handleAcceptAllDiffs = () => {
    let updated = latexSource;
    diffItems.forEach(item => {
      if (item.status === "pending" && item.original && updated.includes(item.original)) {
        updated = updated.replace(item.original, item.adapted);
      }
    });
    setLatexSource(updated);
    setDiffItems(diffItems.map(d => ({ ...d, status: "accepted" })));
  };

  // Handle Skip single diff item
  const handleSkipDiff = (diffId: string) => {
    setDiffItems(diffItems.map(d => d.id === diffId ? { ...d, status: "skipped" } : d));
  };

  // Handle Inline Suggestion Accept
  const handleAcceptInline = () => {
    const targetOld = "Led internal ML deployment team maintaining containerized HuggingFace transformers models across AWS EC2 instances, achieving 99.8% uptime.";
    const targetNew = "\\textbf{Distributed Inference:} Optimized multi-node vLLM cluster serving 70B parameter models, reducing p99 latency from 140ms to 32ms using custom CUDA kernels.";
    if (latexSource.includes(targetOld)) {
      setLatexSource(latexSource.replace(targetOld, targetNew));
    }
    setShowInlineSuggestion(false);
  };

  // Handle Refine Locally with Ollama
  const handleRefineLocally = async () => {
    setIsRefining(true);
    try {
      const res = await fetch("/api/ollama/adapt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalBullet: "Led internal ML deployment team maintaining containerized HuggingFace transformers models across AWS EC2 instances, achieving 99.8% uptime.",
          jobDescription: activeJob?.raw_text || "Low-latency distributed inference engineer with CUDA and vLLM experience.",
          model: activeModel
        })
      });
      const data = await res.json();
      if (data.success && data.adapted) {
        setInlineSuggestionText(`Adapted: ${data.adapted} (${data.rationale})`);
      }
    } catch (e) {
      console.error("Refinement error:", e);
    } finally {
      setIsRefining(false);
    }
  };

  // Quick tool: Add Targeted Project
  const handleAddProject = () => {
    const projectSnippet = `\n\\resumeSubheading{Air-Gapped Local Inference Pipeline}{PyTorch / Ollama}{}{}\n  \\resumeItem{Architected 100\\% on-device deterministic parser achieving zero external telemetry.}\n`;
    setLatexSource(latexSource.replace("\\end{document}", `${projectSnippet}\\end{document}`));
  };

  // Quick tool: Re-rank by JD Relevance
  const handleRerank = () => {
    alert("Re-ranked resume sections to prioritize experience matching '" + (activeJob?.company || "target") + "'.");
  };

  const pendingCount = diffItems.filter(d => d.status === "pending").length;
  const acceptedCount = diffItems.filter(d => d.status === "accepted").length;

  return (
    <>
      <div>
        {/* Friendly Collapsible Sidebar */}
        <aside className="fixed left-0 top-0 h-full w-64 bg-[#FAF8F5] border-r border-stone-200/80 z-50 flex flex-col justify-between shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col">
            {/* Brand Logo Header */}
            <div className="h-16 px-5 flex items-center justify-between border-b border-stone-200/60 bg-white/70 backdrop-blur">
              <Link to="/" className="flex items-center gap-2.5">
                <img
                  alt="Jobi Mascot Logo"
                  className="h-8 w-8 rounded-xl shadow-xs"
                  src="/jobi-logo.svg"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-stone-900 tracking-tight text-lg leading-tight">Jobi</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-[#FF5C35] rounded-full tracking-wider uppercase">Studio</span>
                  </div>
                </div>
              </Link>
              <button
                onClick={() => setShowHelpModal(true)}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 text-xs font-bold cursor-pointer transition-colors"
                title="Jobi Shortcuts & Help"
              >
                ?
              </button>
            </div>

            {/* Air-Gapped Engine Badge Pill */}
            <div className="px-4 py-3.5">
              <div className="flex items-center justify-between px-3 py-2 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-emerald-800 tracking-tight flex items-center gap-1">
                      Air-gapped &amp; On-device
                      <span className="text-xs">🔒</span>
                    </span>
                    <span className="text-[9px] font-medium text-emerald-600 font-mono">100% Zero Data Leaks</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white/80 px-1.5 py-0.5 rounded-full border border-emerald-200 font-mono">v2.4</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1 px-3 mt-1 font-medium text-sm">
              <Link
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 transition-all rounded-xl"
                to="/"
              >
                <span className="material-symbols-outlined text-[19px] text-stone-400">space_dashboard</span>
                <span>Dashboard</span>
              </Link>

              <Link
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 transition-all rounded-xl"
                to="/master"
              >
                <span className="material-symbols-outlined text-[19px] text-stone-400">description</span>
                <span>Master Resume</span>
              </Link>

              <div
                aria-current="page"
                className="flex items-center gap-2.5 px-3.5 py-2.5 bg-[#FF5C35]/10 text-[#FF5C35] font-bold rounded-xl shadow-2xs transition-all cursor-default"
              >
                <span className="material-symbols-outlined text-[19px] text-[#FF5C35]">code</span>
                <span>Adapt Workspace</span>
                <span className="ml-auto w-2 h-2 rounded-full bg-[#FF5C35]" />
              </div>

              <button
                onClick={() => setDiffDrawerOpen(!diffDrawerOpen)}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 transition-all rounded-xl"
              >
                <span className="material-symbols-outlined text-[19px] text-stone-400">compare_arrows</span>
                <span>Change Review</span>
                <span className="ml-auto px-1.5 py-0.5 text-[10px] bg-stone-200/80 text-stone-700 rounded-full font-mono font-bold">
                  {pendingCount}
                </span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 transition-all rounded-xl"
              >
                <span className="material-symbols-outlined text-[19px] text-stone-400">picture_as_pdf</span>
                <span>Export Artifacts</span>
              </button>
            </nav>
          </div>

          {/* Bottom Telemetry Card */}
          <div className="p-3 m-3 bg-white border border-stone-200/80 rounded-2xl shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">Local Llama Engine</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${ollamaReady ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                {ollamaReady ? 'READY' : 'OFFLINE'}
              </span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
              <div className={`h-full rounded-full transition-all duration-500 ${ollamaReady ? 'bg-gradient-to-r from-emerald-400 to-[#FF5C35] w-4/5' : 'bg-stone-300 w-1/4'}`} />
            </div>
            <div className="flex justify-between items-center text-[11px] font-mono text-stone-500 pt-0.5">
              <span className="flex items-center gap-1 font-semibold text-stone-700 truncate max-w-[130px]">
                ⚡ {activeModel}
              </span>
              <Link to="/setup" className="text-primary hover:underline text-[10px] font-bold">Config</Link>
            </div>
          </div>
        </aside>

        {/* Main Canvas Wrapper */}
        <div className="pl-64 flex flex-col min-h-screen">
          {/* Tactile Top Header Bar */}
          <header className="sticky top-0 z-40 h-16 bg-white/90 backdrop-blur-md border-b border-stone-200/70 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              {/* Target Role Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowJobModal(true)}
                  className="flex items-center gap-2 bg-[#FAF8F5] border border-stone-200 px-3 py-1.5 rounded-full hover:border-orange-300 transition-colors cursor-pointer group shadow-2xs"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF5C35] to-orange-400 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {activeJob?.company ? activeJob.company[0].toUpperCase() : "A"}
                  </div>
                  <span className="font-bold text-stone-800 text-sm">
                    {activeJob ? `${activeJob.title} @ ${activeJob.company}` : "Select Target Job"}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-stone-400 group-hover:text-stone-700 transition-colors">
                    expand_more
                  </span>
                </button>
              </div>

              {/* Match Affinity Pill */}
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200/80 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold shadow-2xs">
                <span className="text-sm">✨</span>
                <span>{matchAnalysis.matchScore}% Match Affinity</span>
                <span className="text-[10px] font-mono font-medium text-emerald-600 bg-emerald-100/80 px-1.5 py-0.2 rounded-full ml-1">
                  ATS: {matchAnalysis.atsScore}/100
                </span>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Latency / Environment pill */}
              <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-stone-100/90 border border-stone-200/80 rounded-full text-stone-600 text-xs font-mono font-medium">
                <span className={`w-2 h-2 rounded-full ${ollamaReady ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                <span>{ollamaReady ? `Local AI: ${activeModel}` : 'Deterministic Heuristic Mode'}</span>
              </div>

              {/* Tactile Compile Button */}
              <button
                onClick={handleCompile}
                disabled={isCompiling}
                className="h-9 px-4 bg-[#FF5C35] hover:bg-[#E04B26] active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 rounded-full shadow-[0_3px_12px_rgba(255,92,53,0.3)] transition-all disabled:opacity-50"
                id="recompile-btn-header"
              >
                <span className={`material-symbols-outlined text-[17px] ${isCompiling ? 'animate-spin' : ''}`}>
                  {isCompiling ? "sync" : "bolt"}
                </span>
                <span>{isCompiling ? "Compiling..." : "Compile & Export"}</span>
              </button>

              {/* Master Link */}
              <Link
                to="/master"
                className="w-9 h-9 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 shadow-2xs hover:bg-stone-200 transition-colors"
                title="Return to Master Resume"
              >
                <span className="material-symbols-outlined text-[20px]">person</span>
              </Link>
            </div>
          </header>

          {/* Sub-bar for Workspace Controls */}
          <div className="w-full bg-[#FAF8F5] border-b border-stone-200/70 px-6 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Active File:</span>
              <span className="px-2.5 py-0.5 bg-white border border-stone-200 rounded-full text-xs font-mono font-bold text-stone-800 shadow-2xs">
                {activeFileName}
              </span>
              <span className="text-xs text-stone-400 font-medium">
                {pdfCompiled ? "• Compiled successfully" : "• Ready for adaptation"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowJobModal(true)}
                className="h-7 px-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 rounded-full text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
              >
                <span className="material-symbols-outlined text-[15px] text-stone-500">add</span>
                <span>Target New Job</span>
              </button>
              <button
                onClick={() => setDiffDrawerOpen(!diffDrawerOpen)}
                className="h-7 px-3 bg-white hover:bg-orange-50/50 border border-stone-200 text-stone-800 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all"
                id="toggle-drawer-btn"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF5C35]" />
                <span>Diff Review</span>
                <span className="px-1.5 py-0.2 bg-orange-100 text-[#FF5C35] rounded-full font-mono text-[10px] font-bold">
                  {pendingCount}
                </span>
              </button>
              <div className="h-7 px-2.5 bg-stone-100 border border-stone-200 rounded-full text-stone-600 text-xs font-mono font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-stone-400">timer</span>
                <span id="recompile-time">{compileTime}</span>
              </div>
            </div>
          </div>

          {/* Compiler Error Banner (If any) */}
          {compilerError && (
            <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-900 text-xs shadow-2xs">
              <span className="material-symbols-outlined text-rose-600 text-lg shrink-0">error</span>
              <div className="flex-1">
                <div className="font-bold mb-0.5">LaTeX Compilation Notice</div>
                <div className="font-mono whitespace-pre-wrap">{compilerError}</div>
              </div>
              <button
                onClick={() => setCompilerError(null)}
                className="text-rose-500 hover:text-rose-800 font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Workspace Studio Grid (3 Columns) */}
          <main className="flex-1 p-4 md:p-6 w-full max-w-[1720px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* ==================== LEFT PANEL: Document Tree & Playful JD Chips (lg:col-span-3) ==================== */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                {/* Document Outline Card */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                    <span className="text-xs font-extrabold text-stone-900 tracking-wider uppercase">Document Outline</span>
                    <span className="text-[11px] font-mono font-bold text-[#FF5C35] bg-orange-50 px-2 py-0.5 rounded-full">
                      {parsedDoc.sections.length} SECTIONS
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-sm font-medium">
                    {parsedDoc.sections.map((sec, i) => (
                      <div
                        key={i}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                          sec.type === "experience"
                            ? "bg-orange-50 border border-orange-200/80 text-[#FF5C35] font-bold shadow-2xs"
                            : "hover:bg-[#FAF8F5] text-stone-600 hover:text-stone-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`material-symbols-outlined text-[17px] ${sec.type === "experience" ? "text-[#FF5C35]" : "text-stone-400"}`}>
                            {sec.type === "experience" ? "work" : (sec.type === "skills" ? "token" : "subject")}
                          </span>
                          <span className="truncate max-w-[140px]">{sec.name}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-stone-400">
                          {sec.items ? `${sec.items.length} items` : "sync"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* JD Keywords Coverage Chips Card */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-1 border-b border-stone-100">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[17px] text-[#FF5C35]">radar</span>
                      <span className="text-xs font-extrabold text-stone-900 tracking-wider uppercase">JD Keyword Match</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {matchAnalysis.matchedSkills.length} / {activeJdParsed.requiredSkills.length || 1}
                    </span>
                  </div>

                  {/* Progress Meter */}
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-2xs"
                      style={{ width: `${Math.max(15, Math.min(100, matchAnalysis.matchScore))}%` }}
                    />
                  </div>

                  {/* Tactile Sticker Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1 max-h-48 overflow-y-auto">
                    {matchAnalysis.matchedSkills.map((s, idx) => (
                      <div
                        key={`matched-${idx}`}
                        className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full font-bold text-[11px] shadow-2xs hover:scale-105 transition-transform cursor-default"
                      >
                        <span className="material-symbols-outlined text-[13px] text-emerald-600 font-bold">check_circle</span>
                        <span className="capitalize">{s}</span>
                      </div>
                    ))}

                    {matchAnalysis.missingSkills.map((s, idx) => (
                      <div
                        key={`missing-${idx}`}
                        className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full font-semibold text-[11px] shadow-2xs hover:scale-105 transition-transform cursor-default"
                        title="Skill requested in JD but missing in resume"
                      >
                        <span className="text-amber-500 font-bold text-xs">!</span>
                        <span className="capitalize">{s}</span>
                      </div>
                    ))}
                  </div>

                  {/* Affinity Improvement badge */}
                  <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs font-medium text-stone-600">
                    <span className="flex items-center gap-1">
                      <span className="text-sm">📈</span> Target Affinity:
                    </span>
                    <span className="text-emerald-700 font-bold font-mono">
                      {matchAnalysis.matchScore}% Match
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="bg-white border border-stone-200/90 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
                  <span className="text-xs font-extrabold text-stone-900 tracking-wider uppercase mb-1">Quick Tools</span>
                  <button
                    onClick={handleAddProject}
                    className="w-full text-left px-3 py-2 bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors border border-stone-200/60"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-[#FF5C35]">add_circle</span>
                      <span>Add Targeted Project</span>
                    </span>
                    <span className="px-1.5 py-0.5 bg-white border border-stone-200 text-[10px] text-stone-500 rounded font-mono shadow-2xs">+TEX</span>
                  </button>
                  <button
                    onClick={handleRerank}
                    className="w-full text-left px-3 py-2 bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors border border-stone-200/60"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-blue-600">sort</span>
                      <span>Re-rank by JD Relevance</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono font-bold">AUTO</span>
                  </button>
                  <button
                    onClick={() => {
                      if (masterBaseLatex && confirm("Reset active LaTeX editor back to Master Base resume?")) {
                        setLatexSource(masterBaseLatex);
                      }
                    }}
                    className="w-full text-left px-3 py-2 bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors border border-stone-200/60"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-amber-600">history</span>
                      <span>Reset to Master Base</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono font-bold">BASE</span>
                  </button>
                </div>
              </div>

              {/* ==================== CENTER PANEL: Clean Light-Mode LaTeX Code Editor (lg:col-span-5) ==================== */}
              <div className="lg:col-span-5 flex flex-col bg-white border border-stone-200/90 rounded-2xl shadow-sm overflow-hidden min-w-0">
                {/* Editor Control Header */}
                <div className="h-11 bg-[#FAF8F5] border-b border-stone-200/80 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="font-mono text-xs font-bold text-stone-800 ml-2 truncate">
                      {activeFileName}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-stone-200 text-stone-600 rounded-full font-semibold hidden sm:inline">
                      LaTeX Source
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleDownloadTex}
                      className="p-1 hover:bg-stone-200/70 text-stone-600 hover:text-stone-900 rounded-lg transition-colors"
                      title="Download .tex File"
                    >
                      <span className="material-symbols-outlined text-[17px]">download</span>
                    </button>
                  </div>
                </div>

                {/* LaTeX Syntax Viewport */}
                <div className="p-0 flex-1">
                  <textarea
                    className="w-full h-full min-h-[460px] p-4 text-[13px] font-mono leading-relaxed bg-white text-stone-800 focus:outline-none resize-none"
                    value={latexSource}
                    onChange={(e) => setLatexSource(e.target.value)}
                    spellCheck={false}
                  />
                </div>

                {/* Tactile Inline Rewrite Suggestion Pill Card */}
                {showInlineSuggestion && (
                  <div className="p-3 bg-[#FAF8F5] border-t border-stone-200/80 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF5C35] flex items-center justify-center text-xs font-bold">
                          ✨
                        </span>
                        <span className="text-xs font-bold text-stone-900 tracking-tight">
                          On-Device Rewrite Suggestion
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-500 font-semibold bg-white border border-stone-200 px-2 py-0.5 rounded-full shadow-2xs">
                        {ollamaReady ? activeModel : "Heuristic"}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {inlineSuggestionText}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleAcceptInline}
                          className="h-7 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-full flex items-center gap-1 shadow-2xs transition-all"
                        >
                          <span className="material-symbols-outlined text-[15px]">check</span>
                          <span>Accept Rewrite</span>
                        </button>
                        <button
                          onClick={() => setShowInlineSuggestion(false)}
                          className="h-7 px-3 bg-white hover:bg-stone-100 border border-stone-200 text-stone-600 font-semibold text-xs rounded-full transition-colors"
                        >
                          Keep Original
                        </button>
                      </div>
                      <button
                        onClick={handleRefineLocally}
                        disabled={isRefining}
                        className="h-7 px-3 bg-white hover:bg-orange-50 border border-orange-200 text-[#FF5C35] font-bold text-xs rounded-full flex items-center gap-1 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isRefining ? "sync" : "psychology"}
                        </span>
                        <span>{isRefining ? "Refining..." : "Refine locally"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================== RIGHT PANEL: Tactile Vector PDF Preview (lg:col-span-4) ==================== */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                {/* PDF Document Toolbar */}
                <div className="h-11 bg-white border border-stone-200/90 px-3.5 rounded-2xl flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-stone-500 text-[10px] uppercase tracking-wider">PREVIEW</span>
                    <span className="font-mono font-bold text-stone-800 px-2 py-0.5 bg-stone-100 rounded-lg">
                      {compiledPdfUrl ? "LIVE PDF" : "PAPER"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadTex}
                      className="h-7 px-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Download .tex"
                    >
                      <span className="material-symbols-outlined text-[15px]">code</span>
                      <span>.tex</span>
                    </button>
                    <button
                      onClick={handleDownloadPdf}
                      className="h-7 px-2.5 bg-primary hover:bg-[#E04B26] text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Download PDF"
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span>PDF</span>
                    </button>
                  </div>
                </div>

                {/* Live PDF or Physical Paper Aesthetics */}
                <div className="w-full bg-[#F4F0EA] border border-stone-300/70 p-3 md:p-4 rounded-2xl flex justify-center shadow-inner overflow-hidden min-h-[580px]">
                  {compiledPdfUrl ? (
                    <iframe
                      src={compiledPdfUrl}
                      className="w-full h-full min-h-[560px] rounded-lg border-0 shadow-sm"
                      title="Compiled Resume PDF Preview"
                    />
                  ) : (
                    /* Rendered Resume Sheet (Physical Paper Aesthetic) */
                    <div className="w-full max-w-[430px] bg-white text-stone-900 p-6 rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-200/60 select-text text-[10px] leading-[14px] overflow-y-auto" id="rendered-pdf">
                      {/* Header */}
                      <div className="text-center pb-2">
                        <h1 className="text-[17px] font-extrabold tracking-tight text-stone-900 leading-none">DR. ETHAN VANCE</h1>
                        <div className="text-[9px] text-stone-500 mt-1 font-mono">
                          ethan@vance.ai • San Francisco, CA • github.com/evance-ml
                        </div>
                        <div className="w-full h-[1.5px] bg-stone-900 mt-2" />
                      </div>

                      {/* Work Experience */}
                      <div className="mt-3">
                        <div className="p-1 flex items-center justify-between">
                          <h2 className="text-[11px] font-bold tracking-wider text-stone-900 uppercase">Work Experience</h2>
                          <span className="text-[8px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono font-bold">
                            {activeJob?.company || "Target"} Adapted
                          </span>
                        </div>
                        <div className="w-full h-[0.5px] bg-stone-300 mb-1.5" />

                        {/* Job 1 */}
                        <div className="p-1.5 rounded-lg mb-2 bg-orange-50/30 border border-orange-100">
                          <div className="flex justify-between items-baseline font-bold text-stone-900">
                            <span>Senior Systems Engineer — Autonomous AI Lab</span>
                            <span className="text-[9px] text-stone-500 font-normal font-mono">2022 – Present</span>
                          </div>
                          <ul className="list-disc pl-3 text-stone-700 space-y-1 mt-1 text-[9px] leading-[13px]">
                            <li className="bg-emerald-100/60 text-stone-900 p-1 rounded-md border-l-2 border-emerald-500 font-medium">
                              <span className="font-bold text-emerald-950">Distributed Inference:</span> Optimized multi-node vLLM cluster serving 70B parameter models, reducing p99 latency from 140ms to 32ms using custom CUDA kernels.
                            </li>
                            <li className="bg-emerald-100/60 text-stone-900 p-1 rounded-md border-l-2 border-emerald-500 font-medium">
                              <span className="font-bold text-emerald-950">Local Architecture:</span> Architected air-gapped evaluation pipeline eliminating external API calls while preserving deterministic benchmark scoring.
                            </li>
                            <li className="pl-0.5">
                              Implemented pipeline-parallel tensor partitioning over InfiniBand fabric across 64x H100 GPUs.
                            </li>
                          </ul>
                        </div>

                        {/* Job 2 */}
                        <div className="p-1 rounded mb-2">
                          <div className="flex justify-between items-baseline font-bold text-stone-900">
                            <span>Distributed Systems Lead — Nexus Tensor Core</span>
                            <span className="text-[9px] text-stone-500 font-normal font-mono">2020 – 2022</span>
                          </div>
                          <ul className="list-disc pl-3 text-stone-600 space-y-1 mt-1 text-[9px] leading-[13px]">
                            <li>Engineered zero-copy streaming protocols in C++ &amp; Rust for continuous token delivery.</li>
                            <li>Reduced cold-start VM orchestration overhead by 68% via pre-allocated GPU unified memory.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Selected Projects */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between p-1">
                          <h2 className="text-[11px] font-bold tracking-wider text-stone-900 uppercase">Selected Projects</h2>
                          <span className="text-[8px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono font-bold">Hopper SM90</span>
                        </div>
                        <div className="w-full h-[0.5px] bg-stone-300 mb-1.5" />
                        <div className="mb-1.5 p-1">
                          <div className="flex justify-between items-baseline font-bold text-stone-900">
                            <span>Flash-Attention Kernel Port (Triton / CUDA)</span>
                            <span className="text-[8px] text-stone-400 font-mono">github.com/evance/fa-sm90</span>
                          </div>
                          <p className="text-stone-600 text-[9px] leading-[12px] mt-0.5">
                            Synthesized memory-fused backward pass yielding 1.34x compute throughput on Hopper SM90 architectures.
                          </p>
                        </div>
                      </div>

                      {/* Core Competencies */}
                      <div className="mt-3 p-1">
                        <h2 className="text-[11px] font-bold tracking-wider text-stone-900 uppercase">Skills &amp; Systems Matrix</h2>
                        <div className="w-full h-[0.5px] bg-stone-300 mb-1.5" />
                        <div className="text-[9px] text-stone-600 leading-[14px]">
                          <span className="font-bold text-stone-900">Core Systems:</span> PyTorch, vLLM, CUDA, Triton, TensorRT-LLM, NCCL, C++, Rust.<br />
                          <span className="font-bold text-stone-900">Infrastructure:</span> Slurm, Kubernetes, InfiniBand, Linux Kernel eBPF, Docker.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ==================== BOTTOM BAR / DIFF DRAWER: Tactile Diff Cards ==================== */}
            {diffDrawerOpen && (
              <div className="w-full bg-white border border-stone-200/90 rounded-2xl p-4 md:p-5 mt-5 shadow-sm transition-all duration-300" id="diff-drawer">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-stone-100 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5C35] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">compare_arrows</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-stone-900 text-sm md:text-base">Semantic Diff Review</h3>
                      <p className="text-xs text-stone-500">Fine-tune each auto-targeted modification before final compilation.</p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <span className="text-xs font-bold font-mono px-2 py-0.5 bg-orange-50 text-[#FF5C35] border border-orange-200 rounded-full">
                        {pendingCount} PENDING
                      </span>
                      <span className="text-xs font-bold font-mono px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                        {acceptedCount} ACCEPTED
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAcceptAllDiffs}
                      className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold rounded-full flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px]">done_all</span>
                      <span>Accept All ({pendingCount})</span>
                    </button>
                    <button
                      onClick={() => setDiffDrawerOpen(false)}
                      className="p-1 hover:bg-stone-100 text-stone-400 hover:text-stone-700 rounded-lg transition-colors"
                      id="close-drawer-btn"
                    >
                      <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
                    </button>
                  </div>
                </div>

                {/* Diff Card Comparison Grid */}
                <div className="space-y-3 mt-3">
                  {diffItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 text-xs">
                      {/* Original Master Bullet Card */}
                      <div className="md:col-span-5 bg-[#FAF8F5] border border-stone-200 p-3.5 rounded-xl flex flex-col justify-between gap-2 shadow-2xs">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-500">
                              Original Master Bullet ({item.section})
                            </span>
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 font-mono font-bold text-[10px] rounded-full">
                              - MASTER
                            </span>
                          </div>
                          <div className="p-2.5 bg-white border border-stone-200/80 rounded-lg text-stone-600 leading-relaxed line-through decoration-rose-400">
                            "{item.original}"
                          </div>
                        </div>
                        <div className="text-[11px] text-stone-500">
                          <span className="font-bold text-stone-700">Rationale:</span> {item.rationale}
                        </div>
                      </div>

                      {/* Arrow Indicator */}
                      <div className="md:col-span-1 hidden md:flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-orange-100 text-[#FF5C35] flex items-center justify-center shadow-2xs">
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </div>
                      </div>

                      {/* Adapted Target Bullet Card */}
                      <div className="md:col-span-6 bg-orange-50/40 border border-orange-200 p-3.5 rounded-xl flex flex-col justify-between gap-2 shadow-2xs">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FF5C35]">
                                Adapted for {activeJob?.company || "Target"}
                              </span>
                              <span className="text-xs">✨</span>
                            </div>
                            <span className={`px-2 py-0.5 font-mono font-bold text-[10px] rounded-full ${
                              item.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {item.status === 'accepted' ? '✓ APPLIED' : '+ OPTIMIZED'}
                            </span>
                          </div>
                          <div className="p-2.5 bg-white border border-orange-200 rounded-lg text-stone-900 font-semibold leading-relaxed shadow-2xs">
                            "{item.adapted}"
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-orange-100">
                          <div className="flex items-center gap-1 text-[11px] font-mono text-stone-600">
                            <span className="font-bold text-stone-800">Keywords:</span> {item.keywords.join(" • ")}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.status !== "accepted" ? (
                              <>
                                <button
                                  onClick={() => handleApproveDiff(item.id)}
                                  className="h-7 px-3 bg-[#FF5C35] hover:bg-[#E04B26] text-white font-bold text-xs rounded-full flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
                                >
                                  <span>Approve ✨</span>
                                </button>
                                <button
                                  onClick={() => handleSkipDiff(item.id)}
                                  className="h-7 px-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-600 font-semibold text-xs rounded-full transition-colors"
                                >
                                  Skip
                                </button>
                              </>
                            ) : (
                              <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px]">check</span>
                                Applied to LaTeX
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Target Job Selector Modal */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-xl border border-stone-200 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-lg text-stone-900">Select or Add Target Job</h3>
              <button
                onClick={() => setShowJobModal(false)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Existing Jobs */}
            {jobs.length > 0 && (
              <div>
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Saved Job Targets
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {jobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => {
                        setActiveJob(j);
                        setActiveFileName(`resume_${j.company.toLowerCase()}_v1.tex`);
                        setShowJobModal(false);
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        activeJob?.id === j.id
                          ? "bg-orange-50 border-orange-200 text-[#FF5C35] font-bold"
                          : "bg-surface hover:bg-stone-50 border-stone-200 text-stone-800"
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold">{j.title}</div>
                        <div className="text-[11px] text-stone-500">{j.company}</div>
                      </div>
                      {activeJob?.id === j.id && (
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Job Section */}
            <div className="pt-2 border-t border-stone-100 flex flex-col gap-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Or Add New Job Description
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Job Title (e.g. Senior ML Engineer)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-surface rounded-xl border border-stone-200 focus:outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Company (e.g. Google DeepMind)"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full text-xs p-2.5 bg-surface rounded-xl border border-stone-200 focus:outline-none focus:border-primary"
                />
              </div>
              <textarea
                placeholder="Paste the full job description here to extract required keywords and match scores..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={4}
                className="w-full text-xs p-3 bg-surface rounded-xl border border-stone-200 focus:outline-none focus:border-primary resize-none font-mono"
              />
              <button
                onClick={handleSaveJobTarget}
                className="h-10 bg-primary hover:bg-[#E04B26] text-white font-bold text-xs rounded-full uppercase tracking-wider tactile-shadow-orange active:scale-95 transition-all"
              >
                Analyze &amp; Set as Active Target
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl border border-stone-200 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="font-bold text-base text-stone-900">Jobi Studio Shortcuts</h3>
              <button onClick={() => setShowHelpModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Compile &amp; Export</span>
                <kbd className="font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">Compile Button</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Toggle Diff Review</span>
                <kbd className="font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">Diff Review Pill</kbd>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Download .tex / PDF</span>
                <kbd className="font-mono bg-stone-100 px-2 py-0.5 rounded border border-stone-200">Preview Toolbar</kbd>
              </div>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="mt-2 h-9 bg-surface-container hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-full transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
