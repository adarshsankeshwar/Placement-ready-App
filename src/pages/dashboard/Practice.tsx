import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { runAnalysis } from "@/lib/analysis";
import { saveEntry } from "@/lib/history";
import { Search, FileText, Sparkles } from "lucide-react";

const Practice = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    setLoading(true);
    // Simulate brief processing
    setTimeout(() => {
      const entry = runAnalysis(company.trim(), role.trim(), jdText.trim());
      saveEntry(entry);
      localStorage.setItem("placement-latest-id", entry.id);
      setLoading(false);
      navigate("/dashboard/assessments");
    }, 600);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          JD Analyzer
        </h1>
        <p className="mt-1 text-muted-foreground">
          Paste a job description to get a personalized preparation plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Job Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name (optional)</Label>
              <Input
                id="company"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role (optional)</Label>
              <Input
                id="role"
                placeholder="e.g. SDE Intern"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jd">Job Description</Label>
            <Textarea
              id="jd"
              placeholder="Paste the full job description here..."
              className="min-h-[200px] resize-y"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {jdText.length} characters {jdText.length > 800 && "✓ Detailed JD detected"}
            </p>
          </div>
          <Button
            size="lg"
            className="w-full gap-2"
            onClick={handleAnalyze}
            disabled={!jdText.trim() || loading}
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Analyzing..." : "Analyze & Generate Plan"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Practice;
