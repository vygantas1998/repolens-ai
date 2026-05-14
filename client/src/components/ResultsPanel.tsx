import type { AnalysisResult, ArchitectureNode } from "../../../shared/analysis";
import { ImportantFilesCard, NodeFilesCard, NodeOverviewCard, NoSelectionCard } from "@/components/InspectorCards";

type ResultsPanelProps = {
  analysis: AnalysisResult;
  selectedFilePath: string | null;
  selectedNode: ArchitectureNode | null;
  onSelectFile: (file: string) => void;
};

export function ResultsPanel({ analysis, selectedFilePath, selectedNode, onSelectFile }: ResultsPanelProps) {
  const selectedNodeImportantFiles = selectedNode
    ? analysis.importantFiles.filter((file) => selectedNode.files.includes(file.path))
    : [];

  return (
    <aside className="scrollbar-inspector border-t border-slate-800 bg-slate-950/60 p-5 backdrop-blur lg:max-h-screen lg:min-h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Inspector</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Selection</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Node context from the canvas.</p>
      </div>

      <div className="grid gap-3">
        {selectedNode ? (
          <>
            <NodeOverviewCard selectedNode={selectedNode} importantFileCount={selectedNodeImportantFiles.length} />
            <ImportantFilesCard files={selectedNodeImportantFiles} onSelectFile={onSelectFile} />
            <NodeFilesCard files={selectedNode.files} selectedFilePath={selectedFilePath} onSelectFile={onSelectFile} />
          </>
        ) : (
          <NoSelectionCard />
        )}
      </div>
    </aside>
  );
}
