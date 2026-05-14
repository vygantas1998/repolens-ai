import type { ArchitectureNode } from "../../../shared/analysis";
import { Button } from "@/components/ui/button";
import { filesForNode } from "@/lib/fileTree";
import { cn } from "@/lib/utils";

type ArchitectureNodeGridProps = {
  files: string[];
  nodes: ArchitectureNode[];
  selectedNodeId: string | null;
  onSelectNode: (node: ArchitectureNode) => void;
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
  root: "border-cyan-300/70 bg-cyan-950/45",
  frontend: "border-blue-400/70 bg-blue-950/45",
  backend: "border-lime-300/80 bg-lime-950/45",
  api: "border-sky-300/70 bg-sky-950/45",
  data: "border-violet-300/70 bg-violet-950/45",
  config: "border-slate-300/70 bg-slate-800/80",
  docs: "border-amber-300/70 bg-amber-950/45",
  unknown: "border-slate-500/70 bg-slate-900/95"
};

const nodeTypeTextClasses: Record<string, string> = {
  root: "text-cyan-200",
  frontend: "text-blue-300",
  backend: "text-lime-200",
  api: "text-sky-300",
  data: "text-violet-300",
  config: "text-slate-300",
  docs: "text-amber-300",
  unknown: "text-slate-300"
};

export function ArchitectureNodeGrid({ files, nodes, selectedNodeId, onSelectNode }: ArchitectureNodeGridProps) {
  return (
    <section className="scrollbar-dark grid min-h-0 content-start gap-4 overflow-y-auto px-1 py-2 md:grid-cols-2 2xl:grid-cols-3">
      {nodes.map((node) => (
        <Button
          className={cn(
            "h-auto min-h-36 flex-col items-stretch justify-start rounded-[1.35rem] border p-4 text-left text-foreground shadow-lg shadow-black/20 transition-all hover:-translate-y-1 hover:border-white/30 hover:bg-slate-800/90",
            nodeTypeClasses[node.type],
            selectedNodeId === node.id && "border-white/80 outline outline-2 outline-offset-2 outline-teal-300/70"
          )}
          variant="ghost"
          key={node.id}
          onClick={() => onSelectNode(node)}
        >
          <span className="mb-4 flex w-full items-start justify-between gap-3">
            <span className={cn("text-[11px] font-black uppercase tracking-[0.16em]", nodeTypeTextClasses[node.type])}>
              {nodeTypeLabels[node.type]}
            </span>
            <span className="text-xs text-muted-foreground">{filesForNode(files, node.id).length} files</span>
          </span>
          <strong className="mb-1 block text-lg font-bold tracking-tight text-foreground">{node.label}</strong>
          <small className="block whitespace-normal text-sm leading-5 text-muted-foreground">{node.description}</small>
        </Button>
      ))}
    </section>
  );
}
