import type { AnalysisResult } from "../../../shared/analysis";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RepositoryBriefingProps = {
  analysis: AnalysisResult;
  selectedFilePath: string | null;
  onSelectFile: (file: string) => void;
};

export function RepositoryBriefing({ analysis, selectedFilePath, onSelectFile }: RepositoryBriefingProps) {
  return (
    <section className="grid gap-4 rounded-[1.5rem] border border-slate-800 bg-slate-950/70 p-4 shadow-lg shadow-black/20 2xl:grid-cols-[minmax(0,1fr)_280px_280px]">
      <div className="min-w-0">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Repository briefing</p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">{analysis.projectType}</h2>
          </div>
          <Badge className="border-teal-700/50 bg-teal-900/20 text-teal-200" variant="outline">{analysis.graph.nodes.length} nodes</Badge>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Metric value={analysis.graph.nodes.length} label="nodes" />
          <Metric value={analysis.importantFiles.length} label="important" />
          <Metric value={analysis.suggestedEntryPoints.length} label="entry points" />
          <Metric value={analysis.risks.length} label="risks" />
        </div>
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">{analysis.summary}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {analysis.technologies.map((technology) => (
            <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-800" variant="secondary" key={technology}>{technology}</Badge>
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-primary">Open first</p>
        <div className="grid gap-2">
          {analysis.suggestedEntryPoints.slice(0, 5).map((file) => (
            <button
              className={cn(
                "truncate rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-left font-mono text-[11px] text-muted-foreground transition-colors hover:border-teal-800 hover:bg-teal-950/20 hover:text-slate-100",
                selectedFilePath === file && "border-teal-700 bg-teal-950/30 text-slate-100"
              )}
              key={file}
              onClick={() => onSelectFile(file)}
              type="button"
            >
              {file}
            </button>
          ))}
        </div>
      </div>

      <div className="min-w-0">
        <p className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-primary">Risks</p>
        {analysis.risks.length > 0 ? (
          <ul className="grid gap-2 text-sm leading-5 text-muted-foreground">
            {analysis.risks.map((risk) => (
              <li className="rounded-xl border border-amber-900/40 bg-amber-950/15 px-3 py-2 text-amber-100/80" key={risk}>{risk}</li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-muted-foreground">No structural risks detected from this file tree.</p>
        )}
      </div>
    </section>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-3 py-2">
      <strong className="block text-xl tracking-tight text-slate-100">{value}</strong>
      <span className="text-[11px] text-muted-foreground">{label}</span>
    </div>
  );
}
