import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ClipboardCheck, RotateCcw, ChevronDown, AlertTriangle, CheckCircle2 } from "lucide-react";

const STORAGE_KEY = "placement-test-checklist";

interface TestItem {
  id: string;
  label: string;
  hint: string;
}

const TEST_ITEMS: TestItem[] = [
  {
    id: "jd-required",
    label: "JD required validation works",
    hint: "Go to Practice. Leave the JD textarea empty and try clicking 'Analyze & Generate Plan'. The button should be disabled.",
  },
  {
    id: "short-jd-warning",
    label: "Short JD warning shows for <200 chars",
    hint: "Type fewer than 200 characters in the JD textarea. A warning message should appear below the character count.",
  },
  {
    id: "skills-extraction",
    label: "Skills extraction groups correctly",
    hint: "Paste a JD mentioning 'React, SQL, Docker, Python'. Analyze it. The Assessments page should show skills grouped under Web, Data, Cloud/DevOps, and Languages categories.",
  },
  {
    id: "round-mapping",
    label: "Round mapping changes based on company + skills",
    hint: "Analyze with company 'Amazon' (Enterprise) → expect 4 rounds. Analyze with an unknown company (Startup) → expect 3 rounds. Check that round titles adapt to detected skills.",
  },
  {
    id: "score-deterministic",
    label: "Score calculation is deterministic",
    hint: "Analyze the same JD with the same company/role twice. Both entries should show identical base readiness scores.",
  },
  {
    id: "skill-toggles",
    label: "Skill toggles update score live",
    hint: "On the Assessments page, click skill badges to toggle between 'I know' and 'Need practice'. The readiness ring score should update immediately.",
  },
  {
    id: "persist-refresh",
    label: "Changes persist after refresh",
    hint: "Toggle some skills, note the score, then refresh the page. Navigate back to Assessments — the same toggles and score should be retained.",
  },
  {
    id: "history-saves",
    label: "History saves and loads correctly",
    hint: "Run 2–3 analyses. Go to Resources (History). All entries should appear with correct company, role, date, and score. Click one to reopen it.",
  },
  {
    id: "export-buttons",
    label: "Export buttons copy the correct content",
    hint: "On Assessments, click 'Copy 7-day plan'. Paste somewhere and verify it contains the full plan. Repeat for checklist and questions. Test 'Download as TXT'.",
  },
  {
    id: "no-console-errors",
    label: "No console errors on core pages",
    hint: "Open browser DevTools (F12 → Console). Navigate through Dashboard, Practice, Assessments, Resources. There should be no red error messages.",
  },
];

function loadChecked(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveChecked(checked: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
}

const TestChecklist = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(loadChecked);

  useEffect(() => {
    saveChecked(checked);
  }, [checked]);

  const passedCount = TEST_ITEMS.filter((t) => checked[t.id]).length;
  const allPassed = passedCount === TEST_ITEMS.length;
  const progress = (passedCount / TEST_ITEMS.length) * 100;

  const handleToggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleReset = () => {
    setChecked({});
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ClipboardCheck className="h-6 w-6 text-primary" />
          Test Checklist
        </h1>
        <p className="mt-1 text-muted-foreground">
          Verify all features before shipping. Check each item after manual testing.
        </p>
      </div>

      {/* Summary Card */}
      <Card className={allPassed ? "border-primary/50" : ""}>
        <CardContent className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {allPassed ? (
                <CheckCircle2 className="h-6 w-6 text-primary" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-destructive" />
              )}
              <div>
                <p className="font-semibold text-foreground text-lg">
                  Tests Passed: {passedCount} / {TEST_ITEMS.length}
                </p>
                {!allPassed && (
                  <p className="text-sm text-destructive">
                    Fix issues before shipping.
                  </p>
                )}
                {allPassed && (
                  <p className="text-sm text-primary">
                    All tests passed! Ready to ship.
                  </p>
                )}
              </div>
            </div>
            <Badge variant={allPassed ? "default" : "secondary"} className="text-sm">
              {allPassed ? "✓ Ready" : `${TEST_ITEMS.length - passedCount} remaining`}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Test Items */}
      <div className="space-y-2">
        {TEST_ITEMS.map((item, index) => (
          <Card key={item.id} className={checked[item.id] ? "border-primary/30 bg-primary/5" : ""}>
            <Collapsible>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={!!checked[item.id]}
                    onCheckedChange={() => handleToggle(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <CollapsibleTrigger className="flex items-center gap-2 w-full text-left group">
                      <span
                        className={`text-sm font-medium transition-colors ${
                          checked[item.id] ? "text-primary line-through" : "text-foreground"
                        }`}
                      >
                        <span className="text-muted-foreground mr-2">#{index + 1}</span>
                        {item.label}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 group-data-[state=open]:rotate-180 transition-transform" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/30 pl-3">
                        <span className="font-medium text-foreground">How to test:</span>{" "}
                        {item.hint}
                      </p>
                    </CollapsibleContent>
                  </div>
                </div>
              </CardContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Reset */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset checklist
        </Button>
      </div>
    </div>
  );
};

export default TestChecklist;
