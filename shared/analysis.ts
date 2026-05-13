export type Confidence = "low" | "medium" | "high";

export type FolderInsight = {
  path: string;
  purpose: string;
  confidence: Confidence;
};

export type ImportantFile = {
  path: string;
  reason: string;
  confidence: Confidence;
};

export type ArchitectureNode = {
  id: string;
  label: string;
  type: "root" | "frontend" | "backend" | "api" | "data" | "config" | "docs" | "unknown";
  description: string;
  files: string[];
};

export type ArchitectureEdge = {
  from: string;
  to: string;
  label: string;
};

export type AnalysisResult = {
  projectName: string;
  projectType: string;
  summary: string;
  technologies: string[];
  folders: FolderInsight[];
  importantFiles: ImportantFile[];
  suggestedEntryPoints: string[];
  risks: string[];
  graph: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
};

export type AnalyzeTreeRequest = {
  files: string[];
};

export type ApiErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};
