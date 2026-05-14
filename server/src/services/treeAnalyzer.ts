import type { AnalysisResult, ArchitectureNode, Confidence, FolderInsight, ImportantFile } from "../../../shared/analysis.js";

const unique = <T>(items: T[]) => Array.from(new Set(items));

const includesAny = (value: string, needles: string[]) => needles.some((needle) => value.toLowerCase().includes(needle));

const extensionOf = (file: string) => {
  const match = file.match(/\.([a-z0-9]+)$/i);
  return match?.[1]?.toLowerCase() ?? "";
};

const topFolderOf = (file: string) => file.split(/[\\/]/)[0] as string;

export function analyzeFileTree(files: string[]): AnalysisResult {
  const normalizedFiles = unique(files.map((file) => file.replaceAll("\\", "/"))).sort();
  const technologies = detectTechnologies(normalizedFiles);
  const folders = detectFolders(normalizedFiles);
  const importantFiles = detectImportantFiles(normalizedFiles);
  const graphNodes = buildGraphNodes(normalizedFiles, folders);

  return {
    projectName: inferProjectName(normalizedFiles),
    projectType: inferProjectType(technologies, normalizedFiles),
    summary: buildSummary(technologies, normalizedFiles),
    technologies,
    folders,
    importantFiles,
    suggestedEntryPoints: importantFiles.slice(0, 5).map((file) => file.path),
    risks: detectRisks(normalizedFiles, technologies),
    graph: {
      nodes: graphNodes,
      edges: buildGraphEdges(graphNodes)
    }
  };
}

function inferProjectName(files: string[]) {
  if (files.some((file) => file.includes("repolens"))) {
    return "RepoLens AI";
  }

  return "Analyzed Repository";
}

function detectTechnologies(files: string[]) {
  const tech: string[] = [];

  if (files.some((file) => ["tsx", "jsx"].includes(extensionOf(file))) || files.some((file) => includesAny(file, ["react", "components/"]))) {
    tech.push("React");
  }

  if (files.some((file) => ["ts", "tsx"].includes(extensionOf(file)))) {
    tech.push("TypeScript");
  }

  if (files.some((file) => file === "package.json" || file.endsWith("/package.json"))) {
    tech.push("Node.js");
  }

  if (files.some((file) => file.endsWith(".cs") || includesAny(file, ["program.cs", "controllers/"]))) {
    tech.push("ASP.NET / C#");
  }

  if (files.some((file) => includesAny(file, ["next.config", "app/api/", "app/page"]))) {
    tech.push("Next.js");
  }

  if (files.some((file) => includesAny(file, ["prisma/schema", "models/", "data/"]))) {
    tech.push("Database layer");
  }

  if (files.some((file) => includesAny(file, ["graphql", ".graphql"]))) {
    tech.push("GraphQL");
  }

  return tech.length > 0 ? unique(tech) : ["Unknown stack"];
}

function inferProjectType(technologies: string[], files: string[]) {
  const hasFrontend = technologies.includes("React") || technologies.includes("Next.js");
  const hasBackend = technologies.includes("Node.js") || technologies.includes("ASP.NET / C#") || files.some((file) => includesAny(file, ["server/", "controllers/", "routes/", "app/api/"]));

  if (hasFrontend && hasBackend) {
    return "Full-stack web application";
  }

  if (hasFrontend) {
    return "Frontend application";
  }

  if (hasBackend) {
    return "Backend/API application";
  }

  return "Software project";
}

function detectFolders(files: string[]): FolderInsight[] {
  const folders = unique(files.filter((file) => file.includes("/")).map(topFolderOf).filter((folder) => !folder.includes(".")));

  return folders.map((folder) => ({
    path: folder,
    purpose: describeFolder(folder, files),
    confidence: confidenceForFolder(folder)
  }));
}

function describeFolder(folder: string, files: string[]) {
  const lower = folder.toLowerCase();
  const folderFiles = files.filter((file) => file.startsWith(`${folder}/`));

  if (includesAny(lower, ["src", "clientapp", "app"])) return "Main application source code and UI entry points.";
  if (includesAny(lower, ["server", "api"])) return "Backend server, API routes, and application services.";
  if (includesAny(lower, ["components"])) return "Reusable user interface components.";
  if (includesAny(lower, ["controllers", "routes"])) return "HTTP endpoints and request handling logic.";
  if (includesAny(lower, ["services", "lib"])) return "Reusable business logic, integrations, or helper services.";
  if (includesAny(lower, ["models", "data", "prisma"])) return "Database models, persistence, or data access layer.";
  if (includesAny(lower, ["docs"])) return "Project documentation and planning notes.";

  return `Contains ${folderFiles.length} project file${folderFiles.length === 1 ? "" : "s"}.`;
}

