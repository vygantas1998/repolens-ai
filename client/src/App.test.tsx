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

    await waitFor(() => expect(screen.getByText("Fixture Repo")).toBeInTheDocument());
    expect(fetch).toHaveBeenCalledWith("/api/analyze-tree", expect.objectContaining({ method: "POST" }));

    await user.click(screen.getByRole("button", { name: /server/ }));

    expect(screen.getByText("server/index.ts")).toBeInTheDocument();
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

    await waitFor(() => expect(screen.getAllByText("Select a node in the map.").length).toBeGreaterThan(0));
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
