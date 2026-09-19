const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'resume_adapt.db');
const db = new DatabaseSync(dbPath);

const latexCode = `\\documentclass[letterpaper,10pt]{article}
\\usepackage{latexsym,fullpage,hyperref,titlesec,enumitem}
\\usepackage[margin=0.5in]{geometry}

\\newcommand{\\heading}[3]{
  \\begin{center}
    {\\Huge \\textbf{#1}} \\\\ \\vspace{4pt}
    {#2} \\\\ \\vspace{2pt}
    \\href{https://#3}{#3}
  \\end{center}
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{2pt}\\noindent
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-5pt}
}

\\newcommand{\\resumeItemListStart}{\\begin{itemize}[leftmargin=0.15in, label={--}]}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}
\\newcommand{\\resumeItem}[1]{\\item\\small{#1 \\vspace{-2pt}}}

\\begin{document}
\\heading{Mohammed Nihal}{AI Software Engineer}{linkedin.com/in/iam-nih4l}

\\section*{Professional Summary}
AI Software Engineer focused on Generative AI, multi-agent reasoning frameworks, and scalable AI systems. Blends a rigorous technical foundation in machine learning and computational psychology with a product-driven approach. Proven track record of architecting AI workflows and optimizing data pipelines to build high-impact applications.

\\section*{Education}
\\resumeSubheading
  {Sahyadri College of Engineering \\& Management}{Sep 2023 -- Sep 2027}
  {Bachelor of Technology (BTech) in Artificial Intelligence}{Mangaluru, India}
\\resumeItemListStart
  \\resumeItem{\\textbf{Involvement:} Creative Lead at Synergia National Tech Fest, Zenken Club.}
\\resumeItemListEnd

\\section*{Technical Expertise}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\resumeItem{\\textbf{Languages:} Python, Java, C++, TypeScript, SQL, Bash}
  \\resumeItem{\\textbf{AI/ML \\& GenAI:} Multi-Agent Systems, RAG, OpenAI API, Gemini API, Prompt Engineering, LLM Evaluation}
  \\resumeItem{\\textbf{Backend \\& Systems:} REST API Development, Distributed Architecture, Vector Databases, Time-Series Analysis}
  \\resumeItem{\\textbf{Developer Tools:} Git, Docker, PyTorch, TensorFlow, System Design, UiPath}
\\end{itemize}

\\section*{Engineering \\& AI Projects}
\\resumeSubheading
  {CouncilAI}{2026}
  {Python, Agentic Reasoning, Multi-Modal Models, System Design}{}
\\resumeItemListStart
  \\resumeItem{\\textbf{Designed and implemented} a high-performance distributed system leveraging PyTorch and CUDA for efficient processing of large-scale medical imaging datasets, including MRI, CT, and X-ray analysis pipelines.}
  \\resumeItem{\\textbf{Designed and implemented} a low-latency C++ streaming framework for agentic reasoning in PyTorch, leveraging model councils to debate and synthesize diagnostic outputs, resulting in improved complex inference reliability.}
  \\resumeItem{\\textbf{Designed and implemented} a real-time anomaly detection system using PyTorch, leveraging CUDA for accelerated computations, to identify multivariate telemetry irregularities in simulated spacecraft environments.}
  \\resumeItem{\\textbf{Designed and implemented} PyTorch-based LSTM networks for real-time streaming data analysis, leveraging CUDA acceleration to optimize model performance and achieve low-latency results in a C++ streaming environment.}
  \\resumeItem{\\textbf{Designed and implemented} a PyTorch-based evaluation framework to benchmark and quantify hallucination rates of open-source Large Language Models (LLMs) under various adversarial prompt injections, leveraging expertise in low latency C++ streaming.}
  \\resumeItem{Designed data pipelines to stress-test RAG systems, systematically pinpointing failure modes in context synthesis and generating reproducible safety benchmarks.}
\\resumeItemListEnd

\\resumeSubheading
  {SocietyAI}{2024}
  {Python, Ray, Redis, Semantic Memory, React}{}
\\resumeItemListStart
  \\resumeItem{Developed an immersive, agentic social simulation environment orchestrating autonomous AI entities capable of long-term memory, planning, and emergent social interactions.}
  \\resumeItem{Designed the state-management backend leveraging Redis to maintain agent context, alongside a vector database architecture for semantic memory retrieval.}
\\resumeItemListEnd

\\section*{Professional Experience}
\\resumeSubheading
  {Social Media Manager \\& Content Creator}{Dec 2025 -- Mar 2026}
  {ASTRAZEN INTERIORS (Freelance)}{United Arab Emirates (Remote)}
\\resumeItemListStart
  \\resumeItem{Automated digital workflows to streamline asset scheduling and deployment, optimizing content delivery pipelines.}
  \\resumeItem{Analyzed audience reach and engagement metrics to enhance performance and direct data-driven digital strategy.}
\\resumeItemListEnd

\\resumeSubheading
  {Multimedia Editor \\& Creative Lead}{Sep 2023 -- Nov 2025}
  {Synergia Sahyadri (Freelance)}{Mangaluru, India}
\\resumeItemListStart
  \\resumeItem{Managed tight deadlines and coordinated complex content workflows across multiple phases for a national-level tech event.}
  \\resumeItem{Collaborated closely with cross-functional organizers to ensure consistent storytelling and visual branding across all digital platforms.}
\\resumeItemListEnd

\\section*{Certifications \\& Job Simulations}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\resumeItem{\\textbf{AI \\& Development:} Build with AI Bootcamp (Google for Developers) $\\cdot$ GEN AI Camp (AlgoUniversity) $\\cdot$ Prompt Engineering (Dubai Future Foundation)}
  \\resumeItem{\\textbf{Software Engineering Simulations:} JPMorgan Chase \\& Co. (REST API, Java) $\\cdot$ Electronic Arts (Data Structures)}
  \\resumeItem{\\textbf{Automation \\& Product:} UiPath Automation Workshop $\\cdot$ Action AI Startup University: AI Essentials}
\\end{itemize}

\\end{document}
`;

try {
  const stmt = db.prepare('UPDATE master_resumes SET title = ?, raw_latex = ? WHERE id = 1');
  stmt.run('Mohammed Nihal — Master Profile', latexCode);
  console.log("Successfully updated database with Nihal's resume");
} catch(e) {
  console.error('Failed to update DB:', e);
}
