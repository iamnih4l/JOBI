// Jobi Deterministic Extraction, Matching & ATS Engine (Local-First)

export interface ResumeSection {
  name: string;
  content: string;
  type: "experience" | "education" | "skills" | "summary" | "projects" | "other";
  items?: string[];
}

export interface ParsedResume {
  rawLatex: string;
  sections: ResumeSection[];
  extractedSkills: string[];
  bulletItems: string[];
}

export interface JobDescription {
  rawText: string;
  requiredSkills: string[];
  title: string;
  company?: string;
}

export interface MatchAnalysis {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  atsScore: number;
  suggestions: string[];
}

export interface SemanticDiffItem {
  id: string;
  section: string;
  original: string;
  adapted: string;
  rationale: string;
  keywords: string[];
  status: "pending" | "accepted" | "skipped";
}

// Broad local skills dictionary
export const KNOWN_SKILLS = [
  "python", "c++", "rust", "go", "golang", "typescript", "javascript", "react", "node.js",
  "pytorch", "vllm", "cuda", "triton", "tensorrt", "tensorrt-llm", "nccl", "infiniband",
  "distributed training", "distributed inference", "low latency", "docker", "kubernetes",
  "aws", "gcp", "azure", "slurm", "linux", "ebpf", "sql", "nosql", "postgres", "sqlite",
  "mongodb", "git", "ci/cd", "transformers", "huggingface", "rag", "embeddings", "onnx",
  "api design", "system design", "machine learning", "deep learning", "nlp", "computer vision",
  "tailwind", "next.js", "graphql", "redis", "fastapi", "flask", "django"
];

// Extract bullet items like \resumeItem{...}
export function extractBulletItems(latex: string): string[] {
  const bullets: string[] = [];
  const regex = /\\resumeItem\{([\s\S]*?)\}(?=\s*\\resumeItem|\s*\\resumeItemListEnd|$)/g;
  let match;
  while ((match = regex.exec(latex)) !== null) {
    const clean = match[1].trim();
    if (clean) bullets.push(clean);
  }
  return bullets;
}

export function parseLatex(latex: string): ParsedResume {
  const sections: ResumeSection[] = [];
  const skillMatches = new Set<string>();

  // Extract \section{...} blocks
  const sectionRegex = /\\section\*?\{([^}]+)\}([\s\S]*?)(?=\\section\*?\{|\\end\{document\}|$)/g;
  let match;

  while ((match = sectionRegex.exec(latex)) !== null) {
    const name = match[1].trim();
    const content = match[2].trim();
    const lowerName = name.toLowerCase();

    let type: ResumeSection["type"] = "other";
    if (lowerName.includes("experience") || lowerName.includes("work")) type = "experience";
    else if (lowerName.includes("education")) type = "education";
    else if (lowerName.includes("skill")) type = "skills";
    else if (lowerName.includes("summary")) type = "summary";
    else if (lowerName.includes("project")) type = "projects";

    const items = extractBulletItems(content);
    sections.push({ name, content, type, items });

    // Extract skills deterministically from content
    const lowerContent = content.toLowerCase();
    for (const skill of KNOWN_SKILLS) {
      if (lowerContent.includes(skill.toLowerCase())) {
        skillMatches.add(skill);
      }
    }
  }

  const allBullets = extractBulletItems(latex);

  return {
    rawLatex: latex,
    sections,
    extractedSkills: Array.from(skillMatches),
    bulletItems: allBullets
  };
}

export function parseJobDescription(jd: string, title?: string, company?: string): JobDescription {
  const requiredSkills = new Set<string>();
  const lowerJd = jd.toLowerCase();

  for (const skill of KNOWN_SKILLS) {
    if (lowerJd.includes(skill.toLowerCase())) {
      requiredSkills.add(skill);
    }
  }

  return {
    rawText: jd,
    title: title || "Software Engineer",
    company: company || "Target Company",
    requiredSkills: Array.from(requiredSkills)
  };
}

export function analyzeMatch(resume: ParsedResume, job: JobDescription): MatchAnalysis {
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  const resumeSkillsLower = new Set(resume.extractedSkills.map(s => s.toLowerCase()));
  const rawResumeLower = resume.rawLatex.toLowerCase();

  for (const skill of job.requiredSkills) {
    const sLower = skill.toLowerCase();
    if (resumeSkillsLower.has(sLower) || rawResumeLower.includes(sLower)) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const totalReq = job.requiredSkills.length;
  const matchScore = totalReq > 0
    ? Math.round((matchedSkills.length / totalReq) * 100)
    : 85;

  // ATS checklist score
  let atsScore = 70;
  const suggestions: string[] = [];

  if (resume.sections.some(s => s.type === "experience")) atsScore += 10;
  else suggestions.push("Add a dedicated Work Experience section.");

  if (resume.sections.some(s => s.type === "skills")) atsScore += 10;
  else suggestions.push("Add a distinct Skills matrix section.");

  if (missingSkills.length > 0) {
    suggestions.push(`Integrate missing keywords: ${missingSkills.slice(0, 4).join(", ")}.`);
  } else {
    atsScore += 10;
  }

  atsScore = Math.min(100, Math.max(40, atsScore));

  return {
    matchScore,
    matchedSkills,
    missingSkills,
    atsScore,
    suggestions
  };
}
