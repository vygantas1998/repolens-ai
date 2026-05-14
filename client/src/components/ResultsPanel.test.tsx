import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { ResultsPanel } from "./ResultsPanel";

describe("ResultsPanel", () => {
  it("renders node-specific details when a node is selected", () => {
    render(<ResultsPanel analysis={analysisFixture} selectedFilePath={null} selectedNode={analysisFixture.graph.nodes[1] ?? null} onSelectFile={() => undefined} />);

    expect(screen.getByRole("heading", { name: "Selection" })).toBeInTheDocument();
    expect(screen.getByText("Node overview")).toBeInTheDocument();
    expect(screen.getByText("Files in this node")).toBeInTheDocument();
    expect(screen.getByText("Important here").compareDocumentPosition(screen.getByText("Files in this node"))).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(screen.getAllByRole("button", { name: "src/App.tsx" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Main frontend shell.")).toBeInTheDocument();
  });

  it("asks the user to select a node or file when none is selected", () => {
    render(<ResultsPanel analysis={analysisFixture} selectedFilePath={null} selectedNode={null} onSelectFile={() => undefined} />);

    expect(screen.getByText("No selection")).toBeInTheDocument();
    expect(screen.getByText("Select a node or file in the architecture canvas to inspect it here.")).toBeInTheDocument();
  });

  it("omits the old node handoff workflow", () => {
    render(<ResultsPanel analysis={analysisFixture} selectedFilePath={null} selectedNode={analysisFixture.graph.nodes[0] ?? null} onSelectFile={() => undefined} />);

    expect(screen.queryByText("Node handoff")).not.toBeInTheDocument();
    expect(screen.queryByText("1. Start with highlighted important files.")).not.toBeInTheDocument();
  });

  it("omits duplicated selected file details while keeping node file selection", async () => {
    const onSelectFile = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(<ResultsPanel analysis={analysisFixture} selectedFilePath="package.json" selectedNode={null} onSelectFile={onSelectFile} />);

    expect(screen.queryByText("Selected file")).not.toBeInTheDocument();
    expect(screen.queryByText("Defines dependencies.")).not.toBeInTheDocument();
    expect(screen.getByText("No selection")).toBeInTheDocument();

    rerender(<ResultsPanel analysis={analysisFixture} selectedFilePath="server/index.ts" selectedNode={analysisFixture.graph.nodes[2] ?? null} onSelectFile={onSelectFile} />);

    expect(screen.queryByText("No specific importance signal has been attached to this file yet.")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "server/index.ts" }));

    expect(onSelectFile).toHaveBeenCalledWith("server/index.ts");
  });

  it("selects node files and handles nodes without attached files", async () => {
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const emptyNode = { id: "api", label: "api", type: "api" as const, description: "API routes.", files: [] };

    const { rerender } = render(<ResultsPanel analysis={analysisFixture} selectedFilePath="src/App.tsx" selectedNode={analysisFixture.graph.nodes[1] ?? null} onSelectFile={onSelectFile} />);

    expect(screen.getAllByRole("button", { name: "src/App.tsx" }).some((button) => button.classList.contains("border-teal-700"))).toBe(true);

    await user.click(screen.getAllByRole("button", { name: "src/App.tsx" })[0] as HTMLElement);

    expect(onSelectFile).toHaveBeenCalledWith("src/App.tsx");

    await user.click(screen.getAllByRole("button", { name: "src/App.tsx" })[1] as HTMLElement);

    expect(onSelectFile).toHaveBeenCalledTimes(2);

    rerender(<ResultsPanel analysis={analysisFixture} selectedFilePath={null} selectedNode={emptyNode} onSelectFile={onSelectFile} />);

    expect(screen.getByText("No files are attached to this node yet.")).toBeInTheDocument();
    expect(screen.getByText("No highlighted important files are attached to this node.")).toBeInTheDocument();
  });
});