function confidenceForFolder(folder: string): Confidence {
  return includesAny(folder, ["src", "server", "components", "controllers", "routes", "services", "models", "data", "docs"]) ? "high" : "medium";
}

function detectImportantFiles(files: string[]): ImportantFile[] {
  const candidates: ImportantFile[] = [];

  const addIfPresent = (predicate: (file: string) => boolean, reason: string, confidence: Confidence = "high") => {
    const match = files.find(predicate);
    if (match) candidates.push({ path: match, reason, confidence });
  };

  addIfPresent((file) => file.endsWith("package.json"), "Defines JavaScript dependencies, scripts, and project metadata.");
  addIfPresent((file) => file.endsWith("README.md"), "Primary project documentation and setup information.");
  addIfPresent((file) => includesAny(file, ["src/main.tsx", "src/main.jsx"]), "Frontend application bootstrap entry point.");
  addIfPresent((file) => includesAny(file, ["src/app.tsx", "src/app.jsx", "app/page.tsx"]), "Likely main frontend screen or application shell.");
  addIfPresent((file) => includesAny(file, ["server/index.ts", "server/index.js", "program.cs"]), "Backend application startup file.");
  addIfPresent((file) => includesAny(file, ["routes/", "controllers/", "app/api/"]), "Likely API endpoint or request handling file.");
  addIfPresent((file) => includesAny(file, ["auth", "login", "session"]), "Likely authentication-related logic.", "medium");
  addIfPresent((file) => includesAny(file, ["prisma/schema.prisma", "dbcontext", "models/"]), "Likely data model or database layer file.", "medium");

  return uniqueByPath(candidates).slice(0, 8);
}

function uniqueByPath(files: ImportantFile[]) {
  const seen = new Set<string>();
  return files.filter((file) => {
    if (seen.has(file.path)) return false;
    seen.add(file.path);
    return true;
  });
}

function buildSummary(technologies: string[], files: string[]) {
  const projectType = inferProjectType(technologies, files);
  const topFolders = unique(files.map(topFolderOf)).slice(0, 6).join(", ");

  return `This appears to be a ${projectType.toLowerCase()} using ${technologies.join(", ")}. The visible structure suggests the most important areas are ${topFolders}. Start by reading the package/config files, then the main frontend entry point, then the backend/API routes if present.`;
}

function detectRisks(files: string[], technologies: string[]) {
  const risks: string[] = [];

  if (!files.some((file) => file.toLowerCase().includes("readme"))) {
    risks.push("No README is visible, so onboarding documentation may be missing.");
  }

  if (!files.some((file) => includesAny(file, ["test", "spec"]))) {
    risks.push("No tests are visible from the file tree.");
  }

  if (technologies.includes("Unknown stack")) {
    risks.push("The technology stack is not obvious from file names alone.");
  }

  if (!files.some((file) => includesAny(file, ["auth", "login", "session"]))) {
    risks.push("Authentication flow is not obvious from the file structure alone.");
  }

  return risks;
}

function buildGraphNodes(files: string[], folders: FolderInsight[]): ArchitectureNode[] {
  const root: ArchitectureNode = {
    id: "root",
    label: "Repository",
    type: "root",
    description: "Top-level view of the analyzed codebase.",
    files: files.filter((file) => !file.includes("/"))
  };

  const nodes = folders.map<ArchitectureNode>((folder) => {
    const folderFiles = files.filter((file) => file.startsWith(`${folder.path}/`));
    return {
      id: folder.path,
      label: folder.path,
      type: inferNodeType(folder.path),
      description: folder.purpose,
      files: folderFiles
    };
  });

  return [root, ...nodes];
}

function inferNodeType(path: string): ArchitectureNode["type"] {
  const lower = path.toLowerCase();
  if (includesAny(lower, ["src", "client", "components", "app"])) return "frontend";
  if (includesAny(lower, ["server"])) return "backend";
  if (includesAny(lower, ["routes", "controllers", "api"])) return "api";
  if (includesAny(lower, ["models", "data", "prisma"])) return "data";
  if (includesAny(lower, ["docs"])) return "docs";
  if (includesAny(lower, ["config", "settings"])) return "config";
  return "unknown";
}

function buildGraphEdges(nodes: ArchitectureNode[]) {
  return nodes
    .filter((node) => node.id !== "root")
    .map((node) => ({ from: "root", to: node.id, label: "contains" }));
}
