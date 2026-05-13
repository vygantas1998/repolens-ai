import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { ResultsPanel } from "./ResultsPanel";

describe("ResultsPanel", () => {
  it("renders analysis details with selected node files", () => {
    render(<ResultsPanel analysis={analysisFixture} selectedNode={analysisFixture.graph.nodes[1] ?? null} />);

    expect(screen.getByText("Fixture Repo")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getAllByText("src/App.tsx").length).toBeGreaterThan(0);
    expect(screen.getByText("No tests are visible from the file tree.")).toBeInTheDocument();
  });

  it("asks the user to select a node when none is selected", () => {
    render(<ResultsPanel analysis={analysisFixture} selectedNode={null} />);

    expect(screen.getAllByText("Select a node in the map.").length).toBeGreaterThan(0);
  });
});
