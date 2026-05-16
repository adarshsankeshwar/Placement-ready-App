import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Lock, ClipboardCheck, CheckCircle2, FileCheck } from "lucide-react";

const CHECKLIST_KEY = "placement-test-checklist";
const SUBMISSION_KEY = "prp_final_submission";
const HISTORY_KEY = "placement-analysis-history";
const TOTAL_TESTS = 10;
const TOTAL_STEPS = 8;

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

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getProofStatus() {
  const checklistPassed = getChecklistPassed();
  const allTestsPassed = checklistPassed === TOTAL_TESTS;

  const hasHistory = hasHistoryEntries();
  const completedSteps = [true, true, hasHistory, hasHistory, hasHistory, hasHistory, hasHistory, allTestsPassed].filter(Boolean).length;
  const allStepsDone = completedSteps === TOTAL_STEPS;

  let allLinksValid = false;
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY);
    if (raw) {
      const s = JSON.parse(raw);
      allLinksValid = isValidUrl(s.lovableLink || "") && isValidUrl(s.githubLink || "") && isValidUrl(s.deployedLink || "");
    }
  } catch {}

  return { checklistPassed, allTestsPassed, completedSteps, allStepsDone, allLinksValid };
}

const Ship = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(() => getProofStatus());

  useEffect(() => {
    setStatus(getProofStatus());
  }, []);

  const isShipped = status.allStepsDone && status.allTestsPassed && status.allLinksValid;

  const conditions = [
    { label: "All 10 checklist tests passed", met: status.allTestsPassed, detail: `${status.checklistPassed}/${TOTAL_TESTS}` },
    { label: "All 8 steps completed", met: status.allStepsDone, detail: `${status.completedSteps}/${TOTAL_STEPS}` },
    { label: "All 3 proof links provided", met: status.allLinksValid, detail: status.allLinksValid ? "3/3" : "Incomplete" },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Rocket className="h-6 w-6 text-primary" />
          Ship
        </h1>
        <p className="mt-1 text-muted-foreground">
          Deploy your placement readiness platform.
        </p>
      </div>

      {isShipped ? (
        <>
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="flex flex-col items-center py-12 text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                You built a real product.
              </h2>
              <p className="text-muted-foreground max-w-sm leading-relaxed">
                Not a tutorial. Not a clone.<br />
                A structured tool that solves a real problem.<br />
                <span className="font-medium text-primary">This is your proof of work.</span>
              </p>
              <Badge variant="default" className="text-sm mt-2">✓ Shipped</Badge>
              <Button size="lg" className="gap-2 mt-2">
                <Rocket className="h-4 w-4" />
                Ship It 🚀
              </Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center py-10 text-center space-y-5">
            <Lock className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Shipping Locked
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Complete all conditions below to unlock shipping.
            </p>

            <div className="w-full max-w-sm space-y-2 text-left">
              {conditions.map((c) => (
                <div key={c.label} className="flex items-center gap-3 text-sm">
                  {c.met ? (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                  <span className={c.met ? "text-primary" : "text-foreground"}>{c.label}</span>
                  <Badge variant={c.met ? "default" : "outline"} className="ml-auto text-xs">{c.detail}</Badge>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/dashboard/test-checklist")}
              >
                <ClipboardCheck className="h-4 w-4" />
                Test Checklist
              </Button>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => navigate("/dashboard/proof")}
              >
                <FileCheck className="h-4 w-4" />
                Proof & Links
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ship;
