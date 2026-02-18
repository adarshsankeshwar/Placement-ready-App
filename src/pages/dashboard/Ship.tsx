import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Lock, ClipboardCheck, CheckCircle2 } from "lucide-react";

const CHECKLIST_KEY = "placement-test-checklist";
const TOTAL_TESTS = 10;

function getPassedCount(): number {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw);
    return Object.values(parsed).filter(Boolean).length;
  } catch {
    return 0;
  }
}

const Ship = () => {
  const navigate = useNavigate();
  const [passed, setPassed] = useState(0);

  useEffect(() => {
    setPassed(getPassedCount());
  }, []);

  const allPassed = passed >= TOTAL_TESTS;

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

      {allPassed ? (
        <Card className="border-primary/50">
          <CardContent className="flex flex-col items-center py-12 text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">
              All Tests Passed!
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Your platform has been verified and is ready for deployment.
              All {TOTAL_TESTS} test items have been checked off.
            </p>
            <Button size="lg" className="gap-2 mt-2">
              <Rocket className="h-4 w-4" />
              Ship It 🚀
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-destructive/30">
          <CardContent className="flex flex-col items-center py-12 text-center space-y-4">
            <Lock className="h-16 w-16 text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">
              Shipping Locked
            </h2>
            <p className="text-muted-foreground max-w-sm">
              You've passed <span className="font-bold text-foreground">{passed}</span> of{" "}
              <span className="font-bold text-foreground">{TOTAL_TESTS}</span> tests.
              Complete all test checklist items before shipping.
            </p>
            <Button
              variant="outline"
              className="gap-2 mt-2"
              onClick={() => navigate("/dashboard/test-checklist")}
            >
              <ClipboardCheck className="h-4 w-4" />
              Go to Test Checklist
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ship;
