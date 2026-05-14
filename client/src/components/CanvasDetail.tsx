import type { ArchitectureNode } from "../../../shared/analysis";
import { fileNameOf } from "@/lib/fileTree";

type CanvasDetailProps = {
  selectedFilePath: string | null;
  selectedFileReason: string | null | undefined;
  selectedNode: ArchitectureNode | null;
  selectedNodeFileCount: number;
};

export function CanvasDetail({ selectedFilePath, selectedFileReason, selectedNode, selectedNodeFileCount }: CanvasDetailProps) {
  return (
    <section className="scrollbar-dark min-h-0 overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950/60 p-4">
      <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Canvas detail</p>
      <h3 className="mt-2 text-xl font-bold tracking-tight">{selectedFilePath ? fileNameOf(selectedFilePath) : selectedNode?.label ?? "Select a node"}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {selectedFilePath ? selectedFilePath : selectedNode?.description ?? "Select a module or file to inspect it here."}
      </p>
      {selectedFileReason ? (
        <div className="mt-4 rounded-2xl border border-teal-900/40 bg-teal-950/20 p-3 text-sm leading-6 text-teal-100/80">
          <strong className="block text-teal-100">Why it matters</strong>
          {selectedFileReason}
        </div>
      ) : null}
      {selectedNode && !selectedFilePath ? (
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-muted-foreground">
          {selectedNodeFileCount > 0 ? "Click a file in the tree to see file-level details." : "This node has no attached files yet."}
        </div>
      ) : null}
    </section>
  );
}
