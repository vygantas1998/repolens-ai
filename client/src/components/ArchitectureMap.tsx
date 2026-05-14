import { useState } from "react";
import type { AnalysisResult, ArchitectureNode } from "../../../shared/analysis";
import { ArchitectureNodeGrid } from "@/components/ArchitectureNodeGrid";
import { Badge } from "@/components/ui/badge";
import { CanvasDetail } from "@/components/CanvasDetail";
import { RepositoryBriefing } from "@/components/RepositoryBriefing";
import { RepositoryTree } from "@/components/RepositoryTree";
import { filesForNode, normalizePath, topFolderOf } from "@/lib/fileTree";
import { cn } from "@/lib/utils";

type ArchitectureMapProps = {
  analysis: AnalysisResult;
  files: string[];
  selectedFilePath: string | null;
  selectedNodeId: string | null;
  onSelectFile: (file: string | null) => void;
  onSelectNode: (nodeId: string) => void;
};

type CanvasMode = "map" | "briefing";

const canvasModes: { id: CanvasMode; label: string }[] = [
  { id: "map", label: "Map" },
  { id: "briefing", label: "Briefing" }
];

export function ArchitectureMap({ analysis, files, selectedFilePath, selectedNodeId, onSelectFile, onSelectNode }: ArchitectureMapProps) {
  const [canvasMode, setCanvasMode] = useState<CanvasMode>("map");
  const normalizedFiles = files.map(normalizePath);
  const selectedNode = analysis.graph.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedFileReason = selectedFilePath ? analysis.importantFiles.find((file) => file.path === selectedFilePath)?.reason : null;

  const selectNode = (node: ArchitectureNode) => {
    onSelectFile(filesForNode(normalizedFiles, node.id)[0] ?? null);
    onSelectNode(node.id);
  };

  const selectFile = (file: string) => {
    onSelectFile(file);
    const folder = topFolderOf(file);
    const matchingNode = analysis.graph.nodes.find((node) => node.id === folder || node.files.includes(file));

    if (matchingNode) {
      onSelectNode(matchingNode.id);
    }
  };

  return (
    <div className="flex min-h-[640px] flex-col gap-4 xl:h-full xl:min-h-0">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-[1.75rem] border border-slate-700/60 bg-slate-950/40 p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.28)_1px,transparent_1px)] [background-size:22px_22px]" />
        <div className="relative z-10 flex flex-col justify-between gap-4 2xl:flex-row 2xl:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Architecture canvas</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">Interactive map</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canvasModes.map((mode) => (
              <button
                className={cn(
                  "rounded-full border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-teal-800 hover:bg-teal-950/20 hover:text-slate-100",
                  canvasMode === mode.id && "border-teal-700 bg-teal-950/30 text-teal-100"
                )}
                key={mode.id}
                onClick={() => setCanvasMode(mode.id)}
                type="button"
              >
                {mode.label}
              </button>
            ))}
            <Badge className="border-slate-700 bg-slate-900/70 text-slate-200" variant="outline">{normalizedFiles.length} files</Badge>
          </div>
        </div>

        <div className="relative z-10 mt-4 grid min-h-0 flex-1 gap-4 xl:grid-cols-[260px_minmax(0,1fr)_300px]">
          <RepositoryTree files={normalizedFiles} selectedFilePath={selectedFilePath} onSelectFile={selectFile} />

          <div className="min-h-0">
            {canvasMode === "map" ? (
              <ArchitectureNodeGrid files={normalizedFiles} nodes={analysis.graph.nodes} selectedNodeId={selectedNodeId} onSelectNode={selectNode} />
            ) : null}

            {canvasMode === "briefing" ? <RepositoryBriefing analysis={analysis} selectedFilePath={selectedFilePath} onSelectFile={onSelectFile} /> : null}
          </div>

          <CanvasDetail
            selectedFilePath={selectedFilePath}
            selectedFileReason={selectedFileReason}
            selectedNode={selectedNode}
            selectedNodeFileCount={selectedNode ? filesForNode(normalizedFiles, selectedNode.id).length : 0}
          />
        </div>
      </div>
    </div>
  );
}
