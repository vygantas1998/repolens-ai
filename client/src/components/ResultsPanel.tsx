import type { AnalysisResult, ArchitectureNode } from "../../../shared/analysis";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ResultsPanelProps = {
  analysis: AnalysisResult;
  selectedNode: ArchitectureNode | null;
};

export function ResultsPanel({ analysis, selectedNode }: ResultsPanelProps) {
  return (
    <aside className="border-t border-slate-800 bg-slate-950/60 p-5 backdrop-blur lg:max-h-screen lg:min-h-screen lg:overflow-y-auto lg:border-l lg:border-t-0">
      <div className="mb-5">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Inspector</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{selectedNode ? selectedNode.label : analysis.projectName}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {selectedNode ? selectedNode.description : "Select a node in the map."}
        </p>
      </div>

      <section className="mb-5 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <strong className="block text-3xl tracking-tight">{analysis.graph.nodes.length}</strong>
          <span className="text-xs text-muted-foreground">nodes</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <strong className="block text-3xl tracking-tight">{analysis.importantFiles.length}</strong>
          <span className="text-xs text-muted-foreground">important files</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <strong className="block text-3xl tracking-tight">{analysis.suggestedEntryPoints.length}</strong>
          <span className="text-xs text-muted-foreground">entry points</span>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <strong className="block text-3xl tracking-tight">{analysis.risks.length}</strong>
          <span className="text-xs text-muted-foreground">risks</span>
        </div>
      </section>

      <div className="grid gap-3">
        <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">{analysis.projectName}</CardTitle>
            <CardDescription>Architecture summary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-4 pt-0">
            <p className="text-sm leading-6 text-muted-foreground">{analysis.summary}</p>
            <div className="flex flex-wrap gap-2">
              {analysis.technologies.map((technology) => (
                <Badge className="bg-slate-800 text-slate-200 hover:bg-slate-800" variant="secondary" key={technology}>{technology}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Selected files</CardTitle>
            <CardDescription>{selectedNode ? "Files attached to the selected node." : "Select a node in the map."}</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {selectedNode ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {selectedNode.files.length > 0 ? selectedNode.files.map((file) => (
                  <li className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2" key={file}>{file}</li>
                )) : <li className="text-muted-foreground">No files are attached to this node yet.</li>}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Select a node in the map.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Open first</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {analysis.suggestedEntryPoints.map((file) => (
                <li className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2" key={file}>{file}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-rose-900/40 bg-rose-950/20 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-base">Risks</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <ul className="space-y-2 text-sm text-rose-100/80">
              {analysis.risks.map((risk) => (
                <li className="rounded-xl border border-rose-900/40 bg-rose-950/20 px-3 py-2" key={risk}>{risk}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
