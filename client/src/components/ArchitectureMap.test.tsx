import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { ArchitectureMap } from "./ArchitectureMap";

describe("ArchitectureMap", () => {
  it("renders nodes and selects a clicked node", async () => {
    const onSelectNode = vi.fn();
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

    render(<ArchitectureMap analysis={analysis} selectedNodeId="root" onSelectNode={onSelectNode} />);

    expect(screen.getByRole("heading", { name: "Full-stack web application" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Repository/ })).toHaveClass("border-primary");

    await user.click(screen.getByRole("button", { name: /server/ }));

    expect(onSelectNode).toHaveBeenCalledWith("server");
  });
});
