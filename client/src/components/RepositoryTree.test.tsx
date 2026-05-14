import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RepositoryTree } from "./RepositoryTree";

describe("RepositoryTree", () => {
  it("renders nested folders and selects files", async () => {
    const onSelectFile = vi.fn();
    const user = userEvent.setup();

    render(<RepositoryTree files={["package.json", "src/App.tsx", "src/components/Header.tsx"]} selectedFilePath="src/App.tsx" onSelectFile={onSelectFile} />);

    expect(screen.getByRole("heading", { name: "Repository tree" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /src \(2\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "App.tsx" })).toHaveClass("ring-1");

    await user.click(screen.getByRole("button", { name: /components \(1\)/ }));

    expect(screen.queryByRole("button", { name: "Header.tsx" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "App.tsx" }));

    expect(onSelectFile).toHaveBeenCalledWith("src/App.tsx");
  });
});
