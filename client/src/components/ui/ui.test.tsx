import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Textarea } from "./textarea";

describe("shadcn-style ui components", () => {
  it("renders badge with merged classes", () => {
    render(<Badge className="custom-badge">AI</Badge>);

    expect(screen.getByText("AI")).toHaveClass("custom-badge");
  });

  it("renders button with default type and merged classes", () => {
    const onClick = vi.fn();

    render(<Button className="custom-button" onClick={onClick}>Run</Button>);

    expect(screen.getByRole("button", { name: "Run" })).toHaveAttribute("type", "button");
    expect(screen.getByRole("button", { name: "Run" })).toHaveClass("custom-button");
  });

  it("renders card composition components", () => {
    render(
      <Card className="custom-card">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByText("Title").closest(".custom-card")).toBeInTheDocument();
  });

  it("renders textarea with merged classes", () => {
    render(<Textarea className="custom-textarea" aria-label="Notes" />);

    expect(screen.getByLabelText("Notes")).toHaveClass("custom-textarea");
  });
});
