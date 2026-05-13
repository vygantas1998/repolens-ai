import type { AnalysisResult } from "../../../shared/analysis";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ArchitectureMapProps = {
  analysis: AnalysisResult;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
};

const nodeTypeLabels: Record<string, string> = {
  root: "Core",
  frontend: "UI",
  backend: "Server",
  api: "API",
  data: "Data",
  config: "Config",
  docs: "Docs",
  unknown: "Module"
};

const nodeTypeClasses: Record<string, string> = {
  root: "border-teal-700/70 bg-teal-950/20",
  frontend: "border-blue-400/40",
  backend: "border-emerald-400/40",
  api: "border-sky-400/40",
  data: "border-violet-400/40",
  config: "border-slate-400/40",
  docs: "border-amber-400/40",
  unknown: "border-slate-500/50"
};

const nodeTypeTextClasses: Record<string, string> = {
  root: "text-teal-300",
  frontend: "text-blue-300",
  backend: "text-emerald-300",
  api: "text-sky-300",
  data: "text-violet-300",
  config: "text-slate-300",
  docs: "text-amber-300",
  unknown: "text-slate-300"
};

export function ArchitectureMap({ analysis, selectedNodeId, onSelectNode }: ArchitectureMapProps) {
  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-[1.75rem] border border-slate-700/60 bg-slate-950/40 p-5">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.28)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Architecture canvas</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">{analysis.projectType}</h2>
        </div>
        <Badge className="border-teal-700/50 bg-teal-900/20 text-teal-200" variant="outline">{analysis.graph.nodes.length} nodes</Badge>
      </div>

      <div className="relative z-10 mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {analysis.graph.nodes.map((node) => (
          <Button
            className={cn(
              "h-auto min-h-36 flex-col items-stretch justify-start rounded-[1.35rem] border bg-slate-900/90 p-4 text-left text-foreground shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 hover:bg-slate-900",
              nodeTypeClasses[node.type],
              selectedNodeId === node.id && "border-primary bg-teal-950/30 ring-1 ring-primary"
            )}
            variant="ghost"
            key={node.id}
            onClick={() => onSelectNode(node.id)}
          >
            <span className="mb-4 flex w-full items-start justify-between gap-3">
              <span className={cn("text-[11px] font-black uppercase tracking-[0.16em]", nodeTypeTextClasses[node.type])}>
                {nodeTypeLabels[node.type]}
              </span>
              <span className="text-xs text-muted-foreground">{node.files.length} files</span>
            </span>
            <strong className="mb-1 block text-lg font-bold tracking-tight text-foreground">{node.label}</strong>
            <small className="block whitespace-normal text-sm leading-5 text-muted-foreground">{node.description}</small>
          </Button>
        ))}
      </div>
    </div>
  );
}
