import { useState } from "react";
import type { AnalysisResult, ApiErrorResponse } from "../../shared/analysis";
import { ArchitectureMap } from "@/components/ArchitectureMap";
import { FileTreeInput } from "@/components/FileTreeInput";
import { ResultsPanel } from "@/components/ResultsPanel";
import { hydrateNodeFiles, parseFileTreeText, topFolderOf } from "@/lib/fileTree";
import { sampleTree } from "@/sampleTree";

export function App() {
  const [fileTree, setFileTree] = useState(sampleTree);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const filesFromInput = () => parseFileTreeText(fileTree);
  const files = filesFromInput();
  const selectedNodeBase = analysis?.graph.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const selectedNode = selectedNodeBase ? hydrateNodeFiles(selectedNodeBase, files) : null;

  const selectFilePath = (file: string | null) => {
    setSelectedFilePath(file);

    if (!file || !analysis) return;

    const folder = topFolderOf(file);
    const matchingNode = analysis.graph.nodes.find((node) => node.id === folder || node.files.includes(file));

    if (matchingNode) {
      setSelectedNodeId(matchingNode.id);
    }
  };

  const analyzeTree = async () => {
    if (files.length === 0) {
      setError("Paste at least one file path before analyzing.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files })
      });

      if (!response.ok) {
        const body = (await response.json()) as Partial<ApiErrorResponse>;
        throw new Error(body.error?.message ?? "Analysis failed.");
      }

      const result = (await response.json()) as AnalysisResult;
      setAnalysis(result);
      setSelectedNodeId(result.graph.nodes.find((node) => node.id !== "root")?.id ?? result.graph.nodes[0]?.id ?? null);
      setSelectedFilePath(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Unknown error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-[linear-gradient(135deg,#050712,#0b1020_48%,#050712)] lg:h-screen lg:overflow-hidden lg:grid-cols-[86px_minmax(0,1fr)_370px]">
      <aside className="flex items-center justify-center border-b border-slate-800 bg-slate-950/60 p-4 backdrop-blur lg:h-screen lg:flex-col lg:justify-start lg:border-b-0 lg:border-r lg:pt-6">
        <div className="grid size-12 place-items-center rounded-2xl border border-teal-700/50 bg-teal-900/20 text-sm font-black tracking-tighter text-teal-300">RL</div>
      </aside>

      <section className="flex min-h-screen flex-col p-5 sm:p-7 lg:h-screen lg:min-h-0 lg:overflow-hidden">
        <header className="mb-5 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Dark visual repository briefing</p>
            <h1 className="mt-3 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.075em] text-foreground md:text-7xl">
              Map the repo. Find the signal.
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">
              Paste a repository tree and RepoLens turns it into a focused architecture canvas with entry points,
              risk signals, and selected-node inspection.
            </p>
          </div>
          <div className="max-w-xs border-l border-slate-800 pl-4 text-sm leading-6 text-muted-foreground xl:text-right">
            <p className="font-semibold text-slate-200">RepoLens AI</p>
            <p>React / Node / TypeScript MVP</p>
          </div>
        </header>

        <section className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[340px_minmax(0,1fr)] xl:items-stretch xl:overflow-hidden">
          <FileTreeInput value={fileTree} onChange={setFileTree} onAnalyze={analyzeTree} isLoading={isLoading} />

          {analysis ? (
            <ArchitectureMap
              analysis={analysis}
              files={files}
              selectedFilePath={selectedFilePath}
              selectedNodeId={selectedNodeId}
              onSelectFile={selectFilePath}
              onSelectNode={setSelectedNodeId}
            />
          ) : (
            <div className="relative flex min-h-[640px] items-center justify-center overflow-hidden rounded-[1.75rem] border border-dashed border-slate-700/70 bg-slate-950/40 p-8 text-center text-sm text-muted-foreground xl:min-h-0">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.28)_1px,transparent_1px)] [background-size:22px_22px]" />
              <div className="relative max-w-sm">
                <p className="text-lg font-bold text-foreground">Paste a tree and run analysis to generate the first RepoLens map.</p>
                <p className="mt-2 leading-6">The architecture canvas will appear here with clickable nodes and inspector details.</p>
              </div>
            </div>
          )}
        </section>

        {error ? <div className="mt-5 rounded-2xl border border-rose-900/50 bg-rose-950/30 px-4 py-3 text-sm text-rose-100">{error}</div> : null}
      </section>

      {analysis ? (
        <ResultsPanel
          analysis={analysis}
          selectedFilePath={selectedFilePath}
          selectedNode={selectedNode}
          onSelectFile={selectFilePath}
        />
      ) : (
        <aside className="scrollbar-inspector border-t border-slate-800 bg-slate-950/60 p-5 backdrop-blur lg:max-h-screen lg:min-h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Inspector</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">No analysis yet</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Run an analysis to inspect selected nodes, files, risks, and recommended entry points.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><strong className="block text-3xl tracking-tight">0</strong><span className="text-xs text-muted-foreground">nodes</span></div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><strong className="block text-3xl tracking-tight">0</strong><span className="text-xs text-muted-foreground">risks</span></div>
          </div>
        </aside>
      )}
    </main>
  );
}
