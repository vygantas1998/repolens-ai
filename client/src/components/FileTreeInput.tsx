import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type FileTreeInputProps = {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
};

export function FileTreeInput({ value, onChange, onAnalyze, isLoading }: FileTreeInputProps) {
  return (
    <Card className="flex min-h-[640px] flex-col overflow-hidden rounded-[1.75rem] border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/30 backdrop-blur xl:h-full xl:min-h-0">
      <CardHeader className="border-b border-slate-700/60 bg-white/[0.03] p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-black tracking-tight">File tree</CardTitle>
            <CardDescription className="mt-1 text-xs">Paste one path per line. GitHub import comes later.</CardDescription>
          </div>
          <Button className="rounded-full bg-primary px-4 text-white hover:bg-primary/90" onClick={onAnalyze} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 p-0">
        <Textarea
          className="scrollbar-dark h-full min-h-[570px] flex-1 resize-none rounded-none border-0 bg-slate-950/40 p-4 font-mono text-xs leading-6 text-blue-100 shadow-none focus-visible:ring-0 xl:min-h-0"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          aria-label="Repository file tree"
        />
      </CardContent>
    </Card>
  );
}
