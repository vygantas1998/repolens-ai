import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { analysisFixture } from "../test/analysisFixture";
import { RepositoryBriefing } from "./RepositoryBriefing";

describe("RepositoryBriefing", () => {
  it("renders metrics, five entry points, technologies, and risks", async () => {
    const onSelectFile = vi.fn();
    const user = userEvent.setup();
    const analysis = {
      ...analysisFixture,
      suggestedEntryPoints: ["package.json", "src/main.tsx", "src/App.tsx", "server/index.ts", "server/routes/analyze.ts", "ignored.ts"]
    };

    render(<RepositoryBriefing analysis={analysis} selectedFilePath="src/App.tsx" onSelectFile={onSelectFile} />);

    expect(screen.getByRole("heading", { name: "Full-stack web application" })).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("No tests are visible from the file tree.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "ignored.ts" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "src/App.tsx" })).toHaveClass("border-teal-700");

    await user.click(screen.getByRole("button", { name: "server/routes/analyze.ts" }));

    expect(onSelectFile).toHaveBeenCalledWith("server/routes/analyze.ts");
  });

  it("renders no-risk copy", () => {
    render(<RepositoryBriefing analysis={{ ...analysisFixture, risks: [] }} selectedFilePath={null} onSelectFile={vi.fn()} />);

    expect(screen.getByText("No structural risks detected from this file tree.")).toBeInTheDocument();
  });
});
