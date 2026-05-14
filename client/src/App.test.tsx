import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "./App";
import { analysisFixture } from "./test/analysisFixture";

describe("App", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the initial MVP shell", () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Map the repo. Find the signal." })).toBeInTheDocument();
    expect(screen.getByText("Paste a tree and run analysis to generate the first RepoLens map.")).toBeInTheDocument();
  });

  it("analyzes the pasted file tree and displays results", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(analysisFixture), { status: 200, headers: { "Content-Type": "application/json" } })
    );
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getByText("Node overview")).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith("/api/analyze-tree", expect.objectContaining({ method: "POST" }));

    await user.click(screen.getByRole("button", { name: "index.ts" }));

    expect(screen.getAllByText("server/index.ts").length).toBeGreaterThan(0);
  });

  it("selects open-first files in the repository tree", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(analysisFixture), { status: 200, headers: { "Content-Type": "application/json" } })
    );
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));
    await waitFor(() => expect(screen.getByText("Node overview")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: "package.json" }));

    expect(screen.getAllByRole("button", { name: "package.json" }).some((button) => button.classList.contains("ring-1"))).toBe(true);
    expect(screen.getByRole("heading", { name: "package.json" })).toBeInTheDocument();
  });

  it("clears selected files when selecting an empty node", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ...analysisFixture,
          graph: {
            ...analysisFixture.graph,
            nodes: [...analysisFixture.graph.nodes, { id: "api", label: "api", type: "api", description: "API routes.", files: [] }]
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));
    await waitFor(() => expect(screen.getByText("Node overview")).toBeInTheDocument());

    await user.click(screen.getByRole("button", { name: /API 0 files api/ }));

    expect(screen.getByText("This node has no attached files yet.")).toBeInTheDocument();
  });

  it("handles analysis results without graph nodes", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ...analysisFixture,
          graph: { nodes: [], edges: [] }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getByText("Select a node or file in the architecture canvas to inspect it here.")).toBeInTheDocument());
  });

  it("selects the root node when it is the only graph node", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          ...analysisFixture,
          graph: { nodes: [analysisFixture.graph.nodes[0]], edges: [] }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getAllByRole("heading", { name: "Repository" }).length).toBeGreaterThan(0));
  });

  it("shows validation error when the input is empty", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.clear(screen.getByLabelText("Repository file tree"));
    await user.click(screen.getByRole("button", { name: "Analyze" }));

    expect(screen.getByText("Paste at least one file path before analyzing.")).toBeInTheDocument();
  });

  it("shows API error messages", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ error: { code: "INVALID_FILES", message: "Bad file tree." } }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    );
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getByText("Bad file tree.")).toBeInTheDocument());
  });

  it("shows fallback API error messages", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({}), { status: 500 }));
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getByText("Analysis failed.")).toBeInTheDocument());
  });

  it("shows network errors", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network down."));
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getByText("Network down.")).toBeInTheDocument());
  });

  it("shows unknown thrown values", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue("broken");
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Analyze" }));

    await waitFor(() => expect(screen.getByText("Unknown error.")).toBeInTheDocument());
  });
});
