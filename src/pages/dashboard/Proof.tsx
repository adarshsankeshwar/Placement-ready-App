import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, FileCheck, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SUBMISSION_KEY = "prp_final_submission";
const CHECKLIST_KEY = "placement-test-checklist";
const HISTORY_KEY = "placement-analysis-history";
const TOTAL_TESTS = 10;

interface Submission {
  lovableLink: string;
  githubLink: string;
  deployedLink: string;
}

const STEPS = [
  { id: 1, title: "Project Setup", description: "Scaffold the app with routing and layout" },
  { id: 2, title: "JD Input & Validation", description: "Build JD textarea with character validation" },
  { id: 3, title: "Skill Extraction Engine", description: "Parse JD to extract and group technical skills" },
  { id: 4, title: "Company Intel & Round Mapping", description: "Heuristic company analysis and interview rounds" },
  { id: 5, title: "7-Day Prep Plan", description: "Generate structured preparation schedule" },
  { id: 6, title: "Interactive Readiness Scoring", description: "Dynamic score based on skill confidence" },
  { id: 7, title: "History & Persistence", description: "Save and reload analysis entries" },
  { id: 8, title: "Test Checklist & Ship Gate", description: "Built-in QA checklist locking deployment" },
];

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function loadSubmission(): Submission {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lovableLink: "", githubLink: "", deployedLink: "" };
}

function saveSubmission(s: Submission) {
  localStorage.setItem(SUBMISSION_KEY, JSON.stringify(s));
}

function getChecklistPassed(): number {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return 0;
    return Object.values(JSON.parse(raw)).filter(Boolean).length;
  } catch {
    return 0;
  }
}

function hasHistoryEntries(): boolean {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return false;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) && arr.length > 0;
  } catch {
    return false;
  }
}

function getStepStatuses(): boolean[] {
  const hasHistory = hasHistoryEntries();
  const checklistPassed = getChecklistPassed() === TOTAL_TESTS;

  return [
    true, // 1. Project Setup — always done since app loads
    true, // 2. JD Input & Validation — built-in
    hasHistory, // 3. Skill Extraction — at least one analysis run
    hasHistory, // 4. Company Intel — part of analysis
    hasHistory, // 5. 7-Day Plan — part of analysis
    hasHistory, // 6. Readiness Scoring — part of analysis
    hasHistory, // 7. History & Persistence
    checklistPassed, // 8. Test Checklist & Ship Gate
  ];
}

const Proof = () => {
  const { toast } = useToast();
  const [submission, setSubmission] = useState<Submission>(loadSubmission);
  const [stepStatuses, setStepStatuses] = useState<boolean[]>(() => getStepStatuses());

  useEffect(() => {
    saveSubmission(submission);
  }, [submission]);

  useEffect(() => {
    setStepStatuses(getStepStatuses());
  }, []);

  const completedSteps = stepStatuses.filter(Boolean).length;
  const checklistPassed = getChecklistPassed();
  const allStepsDone = completedSteps === STEPS.length;
  const allTestsPassed = checklistPassed === TOTAL_TESTS;
  const allLinksValid =
    isValidUrl(submission.lovableLink) &&
    isValidUrl(submission.githubLink) &&
    isValidUrl(submission.deployedLink);
  const isShipped = allStepsDone && allTestsPassed && allLinksValid;

  const handleChange = (field: keyof Submission, value: string) => {
    setSubmission((prev) => ({ ...prev, [field]: value }));
  };

  const handleCopySubmission = () => {
    const text = `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${submission.lovableLink}
GitHub Repository: ${submission.githubLink}
Live Deployment: ${submission.deployedLink}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;

    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied!", description: "Final submission copied to clipboard." });
    });
  };

  const linkFields: { key: keyof Submission; label: string; placeholder: string }[] = [
    { key: "lovableLink", label: "Lovable Project Link", placeholder: "https://lovable.dev/projects/..." },
    { key: "githubLink", label: "GitHub Repository Link", placeholder: "https://github.com/..." },
    { key: "deployedLink", label: "Deployed URL", placeholder: "https://your-app.lovable.app" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileCheck className="h-6 w-6 text-primary" />
          Proof & Submission
        </h1>
        <p className="mt-1 text-muted-foreground">
          Verify all steps, provide artifact links, and export your final submission.
        </p>
      </div>

      {/* Status Badge */}
      <Card className={isShipped ? "border-primary/50" : ""}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg text-foreground">Project Status</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completedSteps}/{STEPS.length} steps · {checklistPassed}/{TOTAL_TESTS} tests · {allLinksValid ? "3/3" : `${[submission.lovableLink, submission.githubLink, submission.deployedLink].filter(isValidUrl).length}/3`} links
              </p>
            </div>
            <Badge variant={isShipped ? "default" : "secondary"} className="text-sm">
              {isShipped ? "✓ Shipped" : "In Progress"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Shipped message */}
      {isShipped && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-8 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-primary mx-auto" />
            <p className="text-lg font-semibold text-foreground">You built a real product.</p>
            <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
              Not a tutorial. Not a clone.<br />
              A structured tool that solves a real problem.<br />
              <span className="font-medium text-primary">This is your proof of work.</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step Completion Overview */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Step Completion Overview</h2>
        <div className="space-y-2">
          {STEPS.map((step, i) => (
            <Card key={step.id} className={stepStatuses[i] ? "border-primary/30 bg-primary/5" : ""}>
              <CardContent className="p-4 flex items-center gap-3">
                {stepStatuses[i] ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${stepStatuses[i] ? "text-primary" : "text-foreground"}`}>
                    Step {step.id}: {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                <Badge variant={stepStatuses[i] ? "default" : "outline"} className="text-xs shrink-0">
                  {stepStatuses[i] ? "Completed" : "Pending"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Artifact Inputs */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-3">Artifact Links</h2>
        <Card>
          <CardContent className="p-5 space-y-4">
            {linkFields.map(({ key, label, placeholder }) => {
              const value = submission[key];
              const valid = isValidUrl(value);
              const showError = value.length > 0 && !valid;
              return (
                <div key={key} className="space-y-1.5">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5" />
                    {label}
                  </Label>
                  <Input
                    value={value}
                    onChange={(e) => handleChange(key, e.target.value)}
                    placeholder={placeholder}
                    className={showError ? "border-destructive" : valid ? "border-primary/50" : ""}
                  />
                  {showError && (
                    <p className="text-xs text-destructive">Please enter a valid URL (https://...)</p>
                  )}
                  {valid && (
                    <p className="text-xs text-primary">✓ Valid URL</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Button
          onClick={handleCopySubmission}
          disabled={!allLinksValid}
          className="gap-2"
        >
          <Copy className="h-4 w-4" />
          Copy Final Submission
        </Button>
      </div>
    </div>
  );
};

export default Proof;
