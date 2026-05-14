import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { ArchitectureMap } from "./ArchitectureMap";

describe("ArchitectureMap", () => {
  it("renders nodes and selects a clicked node", async () => {
    const onSelectNode = vi.fn();
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const analysis = {
      ...analysisFixture,
      graph: {
        ...analysisFixture.graph,
        nodes: [
          ...analysisFixture.graph.nodes,
          { id: "api", label: "api", type: "api" as const, description: "API routes.", files: [] },
          { id: "data", label: "data", type: "data" as const, description: "Data layer.", files: [] },
          { id: "docs", label: "docs", type: "docs" as const, description: "Docs.", files: [] }
        ]
      }
    };

    render(<ArchitectureMap analysis={analysis} files={["package.json", "src/App.tsx", "server/index.ts"]} selectedFilePath={null} selectedNodeId="root" onSelectFile={onSelectFile} onSelectNode={onSelectNode} />);

    expect(screen.getByRole("button", { name: "Map" })).toHaveClass("border-teal-700");
    expect(screen.getByRole("button", { name: /Repository/ })).toHaveClass("outline-teal-300/70");

    await user.click(screen.getByRole("button", { name: /Server 1 files server/ }));

    expect(onSelectNode).toHaveBeenCalledWith("server");

    await user.click(screen.getByRole("button", { name: /API 0 files api/ }));

    expect(onSelectNode).toHaveBeenCalledWith("api");

    await user.click(screen.getByRole("button", { name: "package.json" }));

    expect(onSelectFile).toHaveBeenCalledWith("package.json");
  });

  it("selects files inside the canvas file tree", async () => {
    const onSelectNode = vi.fn();
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/App.tsx", "server/index.ts"]} selectedFilePath={null} selectedNodeId="src" onSelectFile={onSelectFile} onSelectNode={onSelectNode} />);

    await user.click(screen.getByRole("button", { name: "App.tsx" }));

    rerender(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/App.tsx", "server/index.ts"]} selectedFilePath="src/App.tsx" selectedNodeId="src" onSelectFile={onSelectFile} onSelectNode={onSelectNode} />);

    expect(onSelectNode).toHaveBeenCalledWith("src");
    expect(onSelectFile).toHaveBeenCalledWith("src/App.tsx");
    expect(screen.getByRole("heading", { name: "App.tsx" })).toBeInTheDocument();
    expect(screen.getByText("Main frontend shell.")).toBeInTheDocument();
  });

  it("uses the full input tree for node file counts", () => {
    const srcFiles = Array.from({ length: 12 }, (_, index) => `src/file-${index + 1}.ts`);

    render(<ArchitectureMap analysis={analysisFixture} files={["package.json", ...srcFiles]} selectedFilePath={null} selectedNodeId="src" onSelectFile={vi.fn()} onSelectNode={vi.fn()} />);

    expect(screen.getByRole("button", { name: /UI 12 files src/ })).toBeInTheDocument();
  });

  it("shows five open-first shortcuts and repository risks", async () => {
    const user = userEvent.setup();
    const analysis = {
      ...analysisFixture,
      suggestedEntryPoints: ["package.json", "src/main.tsx", "src/App.tsx", "server/index.ts", "server/routes/analyze.ts"]
    };

    render(<ArchitectureMap analysis={analysis} files={["package.json", "src/main.tsx", "src/App.tsx", "server/index.ts", "server/routes/analyze.ts"]} selectedFilePath={null} selectedNodeId="src" onSelectFile={vi.fn()} onSelectNode={vi.fn()} />);

    expect(screen.queryByRole("heading", { name: "Full-stack web application" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Briefing" }));

    expect(screen.getByText("Repository briefing")).toBeInTheDocument();
    expect(screen.getByText("No tests are visible from the file tree.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "server/routes/analyze.ts" })).toBeInTheDocument();
  });

  it("shows a no-risk message in briefing when no risks are detected", async () => {
    render(<ArchitectureMap analysis={{ ...analysisFixture, risks: [] }} files={["package.json", "src/App.tsx"]} selectedFilePath={null} selectedNodeId="src" onSelectFile={vi.fn()} onSelectNode={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Briefing" }));

    expect(screen.getByText("No structural risks detected from this file tree.")).toBeInTheDocument();
  });

  it("keeps repository tree and canvas detail visible while switching center tabs", async () => {
    const user = userEvent.setup();

    render(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/App.tsx"]} selectedFilePath={null} selectedNodeId="src" onSelectFile={vi.fn()} onSelectNode={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Files" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Risks" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Repository tree" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "src" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Briefing" }));

    expect(screen.getByRole("heading", { name: "Repository tree" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "src" })).toBeInTheDocument();
    expect(screen.getByText("No tests are visible from the file tree.")).toBeInTheDocument();
  });

  it("shows canvas detail without a selected node", () => {
    render(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/App.tsx"]} selectedFilePath={null} selectedNodeId={null} onSelectFile={vi.fn()} onSelectNode={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Select a node" })).toBeInTheDocument();
  });

  it("renders nested folders and toggles them without selecting a node", async () => {
    const onSelectNode = vi.fn();
    const user = userEvent.setup();

    render(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/components/Header.tsx", "src/App.tsx"]} selectedFilePath={null} selectedNodeId="src" onSelectFile={vi.fn()} onSelectNode={onSelectNode} />);

    expect(screen.getByRole("button", { name: "Header.tsx" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "package.json" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /root \(/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /components \(1\)/ }));

    expect(screen.queryByRole("button", { name: "Header.tsx" })).not.toBeInTheDocument();
    expect(onSelectNode).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /components \(1\)/ }));

    expect(screen.getByRole("button", { name: "Header.tsx" })).toBeInTheDocument();
  });

  it("maps top-level files to the core node", async () => {
    const onSelectNode = vi.fn();
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/App.tsx"]} selectedFilePath={null} selectedNodeId="src" onSelectFile={onSelectFile} onSelectNode={onSelectNode} />);

    await user.click(screen.getByRole("button", { name: "package.json" }));

    rerender(<ArchitectureMap analysis={analysisFixture} files={["package.json", "src/App.tsx"]} selectedFilePath="package.json" selectedNodeId="root" onSelectFile={onSelectFile} onSelectNode={onSelectNode} />);

    expect(onSelectNode).toHaveBeenCalledWith("root");
    expect(onSelectFile).toHaveBeenCalledWith("package.json");
    expect(screen.getByRole("heading", { name: "package.json" })).toBeInTheDocument();
    expect(screen.getByText("Defines dependencies.")).toBeInTheDocument();
  });

  it("shows node-level detail for nodes without attached files", async () => {
    const onSelectNode = vi.fn();
    const user = userEvent.setup();
    const analysis = {
      ...analysisFixture,
      graph: {
        ...analysisFixture.graph,
        nodes: [...analysisFixture.graph.nodes, { id: "api", label: "api", type: "api" as const, description: "API routes.", files: [] }]
      }
    };

    render(<ArchitectureMap analysis={analysis} files={["package.json", "src/App.tsx"]} selectedFilePath={null} selectedNodeId="api" onSelectFile={vi.fn()} onSelectNode={onSelectNode} />);

    expect(screen.getByText("This node has no attached files yet.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Repository/ }));

    expect(onSelectNode).toHaveBeenCalledWith("root");
  });
});
