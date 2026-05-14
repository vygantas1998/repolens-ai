import { describe, expect, it } from "vitest";
import { analyzeFileTree } from "./treeAnalyzer.js";

describe("analyzeFileTree", () => {
  it("detects a full-stack React and Node repository", () => {
    const analysis = analyzeFileTree([
      "package.json",
      "README.md",
      "src/main.tsx",
      "src/App.tsx",
      "src/components/Header.tsx",
      "server/index.ts",
      "server/routes/auth.ts",
      "server/services/treeAnalyzer.ts",
      "server/types/analysis.ts",
      "tests/app.test.ts"
    ]);

    expect(analysis).toMatchObject({
      projectName: "Analyzed Repository",
      projectType: "Full-stack web application",
      technologies: ["React", "TypeScript", "Node.js"]
    });
    expect(analysis.importantFiles.map((file) => file.path)).toContain("server/routes/auth.ts");
    expect(analysis.risks).toEqual([]);
    expect(analysis.graph.nodes[0]).toMatchObject({ id: "root", type: "root", files: ["README.md", "package.json"] });
    expect(analysis.graph.edges).toContainEqual({ from: "root", to: "server", label: "contains" });
  });

  it("detects RepoLens by file name and normalizes Windows paths", () => {
    const analysis = analyzeFileTree(["repolens-ai\\package.json", "repolens-ai\\src\\App.jsx"]);

    expect(analysis.projectName).toBe("RepoLens AI");
    expect(analysis.technologies).toEqual(["React", "Node.js"]);
    expect(analysis.folders[0]?.path).toBe("repolens-ai");
  });

  it("detects ASP.NET, GraphQL, and database layers", () => {
    const analysis = analyzeFileTree([
      "README.md",
      "ClientApp/src/main.tsx",
      "ClientApp/src/graphql/client.ts",
      "Controllers/AuthController.cs",
      "Data/AppDbContext.cs",
      "Models/User.cs",
      "Program.cs",
      "appsettings.json",
      "DeviceServiceTests.cs"
    ]);

    expect(analysis.projectType).toBe("Full-stack web application");
    expect(analysis.technologies).toEqual(["React", "TypeScript", "ASP.NET / C#", "Database layer", "GraphQL"]);
    expect(analysis.folders.map((folder) => folder.path)).toEqual(["ClientApp", "Controllers", "Data", "Models"]);
    expect(analysis.importantFiles.map((file) => file.path)).toContain("Program.cs");
  });

  it("detects Next.js API applications", () => {
    const analysis = analyzeFileTree([
      "package.json",
      "next.config.js",
      "app/page.tsx",
      "app/api/analyze/route.ts",
      "lib/github.ts",
      "prisma/schema.prisma",
      "README.md",
      "analysis.spec.ts"
    ]);

    expect(analysis.projectType).toBe("Full-stack web application");
    expect(analysis.technologies).toEqual(["React", "TypeScript", "Node.js", "Next.js", "Database layer"]);
    expect(analysis.graph.nodes.map((node) => node.type)).toContain("data");
  });

  it("classifies frontend-only projects", () => {
    const analysis = analyzeFileTree(["README.md", "src/App.jsx", "src/components/Button.jsx", "app.test.jsx"]);

    expect(analysis.projectType).toBe("Frontend application");
    expect(analysis.technologies).toEqual(["React"]);
  });

  it("classifies backend-only projects", () => {
    const analysis = analyzeFileTree(["README.md", "server/index.js", "server/routes/users.js", "server.test.js"]);

    expect(analysis.projectType).toBe("Backend/API application");
    expect(analysis.technologies).toEqual(["Unknown stack"]);
    expect(analysis.risks).toContain("The technology stack is not obvious from file names alone.");
  });

  it("classifies unknown software projects and documentation folders", () => {
    const analysis = analyzeFileTree(["docs/plan.md", "config/settings.yml", "scripts/deploy.sh", "LICENSE"]);

    expect(analysis.projectType).toBe("Software project");
    expect(analysis.technologies).toEqual(["Unknown stack"]);
    expect(analysis.folders).toEqual([
      { path: "config", purpose: "Contains 1 project file.", confidence: "medium" },
      { path: "docs", purpose: "Project documentation and planning notes.", confidence: "high" },
      { path: "scripts", purpose: "Contains 1 project file.", confidence: "medium" }
    ]);
    expect(analysis.graph.nodes.map((node) => node.type)).toEqual(["root", "config", "docs", "unknown"]);
    expect(analysis.risks).toEqual([
      "No README is visible, so onboarding documentation may be missing.",
      "No tests are visible from the file tree.",
      "The technology stack is not obvious from file names alone.",
      "Authentication flow is not obvious from the file structure alone."
    ]);
  });

  it("describes default folders with plural file counts", () => {
    const analysis = analyzeFileTree(["tools/a.sh", "tools/b.sh"]);

    expect(analysis.folders).toEqual([{ path: "tools", purpose: "Contains 2 project files.", confidence: "medium" }]);
  });

  it("describes top-level component folders", () => {
    const analysis = analyzeFileTree(["components/Button.tsx", "components/Card.tsx"]);

    expect(analysis.folders).toEqual([{ path: "components", purpose: "Reusable user interface components.", confidence: "high" }]);
  });

  it("attaches every file to its matching architecture node", () => {
    const srcFiles = Array.from({ length: 12 }, (_, index) => `src/file-${index + 1}.ts`);
    const rootFiles = Array.from({ length: 9 }, (_, index) => `root-${index + 1}.json`);
    const analysis = analyzeFileTree([...rootFiles, ...srcFiles]);

    expect(analysis.graph.nodes.find((node) => node.id === "root")?.files).toEqual(rootFiles.sort());
    expect(analysis.graph.nodes.find((node) => node.id === "src")?.files).toEqual(srcFiles.sort());
  });
});
