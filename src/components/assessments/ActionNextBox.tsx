import { Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ActionNextBoxProps {
  weakSkills: string[];
}

const ActionNextBox = ({ weakSkills }: ActionNextBoxProps) => {
  const top3 = weakSkills.slice(0, 3);

  if (top3.length === 0) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5 text-center">
          <p className="text-sm font-medium text-primary">🎉 You've marked all skills as known. Great job!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" /> Action Next
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1.5">Top weak skills to focus on:</p>
          <div className="flex flex-wrap gap-1.5">
            {top3.map((s) => (
              <Badge key={s} variant="outline" className="text-xs border-primary/30 text-primary">
                {s}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-sm font-medium text-foreground">
          👉 Start Day 1 plan now.
        </p>
      </CardContent>
    </Card>
  );
};

export default ActionNextBox;
