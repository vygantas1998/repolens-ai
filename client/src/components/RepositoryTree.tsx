import { useState } from "react";
import { normalizePath } from "@/lib/fileTree";
import { cn } from "@/lib/utils";

type TreeEntry = {
  name: string;
  path: string;
  type: "folder" | "file";
  children: TreeEntry[];
};

type RepositoryTreeProps = {
  files: string[];
  selectedFilePath: string | null;
  onSelectFile: (file: string) => void;
};

function sortTreeEntries(entries: TreeEntry[]): TreeEntry[] {
  return entries
    .sort((first, second) => Number(second.type === "folder") - Number(first.type === "folder") || first.name.localeCompare(second.name))
    .map((entry) => ({ ...entry, children: sortTreeEntries(entry.children) }));
}

function buildTree(files: string[]): TreeEntry[] {
  const root: TreeEntry = { name: "", path: "", type: "folder", children: [] };

  files.forEach((file) => {
    const parts = normalizePath(file).split("/").filter(Boolean);
    let current = root;

    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join("/");
      const type: TreeEntry["type"] = index === parts.length - 1 ? "file" : "folder";
      let child = current.children.find((entry) => entry.path === path);

      if (!child) {
        child = { name: part, path, type, children: [] };
        current.children.push(child);
      }

      current = child;
    });
  });

  return sortTreeEntries(root.children);
}

function folderPaths(entries: TreeEntry[]): string[] {
  return entries.flatMap((entry) => [entry.type === "folder" ? entry.path : null, ...folderPaths(entry.children)]).filter(Boolean) as string[];
}

function fileCount(entry: TreeEntry): number {
  return entry.type === "file" ? 1 : entry.children.reduce((total, child) => total + fileCount(child), 0);
}

export function RepositoryTree({ files, selectedFilePath, onSelectFile }: RepositoryTreeProps) {
  const normalizedFiles = files.map(normalizePath);
  const treeEntries = buildTree(normalizedFiles);
  const [expandedFolders, setExpandedFolders] = useState(() => new Set(folderPaths(treeEntries)));

  const toggleFolder = (folder: string) => {
    setExpandedFolders((folders) => {
      const nextFolders = new Set(folders);

      if (nextFolders.has(folder)) {
        nextFolders.delete(folder);
      } else {
        nextFolders.add(folder);
      }

      return nextFolders;
    });
  };

  const renderTreeEntry = (entry: TreeEntry, depth = 0) => {
    if (entry.type === "folder") {
      const isOpen = expandedFolders.has(entry.path);

      return (
        <div key={entry.path}>
          <button
            aria-expanded={isOpen}
            className="mb-1 w-full rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-left font-mono text-xs font-semibold text-teal-200 transition-colors hover:border-teal-800 hover:bg-teal-950/20"
            onClick={() => toggleFolder(entry.path)}
            style={{ marginLeft: `${depth * 12}px`, width: `calc(100% - ${depth * 12}px)` }}
            type="button"
          >
            <span className="mr-2 text-muted-foreground">{isOpen ? "-" : "+"}</span>
            {entry.name} <span className="text-muted-foreground">({fileCount(entry)})</span>
          </button>
          {isOpen ? <div className="space-y-1">{entry.children.map((child) => renderTreeEntry(child, depth + 1))}</div> : null}
        </div>
      );
    }

    return (
      <button
        className={cn(
          "block w-full rounded-lg px-2 py-1.5 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:bg-slate-900 hover:text-slate-100",
          selectedFilePath === entry.path && "bg-slate-900 text-slate-100 ring-1 ring-teal-800/70"
        )}
        key={entry.path}
        onClick={() => onSelectFile(entry.path)}
        style={{ marginLeft: `${depth * 12}px`, width: `calc(100% - ${depth * 12}px)` }}
        type="button"
      >
        {entry.name}
      </button>
    );
  };

  return (
    <section className="flex min-h-0 flex-col rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold tracking-tight">Repository tree</h3>
        <span className="text-xs text-muted-foreground">{normalizedFiles.length} files</span>
      </div>
      <div className="scrollbar-inspector min-h-0 flex-1 space-y-3 overflow-y-auto px-1 pb-1">
        {treeEntries.map((entry) => renderTreeEntry(entry))}
      </div>
    </section>
  );
}
