import type { ArchitectureNode } from "../../../shared/analysis";

export function parseFileTreeText(fileTree: string) {
  return fileTree
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function normalizePath(file: string) {
  return file.replaceAll("\\", "/");
}

export function topFolderOf(file: string) {
  const normalizedFile = normalizePath(file);
  return normalizedFile.includes("/") ? normalizedFile.split("/")[0] as string : "root";
}

export function fileNameOf(file: string) {
  const parts = normalizePath(file).split("/");
  return parts[parts.length - 1] as string;
}

export function filesForNode(files: string[], nodeId: string) {
  const normalizedFiles = files.map(normalizePath);

  return nodeId === "root"
    ? normalizedFiles.filter((file) => !file.includes("/"))
    : normalizedFiles.filter((file) => file.startsWith(`${nodeId}/`));
}

export function hydrateNodeFiles<TNode extends ArchitectureNode>(node: TNode, files: string[]): TNode {
  return { ...node, files: filesForNode(files, node.id) };
}
