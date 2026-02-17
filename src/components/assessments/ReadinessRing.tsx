import { Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ReadinessRingProps {
  score: number;
}

const ReadinessRing = ({ score }: ReadinessRingProps) => {
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" /> Readiness Score
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pb-8">
        <div className="relative">
          <svg width="150" height="150" viewBox="0 0 150 150" className="-rotate-90">
            <circle cx="75" cy="75" r={RADIUS} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle
              cx="75" cy="75" r={RADIUS} fill="none"
              stroke="hsl(var(--primary))" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE} strokeDashoffset={offset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-foreground transition-all duration-300">{score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReadinessRing;
