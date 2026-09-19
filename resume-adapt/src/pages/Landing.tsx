import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <>
<div>
  {/* TOP APP BAR / HEADER */}
  <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/90 backdrop-blur-md border-b border-outline-variant/60">
    <div className="h-16 max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Brand & Status Pill */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm overflow-hidden bg-primary/10 p-0.5 border border-primary/20">
          <img alt="Jobi Friendly Mascot Logo" className="w-full h-full object-contain rounded-lg" src="/jobi-logo.svg" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-on-surface tracking-tight">Jobi</span>
            <span className="font-mono text-[10px] font-semibold px-2 py-0.5 bg-accent-yellow-light text-amber-900 rounded-full border border-amber-200">v2.4 LOCAL</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AIR-GAPPED &amp; ON-DEVICE</span>
          </div>
        </div>
      </div>
      {/* Center Neo-Pill Navigation */}
      <nav className="hidden lg:flex items-center gap-1 bg-surface-container p-1.5 rounded-full border border-outline-variant/80 shadow-inner" data-active-classes="bg-white text-on-surface font-semibold shadow-sm">
        <a aria-current="page" className="px-4 py-1.5 text-xs font-semibold rounded-full bg-white text-on-surface shadow-sm border border-stone-200/60" data-path="cinematic-landing" href="#top">Product</a>
        <a className="px-4 py-1.5 text-xs font-medium text-stone-600 hover:text-on-surface hover:bg-white/60 rounded-full transition-all" data-path="how-it-works" href="#how-it-works">How it works</a>
        <a className="px-4 py-1.5 text-xs font-medium text-stone-600 hover:text-on-surface hover:bg-white/60 rounded-full transition-all" data-path="privacy-boundary" href="#privacy">Privacy Bubble</a>
        <a className="px-4 py-1.5 text-xs font-medium text-stone-600 hover:text-on-surface hover:bg-white/60 rounded-full transition-all" data-path="latex-core" href="#latex">LaTeX Core</a>
        <Link className="px-4 py-1.5 text-xs font-medium text-stone-600 hover:text-on-surface hover:bg-white/60 rounded-full transition-all" data-path="workspace-demo" to="/workspace">Workspace</Link>
      </nav>
      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <Link className="hidden sm:inline-flex items-center text-xs font-semibold text-stone-600 hover:text-primary transition-colors px-3 py-1.5 rounded-full hover:bg-stone-100" data-path="master-resume" to="/master">
          View Master Resume
        </Link>
        <Link className="h-9 px-4 bg-primary text-white font-semibold text-xs rounded-full flex items-center justify-center gap-1.5 tactile-shadow-orange hover:translate-y-0.5 active:translate-y-1 transition-all" data-path="adapt-workspace" to="/setup">
          <span>Open Jobi</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
        <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 text-stone-700">
          <span className="material-symbols-outlined text-[18px]">account_circle</span>
        </div>
      </div>
    </div>
  </header>
  {/* MAIN WRAPPER */}
  <main className="w-full pt-16 bg-surface min-h-screen">
    {/* =========================================================================
   HERO SECTION: Warm porcelain canvas + tactile neo-minimalist badges
   ========================================================================= */}
    <section className="relative w-full overflow-hidden pt-12 pb-20 md:pb-28 border-b border-outline-variant/60 bg-gradient-to-b from-white via-surface-container-low to-surface">
      {/* Playful soft organic ambient blobs */}
      <div className="absolute top-12 left-1/4 w-96 h-96 bg-orange-100/60 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-24 right-10 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Copy Left (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-5">
            {/* Cheerful Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200 rounded-full shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="font-mono text-xs font-bold text-stone-800 tracking-wider uppercase">AIR-GAPPED LOCAL INFERENCE • LATEX NATIVE</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">100% Private</span>
            </div>
            {/* Main Headline with warm gradient tone */}
            <div className="flex flex-col gap-2">
              <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-[1.15]">
                Your authentic resume. <br />
                <span className="bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent">
                  Tailored for every dream job.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed pt-2">
                Jobi transforms your master resume into custom, role-aligned editions with pure mathematical LaTeX typography. Powered entirely on your machine without a single byte cloud-bound.
              </p>
            </div>
            {/* Bouncy CTA Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link className="h-12 px-6 bg-primary text-white font-bold text-sm tracking-wide rounded-full flex items-center justify-center gap-2 tactile-shadow-orange hover:translate-y-0.5 active:translate-y-1 transition-all group" data-path="adapt-workspace" to="/setup">
                <span>Build your resume</span>
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <a className="h-12 px-5 bg-white text-stone-700 font-bold text-sm rounded-full border border-stone-200 shadow-sm hover:bg-stone-50 hover:border-stone-300 transition-all flex items-center gap-2" href="#how-it-works">
                <span className="material-symbols-outlined text-[20px] text-blue-600">play_circle</span>
                <span>See how it works</span>
              </a>
            </div>
            {/* Fun tactile install pill */}
            <div className="w-full max-w-md flex items-center justify-between p-2 bg-white rounded-2xl border border-stone-200/90 shadow-sm" id="terminal-pill">
              <div className="flex items-center gap-2 pl-2 overflow-x-auto min-w-0">
                <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[15px]">terminal</span>
                </div>
                <code className="font-mono text-xs font-semibold text-stone-800 truncate" id="install-command">curl -fsSL https://get.jobi.dev | sh</code>
              </div>
              <button className="shrink-0 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-stone-700 font-mono text-[11px] font-bold rounded-xl border border-stone-200 transition-all active:scale-95 flex items-center gap-1" onClick={() => {}}>
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
                <span id="copy-label">COPY</span>
              </button>
            </div>
            {/* Joyful pipeline pill tags */}
            <div className="flex items-center gap-2 flex-wrap text-stone-600 font-mono text-xs pt-1">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-stone-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="font-semibold text-stone-700">MASTER RESUME</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-stone-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-semibold text-stone-700">ROLE SPEC</span>
              </div>
              <span className="material-symbols-outlined text-primary text-[18px]">arrow_forward</span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-fixed text-primary rounded-full font-bold border border-primary/20">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span>ADAPTED RESUME</span>
              </div>
            </div>
            {/* Tactile Trust Checklist */}
            <div className="flex items-center gap-4 text-stone-500 text-xs font-medium pt-1 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Zero cloud telemetry
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-blue-500">memory</span> Native TeXLive compile
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-orange-500">verified</span> 100% Truthful facts
              </span>
            </div>
          </div>
          {/* Hero Interactive Card Right (5 Cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative bg-white p-6 rounded-3xl border border-stone-200/80 tactile-shadow">
              {/* Floating playful stickers */}
              <div className="absolute -top-4 -right-3 bg-accent-yellow text-stone-900 font-bold text-xs px-3 py-1.5 rounded-full shadow-md rotate-3 border-2 border-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">star</span>
                <span>Local Core v2.4</span>
              </div>
              <div className="absolute -bottom-4 -left-3 bg-blue-600 text-white font-bold text-xs px-3 py-1.5 rounded-full shadow-md -rotate-2 border-2 border-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                <span>118ms compile</span>
              </div>
              {/* Top Bar of preview card */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400" />
                  <span className="text-xs font-mono font-medium text-stone-500 ml-2">Jobi Desktop Enclave</span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">LIVE</span>
              </div>
              {/* Mini interactive resume preview inside hero */}
              <div className="bg-surface-container-low p-4 rounded-2xl border border-stone-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-base text-stone-900">Alex Chen</div>
                    <div className="text-[11px] text-stone-500 font-mono">alex@chen.dev • San Francisco</div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-orange-100 text-primary font-bold text-[11px] rounded-lg border border-orange-200">
                      Match: 98.4%
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200/60 shadow-2xs space-y-1">
                  <div className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider">Quantized Highlight</div>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    "Architected high-throughput distributed runtime with <span className="bg-amber-100 text-amber-900 font-semibold px-1 rounded">CUDA acceleration</span>, cutting latency by <span className="bg-emerald-100 text-emerald-900 font-semibold px-1 rounded">58%</span>."
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 bg-white rounded-xl border border-stone-200/50">
                    <span className="block text-[10px] font-mono text-stone-400">LATEX DRIFT</span>
                    <span className="text-xs font-bold text-stone-800">0.00 pt</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200/50">
                    <span className="block text-[10px] font-mono text-stone-400">CLOUD REQ</span>
                    <span className="text-xs font-bold text-emerald-600">0 Packets</span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-stone-200/50">
                    <span className="block text-[10px] font-mono text-stone-400">DIFF CONF</span>
                    <span className="text-xs font-bold text-primary">99.1%</span>
                  </div>
                </div>
              </div>
              {/* Bottom interactive helper */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <span className="material-symbols-outlined text-[14px] text-primary">auto_awesome</span> Ready for export
                </span>
                <span className="font-mono text-[11px] font-semibold text-stone-700">PDF + TeX Synced</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 2 — THE PROBLEM: One resume isn't enough (4 Roles, 4 Lenses)
   ========================================================================= */}
    <section className="relative w-full py-20 bg-surface-container-low border-b border-outline-variant/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-mono text-xs text-primary font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Contextual Lens Alignment</span>
            </div>
            <h2 className="font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight">
              One career. Four roles demand four distinct lenses.
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md leading-relaxed">
            Jobi never fabricates achievements. It intelligently re-ranks, spotlights, and translates your genuine experience for the exact lens each hiring manager evaluates.
          </p>
        </div>
        {/* Role emphasis comparison interactive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Role Cards (AI/ML & Frontend Lead) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Role 1 */}
            <div className="role-selector-card p-5 bg-white rounded-2xl border-2 border-primary/40 tactile-card cursor-pointer transition-all hover:scale-[1.02] group" data-role="ml" onClick={() => {}}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">AI / ML Engineer</span>
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">psychology</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 mb-3 leading-relaxed">Emphasizes tensor acceleration, distributed training, and quantization.</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">PyTorch</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">CUDA</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">vLLM</span>
              </div>
            </div>
            {/* Role 2 */}
            <div className="role-selector-card p-5 bg-white rounded-2xl border border-stone-200 tactile-card cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/40 group" data-role="fe" onClick={() => {}}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Frontend Lead</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">layers</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 mb-3 leading-relaxed">Spotlights component architecture, render lifecycles, and design tokens.</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">TypeScript</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">Next.js</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">Design Systems</span>
              </div>
            </div>
          </div>
          {/* Center Interactive Master Resume Dynamic Lens Preview (6 Cols) */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-stone-200/90 tactile-shadow flex flex-col gap-5">
            {/* Header bar */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="font-mono text-xs font-bold text-stone-800" id="active-lens-title">LENS: AI / ML Systems Alignment</span>
              </div>
              <span className="font-mono text-xs font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200" id="alignment-score">
                MATCH: 97.4%
              </span>
            </div>
            {/* Paper Sheet Mockup */}
            <div className="p-6 bg-[#fffcf7] rounded-2xl border border-amber-200/40 shadow-xs space-y-4">
              {/* Name Header */}
              <div className="border-b border-stone-200 pb-3">
                <div className="font-extrabold text-xl text-stone-900 tracking-tight">ALEXANDER CHEN</div>
                <div className="font-mono text-xs text-stone-500 mt-0.5">San Francisco, CA • alex@chen.dev • github.com/alexchen</div>
              </div>
              {/* Summary with dynamic warm pill highlighting */}
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] font-bold text-primary tracking-wider uppercase">Professional Summary</div>
                <p className="text-xs text-stone-800 leading-relaxed p-3 bg-white rounded-xl border border-stone-200/60" id="resume-summary">
                  Systems architect with 7+ years developing <span className="bg-amber-100 text-amber-900 font-semibold px-1 rounded" id="hl-summary-tag">scalable distributed runtimes and neural graph optimizations</span>. Specializes in low-latency infrastructure and zero-copy memory abstractions.
                </p>
              </div>
              {/* Experience block */}
              <div className="space-y-2">
                <div className="font-mono text-[11px] font-bold text-primary tracking-wider uppercase">Target Experience</div>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-xs text-stone-900">Principal Infrastructure Engineer</span>
                  <span className="font-mono text-[11px] text-stone-500 font-medium">2021 — PRESENT</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-700 pl-1">
                  <li className="p-2 bg-white rounded-lg border border-stone-200/50 transition-all duration-300" id="bullet-1">
                    • <span className="text-stone-800" id="bullet-1-text">Architected distributed pipeline processing 4.2B daily vector inferences with 99.99% reliability.</span>
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-stone-200/50 transition-all duration-300" id="bullet-2">
                    • <span className="text-stone-800" id="bullet-2-text">Re-engineered model serving cluster, cutting p99 tail latency from 140ms down to 18ms on GPU nodes.</span>
                  </li>
                  <li className="p-2 bg-white rounded-lg border border-stone-200/50 transition-all duration-300" id="bullet-3">
                    • <span className="text-stone-800" id="bullet-3-text">Led internal developer platform migration, establishing deterministic build graphs for 65 engineers.</span>
                  </li>
                </ul>
              </div>
              {/* Skills vector chips */}
              <div className="space-y-2 pt-1 border-t border-stone-200/60">
                <div className="font-mono text-[11px] font-bold text-primary tracking-wider uppercase">Re-Weighted Skill Vector</div>
                <div className="flex flex-wrap gap-1.5" id="skill-chips-container">
                  <span className="px-2.5 py-1 bg-primary text-white font-mono text-[11px] font-semibold rounded-lg shadow-2xs">PyTorch 2.x</span>
                  <span className="px-2.5 py-1 bg-primary text-white font-mono text-[11px] font-semibold rounded-lg shadow-2xs">Distributed CUDA</span>
                  <span className="px-2.5 py-1 bg-white text-stone-700 font-mono text-[11px] font-medium rounded-lg border border-stone-200">Rust</span>
                  <span className="px-2.5 py-1 bg-white text-stone-700 font-mono text-[11px] font-medium rounded-lg border border-stone-200">Kubernetes</span>
                </div>
              </div>
            </div>
            {/* Helpful notice */}
            <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
              <span className="material-symbols-outlined text-[16px] text-amber-500">lightbulb</span>
              <span>Click either role card to see the real-time dynamic semantic re-weighting.</span>
            </div>
          </div>
          {/* Right Role Cards (Product Analyst & Staff Systems) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Role 3 */}
            <div className="role-selector-card p-5 bg-white rounded-2xl border border-stone-200 tactile-card cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/40 group" data-role="pa" onClick={() => {}}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Product Analyst</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">query_stats</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 mb-3 leading-relaxed">Prioritizes user retention, A/B cohort velocities, and query optimization.</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">BigQuery</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">Growth Models</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">Cohort LTV</span>
              </div>
            </div>
            {/* Role 4 */}
            <div className="role-selector-card p-5 bg-white rounded-2xl border border-stone-200 tactile-card cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/40 group" data-role="se" onClick={() => {}}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors">Staff Systems Engineer</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">dns</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 mb-3 leading-relaxed">Highlights eBPF network hooks, cache-miss profiling, and Linux kernel tuning.</p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">Rust</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">Linux Kernel</span>
                <span className="px-2 py-0.5 bg-stone-100 font-mono text-[11px] font-semibold text-stone-700 rounded-md">eBPF</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 3 — HOW JOBI WORKS (Cinematic 4-Step Pipeline)
   ========================================================================= */}
    <section className="relative w-full py-24 bg-surface border-b border-outline-variant/60" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <div className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Deterministic Local Execution</span>
          </div>
          <h2 className="font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight">
            How Jobi works under the hood. No hand-waving.
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            From raw input document to verified LaTeX compilation in four mathematically bounded stages, running purely on your local neural engine.
          </p>
        </div>
        {/* 4 Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* STEP 01: INGESTION */}
          <div className="p-6 bg-surface-container-low rounded-3xl border border-stone-200 tactile-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-primary text-white rounded-full">01 INGESTION</span>
                <span className="font-bold text-sm text-stone-900">AST Semantic Parser</span>
              </div>
              <span className="font-mono text-xs font-semibold text-stone-500">4.2ms parse</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Accepts <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded text-blue-600 font-semibold border border-stone-200">.pdf</code>, <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded text-blue-600 font-semibold border border-stone-200">.tex</code>, or <code className="font-mono text-[11px] bg-white px-1 py-0.5 rounded text-blue-600 font-semibold border border-stone-200">.docx</code>. Parses into structured Syntax Trees without lossy flattening.
            </p>
            {/* Visual Tree Node Map */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex flex-col gap-2">
              <div className="flex items-center justify-between font-mono text-[11px] text-stone-500 pb-1 border-b border-stone-100">
                <span>ROOT: DocumentAST</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span> TREE_VALID
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="p-2 bg-orange-50/70 border border-orange-100 rounded-xl flex flex-col">
                  <span className="font-mono text-[10px] text-primary font-bold">NODE_01</span>
                  <span className="font-bold text-xs text-stone-800">Summary</span>
                  <span className="font-mono text-[10px] text-stone-400">1 Block</span>
                </div>
                <div className="p-2 bg-blue-50/70 border border-blue-100 rounded-xl flex flex-col">
                  <span className="font-mono text-[10px] text-blue-600 font-bold">NODE_02</span>
                  <span className="font-bold text-xs text-stone-800">WorkExp</span>
                  <span className="font-mono text-[10px] text-stone-400">14 Bullets</span>
                </div>
                <div className="p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl flex flex-col">
                  <span className="font-mono text-[10px] text-emerald-600 font-bold">NODE_03</span>
                  <span className="font-bold text-xs text-stone-800">Skills</span>
                  <span className="font-mono text-[10px] text-stone-400">28 Tokens</span>
                </div>
                <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl flex flex-col">
                  <span className="font-mono text-[10px] text-purple-600 font-bold">NODE_04</span>
                  <span className="font-bold text-xs text-stone-800">Education</span>
                  <span className="font-mono text-[10px] text-stone-400">2 Degrees</span>
                </div>
              </div>
            </div>
          </div>
          {/* STEP 02: DECOMPOSE */}
          <div className="p-6 bg-surface-container-low rounded-3xl border border-stone-200 tactile-card flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-blue-600 text-white rounded-full">02 DECOMPOSE</span>
                <span className="font-bold text-sm text-stone-900">Spec Vector Extraction</span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">96.8% OVERLAP</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              Extracts high-dimensional intent tokens from the target job posting and performs purely local cosine similarity matching.
            </p>
            {/* Vector Matching Visual */}
            <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex flex-col gap-2.5">
              <div className="flex justify-between font-mono text-[11px] text-stone-500 pb-1 border-b border-stone-100">
                <span>Target Spec Requirements</span>
                <span>Affinity Score</span>
              </div>
              <div className="space-y-2 pt-1">
                <div>
                  <div className="flex justify-between font-mono text-[11px] text-stone-700 mb-1">
                    <span>Distributed Training (DDP / FSDP)</span>
                    <span className="font-bold text-primary">98%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '98%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-mono text-[11px] text-stone-700 mb-1">
                    <span>Latency Profiling &amp; Optimization</span>
                    <span className="font-bold text-primary">94%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{width: '94%'}} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-mono text-[11px] text-stone-700 mb-1">
                    <span>Kernel Memory Layout</span>
                    <span className="font-bold text-blue-600">88%</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{width: '88%'}} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* STEP 03: ADAPT (Full Width Precision Bullet Optimizer) */}
          <div className="md:col-span-2 p-6 bg-surface-container-low rounded-3xl border border-stone-200 tactile-card flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-amber-500 text-stone-950 rounded-full">03 ADAPTATION</span>
                <span className="font-bold text-base text-stone-900">Granular Precision Bullet Optimizer</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-white hover:bg-stone-50 text-stone-700 font-mono text-xs font-semibold rounded-full border border-stone-200 transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">edit</span> EDIT INLINE
                </button>
                <button className="px-3 py-1 bg-primary text-white font-mono text-xs font-semibold rounded-full shadow-2xs hover:bg-orange-600 transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check</span> ACCEPT CHANGE
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Original */}
              <div className="p-4 bg-white rounded-2xl border border-rose-200/70 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-rose-600 tracking-wider uppercase">ORIGINAL MASTER RESUME</span>
                  <span className="font-mono text-[10px] text-stone-400">BASELINE</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                  "Developed a web application using React and Node.js for team tracking."
                </p>
                <div className="text-[11px] text-stone-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-stone-400">info</span>
                  Lacks quantified business metric and architectural rigor.
                </div>
              </div>
              {/* Right: Adapted */}
              <div className="p-4 bg-white rounded-2xl border border-emerald-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-emerald-700 tracking-wider uppercase">ADAPTED CANDIDATE // COMPILED</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">OPTIMIZED</span>
                </div>
                <p className="text-xs text-stone-900 leading-relaxed p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  "Developed a <span className="bg-amber-100 text-amber-900 font-semibold px-1 rounded">high-throughput reactive web application</span> using React and Node.js, engineering reusable component hierarchies with <span className="bg-emerald-100 text-emerald-900 font-bold px-1 rounded">40% reduced render cycles</span>."
                </p>
                <div className="p-2 bg-stone-50 rounded-xl text-stone-600 text-[11px] flex items-start gap-1.5 border border-stone-200/60">
                  <span className="material-symbols-outlined text-[15px] text-primary shrink-0">auto_awesome</span>
                  <span>Reason: Target JD prioritizes component state efficiency and benchmarked metric improvements.</span>
                </div>
              </div>
            </div>
          </div>
          {/* STEP 04: EXPORT (Full Width) */}
          <div className="md:col-span-2 p-6 bg-surface-container-low rounded-3xl border border-stone-200 tactile-card flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold px-2.5 py-1 bg-emerald-600 text-white rounded-full">04 EXPORT</span>
                <span className="font-bold text-base text-stone-900">Dual Native TeXLive &amp; PDF Compilation</span>
              </div>
              <span className="font-mono text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                TEX COMPILE: 118ms LOCAL
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Source Export Card */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-1">
                    <span className="material-symbols-outlined text-blue-600 text-[18px]">code</span>
                    <span>resume.tex</span>
                  </div>
                  <p className="text-xs text-stone-600">Includes clean macros and SyncTeX synchronization flags.</p>
                </div>
                <button className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[15px]">download</span> DOWNLOAD SOURCE
                </button>
              </div>
              {/* PDF Vector Card */}
              <div className="p-4 bg-white rounded-2xl border-2 border-primary/30 flex flex-col justify-between gap-3 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">picture_as_pdf</span>
                    <span>resume.pdf</span>
                  </div>
                  <p className="text-xs text-stone-600">Pure PDF/A typography standard. Pristine ATS-friendly output.</p>
                </div>
                <button className="w-full py-2 bg-primary hover:bg-orange-600 text-white font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors tactile-shadow-orange">
                  <span className="material-symbols-outlined text-[15px]">download</span> DOWNLOAD PDF (ATS-READY)
                </button>
              </div>
              {/* AST JSON Card */}
              <div className="p-4 bg-white rounded-2xl border border-stone-200/80 flex flex-col justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm mb-1">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">data_object</span>
                    <span>resume.ast.json</span>
                  </div>
                  <p className="text-xs text-stone-600">Structured syntax tree for programmatic CI/CD version control.</p>
                </div>
                <button className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-mono text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors">
                  <span className="material-symbols-outlined text-[15px]">content_copy</span> COPY JSON SCHEMA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 4 — LATEX EXPERIENCE ("Your template stays yours.")
   ========================================================================= */}
    <section className="relative w-full py-24 bg-surface-container-low border-b border-outline-variant/60" id="latex">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Mathematical Typesetting</span>
            </div>
            <h2 className="font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight">
              Your template stays yours. Zero broken margins.
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md leading-relaxed">
            No messy web WYSIWYG tables. No shifting line wraps. Jobi modifies strictly the semantic token payload inside your existing TeX macros, preserving point sizes down to the sub-millimeter.
          </p>
        </div>
        {/* Interactive Dual Pane TeX Editor + Live Compiled PDF */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 tactile-shadow">
          {/* Code Editor Window (Left 6 Cols) */}
          <div className="lg:col-span-6 bg-[#faf8f5] rounded-2xl border border-stone-200/90 overflow-hidden flex flex-col">
            {/* Window Bar */}
            <div className="px-4 py-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="font-mono text-xs font-semibold text-stone-600 ml-2">resume_canonical.tex</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-white text-stone-700 rounded-md border border-stone-200">TeXLive 2024</span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">SyncTeX: ON</span>
              </div>
            </div>
            {/* Code Body */}
            <div className="p-4 font-mono text-xs overflow-x-auto flex gap-3 leading-relaxed">
              <div className="flex flex-col text-stone-300 text-right select-none pr-1">
                <span>01</span><span>02</span><span>03</span><span>04</span><span>05</span>
                <span>06</span><span>07</span><span>08</span><span>09</span><span>10</span>
                <span>11</span><span>12</span><span>13</span><span>14</span><span>15</span>
              </div>
              <div className="flex flex-col text-stone-700 min-w-0">
                <div><span className="text-blue-600 font-bold">\documentclass</span>[letterpaper,10pt]{'{'}<span className="text-primary font-bold">article</span>{'}'}</div>
                <div><span className="text-blue-600 font-bold">\usepackage</span>{'{'}<span className="text-emerald-700">latexsym, fullpage, hyperref</span>{'}'}</div>
                <div><span className="text-blue-600 font-bold">\begin</span>{'{'}<span className="text-primary font-bold">document</span>{'}'}</div>
                <div className="text-stone-400">% Semantic Experience Injection Point</div>
                <div><span className="text-blue-600 font-bold">\resumeSubheading</span></div>
                <div className="pl-4">{'{'}<span className="text-stone-900 font-bold">Staff Distributed Systems Engineer</span>{'}'}{'{'}2021 -- Present{'}'}</div>
                <div className="pl-4">{'{'}<span className="text-primary font-semibold">VectorStream AI</span>{'}'}{'{'}San Francisco, CA{'}'}</div>
                <div><span className="text-blue-600 font-bold">\resumeItemListStart</span></div>
                <div className="pl-4 bg-orange-100/70 text-stone-900 rounded py-0.5 -mx-1 px-1 border-l-2 border-primary">
                  <span className="text-blue-600 font-bold">\resumeItem</span>{'{'}Optimized distributed runtime inference engine using <span className="font-bold text-primary">\textbf{'{'}CUDA + PyTorch{'}'}</span>, achieving <span className="font-bold text-primary">\textbf{'{'}78\% lower memory footprint{'}'}</span>.{'}'}
                </div>
                <div className="pl-4">
                  <span className="text-blue-600 font-bold">\resumeItem</span>{'{'}Maintained zero memory regressions across 400+ weekly continuous deployment workflows.{'}'}
                </div>
                <div><span className="text-blue-600 font-bold">\resumeItemListEnd</span></div>
                <div><span className="text-blue-600 font-bold">\end</span>{'{'}<span className="text-primary font-bold">document</span>{'}'}</div>
                <div className="flex items-center gap-1.5 mt-2 text-primary font-mono text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span>HOT RELOAD READY (WATCHER ACTIVE)</span>
                </div>
              </div>
            </div>
          </div>
          {/* Live Recompiled Document Window (Right 6 Cols) */}
          <div className="lg:col-span-6 bg-surface-container-low rounded-2xl border border-stone-200 p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 mb-3">
              <span className="font-mono text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                LIVE PDF ENGINE (120ms)
              </span>
              <div className="flex items-center gap-2 text-stone-500 font-mono text-[11px]">
                <span>100% SCALE</span>
                <span className="material-symbols-outlined text-[16px]">zoom_in</span>
              </div>
            </div>
            {/* Paper Sheet Preview */}
            <div className="bg-white p-6 rounded-xl border border-stone-200/90 shadow-sm space-y-4 text-xs text-stone-800">
              <div className="text-center pb-2 border-b border-stone-200">
                <h3 className="font-extrabold text-base text-stone-900 tracking-wide">ALEXANDER CHEN</h3>
                <p className="font-mono text-[11px] text-stone-500">alex@chen.dev • (415) 890-2194 • San Francisco, CA</p>
              </div>
              <div className="space-y-1.5">
                <div className="font-mono text-[11px] font-bold text-stone-900 tracking-wider">EXPERIENCE</div>
                <div className="flex justify-between items-baseline font-bold text-stone-900">
                  <span>Staff Distributed Systems Engineer — VectorStream AI</span>
                  <span className="font-mono text-[10px] text-stone-500 font-normal">2021 — PRESENT</span>
                </div>
                <ul className="space-y-1 pl-4 list-disc text-stone-700">
                  <li>
                    Optimized distributed runtime inference engine using <strong className="text-primary font-bold">CUDA + PyTorch</strong>, achieving <strong className="text-primary font-bold">78% lower memory footprint</strong> across production GPU clusters.
                  </li>
                  <li>
                    Maintained zero memory regressions across 400+ weekly continuous deployment workflows with deterministic regression fuzzing.
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-stone-100 font-mono text-[10px] text-stone-500">
                <span>Output: PDF/X-1a Certified</span>
                <span className="text-emerald-700 font-bold">0 Overflow Warnings (0 Underfull \hbox)</span>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-stone-500">
              <span>Native ARM64 / x86_64</span>
              <button className="px-3 py-1 bg-white hover:bg-stone-100 text-stone-800 rounded-full border border-stone-200 font-bold flex items-center gap-1 transition-all">
                <span className="material-symbols-outlined text-[14px]">refresh</span> RECOMPILE
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 5 — PRIVACY BOUNDARY ("AI that stays on your machine.")
   ========================================================================= */}
    <section className="relative w-full py-24 bg-surface border-b border-outline-variant/60" id="privacy">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <span className="material-symbols-outlined text-[15px]">lock</span>
            <span>Air-Gapped Execution Enclave</span>
          </div>
          <h2 className="font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight">
            AI that stays strictly on your machine.
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Your career trajectory is confidential personal intellectual property. Jobi compiles everything in local hardware cache. Zero external telemetry. Zero remote LLM prompts.
          </p>
        </div>
        {/* Air-Gap Visual Enclave Diagram */}
        <div className="relative w-full p-6 sm:p-8 bg-surface-container-low rounded-3xl border border-stone-200 tactile-shadow flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Protected Local Enclave (Left) */}
          <div className="w-full lg:w-7/12 p-6 bg-white rounded-2xl border-2 border-emerald-400/80 shadow-sm flex flex-col gap-5 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-xs font-extrabold text-emerald-800 tracking-wide uppercase">LOCAL SECURE ENCLAVE // ON-DEVICE</span>
              </div>
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">STATUS: ISOLATED</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">description</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">Master Resume AST</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Encrypted at rest in local RAM session memory.</p>
                </div>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">dataset</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">Target Job Spec</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Evaluated purely in ephemeral local heap.</p>
                </div>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">neurology</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">Quantized Local LLM</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Llama-3-Jobi-8B via Ollama / Metal Accel.</p>
                </div>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200/70 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">build_circle</span>
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">Native TeX Compiler</div>
                  <p className="text-[11px] text-stone-500 mt-0.5">Binary compile via local TeX subsystem.</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 rounded-xl text-emerald-800 font-mono text-xs border border-emerald-200/70">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
              <span>Zero external sockets opened. Verified with Little Snitch &amp; Wireshark.</span>
            </div>
          </div>
          {/* Disconnect Divider Wall */}
          <div className="flex lg:flex-col items-center justify-center gap-2 text-rose-500 py-2">
            <span className="w-8 lg:w-0.5 h-0.5 lg:h-8 bg-stone-300" />
            <div className="p-2.5 bg-rose-100 text-rose-700 rounded-full shadow-sm flex items-center justify-center border border-rose-200">
              <span className="material-symbols-outlined text-[20px]">cloud_off</span>
            </div>
            <span className="font-mono text-[10px] font-bold text-rose-600 tracking-wider">AIR-GAP WALL</span>
            <span className="w-8 lg:w-0.5 h-0.5 lg:h-8 bg-stone-300" />
          </div>
          {/* Severed Remote Cloud (Right) */}
          <div className="w-full lg:w-4/12 p-6 bg-white/60 rounded-2xl border border-stone-200/70 flex flex-col gap-4 opacity-75">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-rose-700 tracking-wide uppercase">EXTERNAL CLOUD // CUT</span>
              <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">BLOCKED (0 KB)</span>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-stone-400 line-through">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">cloud_queue</span> Remote OpenAI / Claude APIs
                </span>
                <span className="material-symbols-outlined text-rose-500 text-[16px]">block</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-stone-400 line-through">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">analytics</span> Third-Party Telemetry
                </span>
                <span className="material-symbols-outlined text-rose-500 text-[16px]">block</span>
              </div>
              <div className="p-3 bg-stone-100 rounded-xl flex items-center justify-between text-stone-400 line-through">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">database</span> Cloud Embeddings Vectors
                </span>
                <span className="material-symbols-outlined text-rose-500 text-[16px]">block</span>
              </div>
            </div>
            <p className="font-mono text-[11px] text-stone-400">
              Outgoing traffic rejected by deterministic kernel namespace policy.
            </p>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 6 — ADAPTATION REVIEW & CHERRY-PICK DIFF
   ========================================================================= */}
    <section className="relative w-full py-24 bg-surface-container-low border-b border-outline-variant/60" id="diffs">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Deterministic Changes</span>
            </div>
            <h2 className="font-extrabold text-3xl md:text-4xl text-on-surface tracking-tight">
              Review changes like clean code. Cherry-pick every line.
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white hover:bg-stone-50 text-stone-700 font-mono text-xs font-bold rounded-full border border-stone-200 transition-colors">
              REJECT ALL
            </button>
            <button className="px-4 py-2 bg-primary hover:bg-orange-600 text-white font-mono text-xs font-bold rounded-full tactile-shadow-orange transition-colors">
              ACCEPT 8 PROPOSED EDITS
            </button>
          </div>
        </div>
        {/* Diff Review Panel */}
        <div className="bg-white rounded-3xl border border-stone-200 tactile-shadow overflow-hidden flex flex-col">
          {/* Commit Header */}
          <div className="px-6 py-3.5 bg-[#faf8f5] border-b border-stone-200 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="text-stone-900 font-bold">Commit: Target "Stripe - Staff Core Infrastructure"</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold">+142 additions</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-bold">-68 deletions</span>
            </div>
            <span className="font-mono text-[11px] text-stone-500 font-medium">AST Node Integrity: 100% Valid</span>
          </div>
          {/* Diff Items List */}
          <div className="p-6 flex flex-col gap-4">
            {/* Diff 1: Summary */}
            <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-900">SECTION: PROFESSIONAL SUMMARY</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-stone-500">Confidence: 98%</span>
                  <input defaultChecked className="accent-primary w-4 h-4 cursor-pointer" type="checkbox" />
                </div>
              </div>
              <div className="text-xs flex flex-col gap-1.5 font-mono">
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-900 rounded-xl">
                  - Experienced generalist engineer leading technical projects across diverse stacks.
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-xl font-medium">
                  + Staff Infrastructure Engineer with 7+ years designing high-throughput distributed payment settlement engines and zero-downtime ledger pipelines.
                </div>
              </div>
            </div>
            {/* Diff 2: Experience Item 01 */}
            <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-900">SECTION: EXPERIENCE // BULLET 01</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-stone-500">Confidence: 96%</span>
                  <input defaultChecked className="accent-primary w-4 h-4 cursor-pointer" type="checkbox" />
                </div>
              </div>
              <div className="text-xs flex flex-col gap-1.5 font-mono">
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-900 rounded-xl">
                  - Built service for handling transaction webhook alerts and logging.
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-xl font-medium">
                  + Architected resilient event-driven webhook dispatch broker handling 180,000 req/sec with exactly-once delivery semantics in Rust.
                </div>
              </div>
            </div>
            {/* Diff 3: Experience Item 02 */}
            <div className="p-4 bg-stone-50/80 rounded-2xl border border-stone-200 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-stone-900">SECTION: EXPERIENCE // BULLET 02</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-stone-500">Confidence: 94%</span>
                  <input defaultChecked className="accent-primary w-4 h-4 cursor-pointer" type="checkbox" />
                </div>
              </div>
              <div className="text-xs flex flex-col gap-1.5 font-mono">
                <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-900 rounded-xl">
                  - Reduced database query times through indexing.
                </div>
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 text-emerald-950 rounded-xl font-medium">
                  + Mitigated lock contention on primary ledger tables via partitioned B-trees and read-replicas, slashing p99 transaction commit latency by 58%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 7 & 8 — MATCH DIAGNOSTIC & BRANCH GRAPH
   ========================================================================= */}
    <section className="relative w-full py-24 bg-surface border-b border-outline-variant/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Match Breakdown Semantic Radar (Left 6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div>
              <div className="font-mono text-xs font-bold text-primary uppercase tracking-wider mb-1">Telemetric Diagnostic</div>
              <h3 className="font-extrabold text-2xl text-on-surface tracking-tight">
                Semantic Match Decomposition
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Deterministic parsing evaluates match vectors across keyword, syntactic, and structural dimensions.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-3xl border border-stone-200 tactile-card flex flex-col gap-5">
              {/* Item 1 */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">Strong Alignment (94%)</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">OPTIMAL</span>
                </div>
                <p className="text-xs text-stone-600">Distributed systems, concurrency primitives, low-latency memory layout, Linux profiling.</p>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{width: '94%'}} />
                </div>
              </div>
              {/* Item 2 */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">Partial Alignment (82%)</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">SATISFIED</span>
                </div>
                <p className="text-xs text-stone-600">Public cloud migrations, multi-region database replication, PCI compliance audits.</p>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-blue-500 rounded-full" style={{width: '82%'}} />
                </div>
              </div>
              {/* Item 3 */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-stone-900">Opportunity Gaps (2 items)</span>
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full">NON-BLOCKING</span>
                </div>
                <p className="text-xs text-stone-600">Target role cites Apache Kafka; your experience highlights Redis Streams &amp; NATS.</p>
                <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-400 rounded-full" style={{width: '45%'}} />
                </div>
              </div>
            </div>
          </div>
          {/* Version History Tree (Right 6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div>
              <div className="font-mono text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Git-Grade Provenance</div>
              <h3 className="font-extrabold text-2xl text-on-surface tracking-tight">
                Resume Branch Graph
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Every job adaptation generates an isolated branch retaining complete diff history back to your Master Resume.
              </p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-3xl border border-stone-200 tactile-card flex flex-col gap-4 font-mono text-xs">
              {/* Root master node */}
              <div className="flex items-start gap-3 p-3.5 bg-white rounded-2xl border border-stone-200">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">account_tree</span>
                </div>
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-900 font-bold">master (Canonical Resume)</span>
                    <span className="text-stone-400 text-[11px]">commit 9cf48a</span>
                  </div>
                  <span className="text-stone-500 text-[11px] font-sans">4 roles, 18 projects, 32 verified skills</span>
                </div>
              </div>
              {/* Branches */}
              <div className="flex flex-col gap-2 pl-4 border-l-2 border-dashed border-stone-200 ml-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-stone-800 font-bold">google/staff-swe-infra</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">COMPILED</span>
                    <span className="text-stone-400 text-[11px]">2h ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span className="text-stone-800 font-bold">anthropic/ml-systems-core</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">COMPILED</span>
                    <span className="text-stone-400 text-[11px]">1d ago</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-stone-200 hover:border-amber-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-stone-800 font-bold">stripe/platform-lead</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full">COMPILED</span>
                    <span className="text-stone-400 text-[11px]">3d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/* =========================================================================
   SECTION 9 — JOYFUL FINAL CALL TO ACTION
   ========================================================================= */}
    <section className="relative w-full py-24 bg-gradient-to-b from-surface-container-low to-white overflow-hidden text-center">
      <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-5">
        <div className="font-mono text-xs font-bold px-3 py-1 bg-amber-100 text-amber-900 border border-amber-200 rounded-full uppercase tracking-wider">
          ZERO CLOUD ACCOUNTS • NO CREDIT CARD • INSTANT LOCAL RUNTIME
        </div>
        <h2 className="font-extrabold text-4xl sm:text-5xl text-on-surface tracking-tight leading-tight">
          One resume. <br />
          <span className="bg-gradient-to-r from-primary via-orange-500 to-blue-600 bg-clip-text text-transparent">
            Every dream opportunity.
          </span>
        </h2>
        <p className="text-base text-stone-600 max-w-lg leading-relaxed">
          Stop submitting generic resumes into automated black-box screening systems. Keep your genuine career trajectory private on your device and export tailored editions in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link className="h-12 px-8 bg-primary text-white font-bold text-sm tracking-wide rounded-full flex items-center justify-center gap-2 tactile-shadow-orange hover:translate-y-0.5 active:translate-y-1 transition-all group" data-path="adapt-workspace" to="/setup">
            <span>Get Started</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-stone-500 font-mono text-xs pt-3">
          <span>Prefer CLI workflow?</span>
          <code className="px-2.5 py-1 bg-white border border-stone-200 text-primary font-bold rounded-lg shadow-2xs">brew install jobi/tap/jobi</code>
        </div>
      </div>
    </section>
  </main>
  {/* FOOTER */}
  <footer className="w-full bg-surface-container-low border-t border-outline-variant/80">
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-primary/10 p-0.5 border border-primary/20">
              <img alt="Jobi Mascot Logo" className="w-full h-full object-contain" src="/jobi-logo.svg" />
            </div>
            <span className="font-bold text-lg text-on-surface">Jobi</span>
          </div>
          <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
            Jobi — Local-first, privacy-native AI resume adapter. Your career data remains yours forever. Zero external telemetry, 100% on-device mathematical compilation.
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-white text-stone-700 rounded-md border border-stone-200">LOCAL COMPILER</span>
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">ZERO CLOUD RETENTION</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-stone-900 uppercase tracking-wider font-bold">Product</span>
          <ul className="flex flex-col gap-1.5 text-xs text-stone-600">
            <li className="hover:text-primary transition-colors cursor-pointer">Adapter Engine</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Local Models</li>
            <li className="hover:text-primary transition-colors cursor-pointer">LaTeX Matrix</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Diff Inspector</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-stone-900 uppercase tracking-wider font-bold">Security &amp; Privacy</span>
          <ul className="flex flex-col gap-1.5 text-xs text-stone-600">
            <li className="hover:text-primary transition-colors cursor-pointer">Zero Telemetry</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Air-gapped Sandbox</li>
            <li className="hover:text-primary transition-colors cursor-pointer">Local Embeddings</li>
            <li className="hover:text-primary transition-colors cursor-pointer">SOC2 Attestation</li>
          </ul>
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs text-stone-900 uppercase tracking-wider font-bold">Resources</span>
          <ul className="flex flex-col gap-1.5 text-xs text-stone-600">
            <li className="hover:text-primary transition-colors cursor-pointer">Documentation</li>
            <li className="hover:text-primary transition-colors cursor-pointer">LaTeX Templates</li>
            <li className="hover:text-primary transition-colors cursor-pointer">CLI Tools</li>
            <li className="hover:text-primary transition-colors cursor-pointer">GitHub</li>
          </ul>
        </div>
      </div>
      <div className="pt-6 border-t border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <div>© 2025 Jobi Core Systems. Built with warm precision. Nothing leaves your machine.</div>
        <div className="flex items-center gap-2 px-3 py-1 bg-white border border-stone-200 rounded-full font-mono text-[11px] text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Inference Engine: ACTIVE (Ollama / Metal Accel)</span>
        </div>
      </div>
    </div>
  </footer>
  {/* Interactive Script for Role Lens Simulation */}
</div>


    </>
  );
}
