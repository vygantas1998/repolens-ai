import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { CanvasDetail } from "./CanvasDetail";

describe("CanvasDetail", () => {
  it("renders selected file details", () => {
    render(<CanvasDetail selectedFilePath="src/App.tsx" selectedFileReason="Main frontend shell." selectedNode={analysisFixture.graph.nodes[1] ?? null} selectedNodeFileCount={1} />);

    expect(screen.getByRole("heading", { name: "App.tsx" })).toBeInTheDocument();
    expect(screen.getByText("src/App.tsx")).toBeInTheDocument();
    expect(screen.getByText("Main frontend shell.")).toBeInTheDocument();
  });

  it("renders node and empty states", () => {
    const { rerender } = render(<CanvasDetail selectedFilePath={null} selectedFileReason={null} selectedNode={analysisFixture.graph.nodes[1] ?? null} selectedNodeFileCount={1} />);

    expect(screen.getByText("Click a file in the tree to see file-level details.")).toBeInTheDocument();

    rerender(<CanvasDetail selectedFilePath={null} selectedFileReason={null} selectedNode={null} selectedNodeFileCount={0} />);

    expect(screen.getByRole("heading", { name: "Select a node" })).toBeInTheDocument();
  });
});
