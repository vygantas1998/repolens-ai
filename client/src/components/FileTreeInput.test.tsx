import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileTreeInput } from "./FileTreeInput";

describe("FileTreeInput", () => {
  it("edits file tree text and starts analysis", async () => {
    const onChange = vi.fn();
    const onAnalyze = vi.fn();
    const user = userEvent.setup();

    render(<FileTreeInput value="src/App.tsx" onChange={onChange} onAnalyze={onAnalyze} isLoading={false} />);

    await user.type(screen.getByLabelText("Repository file tree"), "\nserver/index.ts");
    await user.click(screen.getByRole("button", { name: "Analyze" }));

    expect(onChange).toHaveBeenCalled();
    expect(onAnalyze).toHaveBeenCalledOnce();
  });

  it("shows loading state", () => {
    render(<FileTreeInput value="src/App.tsx" onChange={vi.fn()} onAnalyze={vi.fn()} isLoading />);

    expect(screen.getByRole("button", { name: "Analyzing..." })).toBeDisabled();
  });
});
