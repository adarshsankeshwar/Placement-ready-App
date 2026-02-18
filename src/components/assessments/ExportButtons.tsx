import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import type { AnalysisEntry } from "@/lib/analysis";

interface ExportButtonsProps {
  entry: AnalysisEntry;
}

function copyToClipboard(text: string, label: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast({ title: `${label} copied to clipboard` });
  });
}

function formatPlan(entry: AnalysisEntry): string {
  return entry.plan
    .map((d) => `${d.day}: ${d.focus}\n${d.tasks.map((t) => `  • ${t}`).join("\n")}`)
    .join("\n\n");
}

function formatChecklist(entry: AnalysisEntry): string {
  return entry.checklist
    .map((r) => `${r.round} — ${r.title}\n${r.items.map((i) => `  ☐ ${i}`).join("\n")}`)
    .join("\n\n");
}

function formatQuestions(entry: AnalysisEntry): string {
  return entry.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
}

function formatAll(entry: AnalysisEntry): string {
  return [
    `=== PLACEMENT ANALYSIS ===`,
    `Company: ${entry.company || "N/A"}`,
    `Role: ${entry.role || "N/A"}`,
    `Readiness Score: ${entry.finalScore ?? entry.baseScore}/100`,
    `Date: ${new Date(entry.createdAt).toLocaleDateString()}`,
    ``,
    `=== 7-DAY PLAN ===`,
    formatPlan(entry),
    ``,
    `=== ROUND CHECKLIST ===`,
    formatChecklist(entry),
    ``,
    `=== 10 INTERVIEW QUESTIONS ===`,
    formatQuestions(entry),
  ].join("\n");
}

const ExportButtons = ({ entry }: ExportButtonsProps) => {
  const handleDownload = () => {
    const text = formatAll(entry);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `placement-prep-${entry.company || "analysis"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardContent className="flex flex-wrap gap-2 p-4">
        <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatPlan(entry), "7-day plan")}>
          <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy 7-day plan
        </Button>
        <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatChecklist(entry), "Checklist")}>
          <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy round checklist
        </Button>
        <Button variant="outline" size="sm" onClick={() => copyToClipboard(formatQuestions(entry), "Questions")}>
          <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy 10 questions
        </Button>
        <Button variant="secondary" size="sm" onClick={handleDownload}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> Download as TXT
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportButtons;
