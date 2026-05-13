import type { AnalysisResult } from "../../../shared/analysis";

export const analysisFixture: AnalysisResult = {
  projectName: "Fixture Repo",
  projectType: "Full-stack web application",
  summary: "A fixture repository used for component tests.",
  technologies: ["React", "TypeScript", "Node.js"],
  folders: [
    { path: "src", purpose: "Frontend source code.", confidence: "high" },
    { path: "server", purpose: "Backend source code.", confidence: "high" }
  ],
  importantFiles: [
    { path: "package.json", reason: "Defines dependencies.", confidence: "high" },
    { path: "src/App.tsx", reason: "Main frontend shell.", confidence: "high" }
  ],
  suggestedEntryPoints: ["package.json", "src/App.tsx"],
  risks: ["No tests are visible from the file tree."],
  graph: {
    nodes: [
      { id: "root", label: "Repository", type: "root", description: "Root node.", files: [] },
      { id: "src", label: "src", type: "frontend", description: "Frontend source code.", files: ["src/App.tsx"] },
      { id: "server", label: "server", type: "backend", description: "Backend source code.", files: ["server/index.ts"] }
    ],
    edges: [
      { from: "root", to: "src", label: "contains" },
      { from: "root", to: "server", label: "contains" }
    ]
  }
};
