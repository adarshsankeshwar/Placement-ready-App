import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import type { RoundMapping } from "@/lib/analysis";

interface RoundTimelineProps {
  rounds: RoundMapping[];
}

const RoundTimeline = ({ rounds }: RoundTimelineProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" /> Expected Round Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[9px] top-1 bottom-1 w-0.5 bg-primary/20" />

          <div className="space-y-5">
            {rounds.map((r, i) => (
              <div key={r.round} className="relative">
                {/* Dot */}
                <div className="absolute -left-6 top-0.5 flex items-center justify-center h-[18px] w-[18px] rounded-full bg-primary/10 border-2 border-primary">
                  <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    <span className="text-primary mr-1.5">{r.round}:</span>
                    {r.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {r.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-[10px] text-muted-foreground/60 italic">
          Round mapping adapts to company size and detected skills.
        </p>
      </CardFooter>
    </Card>
  );
};

export default RoundTimeline;
