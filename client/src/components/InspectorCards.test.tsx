import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { ImportantFilesCard, NodeFilesCard, NodeOverviewCard, NoSelectionCard } from "./InspectorCards";

describe("InspectorCards", () => {
  it("renders node overview metrics", () => {
    render(<NodeOverviewCard selectedNode={analysisFixture.graph.nodes[1]!} importantFileCount={1} />);

    expect(screen.getByText("Node overview")).toBeInTheDocument();
    expect(screen.getByText("Frontend source code.")).toBeInTheDocument();
    expect(screen.getByText("important here")).toBeInTheDocument();
  });

  it("selects important files and handles empty important files", async () => {
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<ImportantFilesCard files={analysisFixture.importantFiles} onSelectFile={onSelectFile} />);

    await user.click(screen.getByRole("button", { name: "package.json" }));

    expect(onSelectFile).toHaveBeenCalledWith("package.json");

    rerender(<ImportantFilesCard files={[]} onSelectFile={onSelectFile} />);

    expect(screen.getByText("No highlighted important files are attached to this node.")).toBeInTheDocument();
  });

  it("selects node files and handles empty node files", async () => {
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(<NodeFilesCard files={["src/App.tsx"]} selectedFilePath="src/App.tsx" onSelectFile={onSelectFile} />);

    expect(screen.getByRole("button", { name: "src/App.tsx" })).toHaveClass("border-teal-700");

    await user.click(screen.getByRole("button", { name: "src/App.tsx" }));

    expect(onSelectFile).toHaveBeenCalledWith("src/App.tsx");

    rerender(<NodeFilesCard files={[]} selectedFilePath={null} onSelectFile={onSelectFile} />);

    expect(screen.getByText("No files are attached to this node yet.")).toBeInTheDocument();
  });

  it("renders no selection guidance", () => {
    render(<NoSelectionCard />);

    expect(screen.getByText("No selection")).toBeInTheDocument();
    expect(screen.getByText("Select a node or file in the architecture canvas to inspect it here.")).toBeInTheDocument();
  });
});
