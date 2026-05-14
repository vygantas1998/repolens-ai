import type { ArchitectureNode, ImportantFile } from "../../../shared/analysis";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type NodeOverviewCardProps = {
  importantFileCount: number;
  selectedNode: ArchitectureNode;
};

type FileCardProps = {
  selectedFilePath: string | null;
  files: string[];
  onSelectFile: (file: string) => void;
};

type ImportantFilesCardProps = {
  files: ImportantFile[];
  onSelectFile: (file: string) => void;
};

export function NodeOverviewCard({ importantFileCount, selectedNode }: NodeOverviewCardProps) {
  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">Node overview</CardTitle>
        <CardDescription>{selectedNode.type} module</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4 pt-0">
        <p className="text-sm leading-6 text-muted-foreground">{selectedNode.description}</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2">
            <strong className="block text-xl text-slate-100">{selectedNode.files.length}</strong>
            <span className="text-xs text-muted-foreground">node files</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2">
            <strong className="block text-xl text-slate-100">{importantFileCount}</strong>
            <span className="text-xs text-muted-foreground">important here</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ImportantFilesCard({ files, onSelectFile }: ImportantFilesCardProps) {
  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">Important here</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {files.length > 0 ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {files.map((file) => (
              <li className="rounded-xl border border-teal-900/40 bg-teal-950/20 px-3 py-2" key={file.path}>
                <button className="text-left font-semibold text-teal-100 hover:text-white" onClick={() => onSelectFile(file.path)} type="button">
                  {file.path}
                </button>
                <p className="mt-1 leading-5 text-teal-100/70">{file.reason}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">No highlighted important files are attached to this node.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function NodeFilesCard({ files, selectedFilePath, onSelectFile }: FileCardProps) {
  const fileButtonClassName = (file: string) => cn(
    "w-full rounded-xl border border-slate-800 bg-slate-950/50 px-3 py-2 text-left transition-colors hover:border-teal-800 hover:bg-teal-950/20 hover:text-slate-100",
    selectedFilePath === file && "border-teal-700 bg-teal-950/30 text-slate-100"
  );

  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">Files in this node</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {files.length > 0 ? (
          <ul className="space-y-2 text-sm text-muted-foreground">
            {files.map((file) => (
              <li key={file}>
                <button className={fileButtonClassName(file)} onClick={() => onSelectFile(file)} type="button">
                  {file}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">No files are attached to this node yet.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function NoSelectionCard() {
  return (
    <Card className="rounded-3xl border-slate-800 bg-slate-900/70 shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">No selection</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm leading-6 text-muted-foreground">Select a node or file in the architecture canvas to inspect it here.</p>
      </CardContent>
    </Card>
  );
}
