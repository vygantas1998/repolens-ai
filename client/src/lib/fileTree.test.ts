import { describe, expect, it } from "vitest";
import { fileNameOf, filesForNode, hydrateNodeFiles, normalizePath, parseFileTreeText, topFolderOf } from "./fileTree";

describe("fileTree helpers", () => {
  it("parses and normalizes file tree paths", () => {
    expect(parseFileTreeText(" package.json\n\n src\\App.tsx ")).toEqual(["package.json", "src\\App.tsx"]);
    expect(normalizePath("src\\App.tsx")).toBe("src/App.tsx");
    expect(fileNameOf("src/components/Header.tsx")).toBe("Header.tsx");
  });

  it("maps files to top folders and nodes", () => {
    const files = ["package.json", "src/App.tsx", "src/components/Header.tsx"];
    const node = { id: "src", label: "src", type: "frontend" as const, description: "Frontend.", files: [] };

    expect(topFolderOf("package.json")).toBe("root");
    expect(topFolderOf("src\\App.tsx")).toBe("src");
    expect(filesForNode(files, "root")).toEqual(["package.json"]);
    expect(filesForNode(files, "src")).toEqual(["src/App.tsx", "src/components/Header.tsx"]);
    expect(hydrateNodeFiles(node, files).files).toEqual(["src/App.tsx", "src/components/Header.tsx"]);
  });
});
