import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { ArchitectureNodeGrid } from "./ArchitectureNodeGrid";

describe("ArchitectureNodeGrid", () => {
  it("renders node cards with derived file counts and selection state", async () => {
    const onSelectNode = vi.fn();
    const user = userEvent.setup();

    render(<ArchitectureNodeGrid files={["package.json", "src/App.tsx", "src/components/Header.tsx"]} nodes={analysisFixture.graph.nodes} selectedNodeId="src" onSelectNode={onSelectNode} />);

    expect(screen.getByRole("button", { name: /UI 2 files src/ })).toHaveClass("outline-teal-300/70");
    expect(screen.getByRole("button", { name: /Core 1 files Repository/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Server 0 files server/ }));

    expect(onSelectNode).toHaveBeenCalledWith(analysisFixture.graph.nodes[2]);
  });
});
