import { Tag } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SkillCategory } from "@/lib/analysis";

interface SkillTagsProps {
  extractedSkills: SkillCategory[];
  confidenceMap: Record<string, "know" | "practice">;
  onToggle: (skill: string) => void;
}

const SkillTags = ({ extractedSkills, confidenceMap, onToggle }: SkillTagsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Tag className="h-4 w-4 text-primary" /> Key Skills Extracted
        </CardTitle>
        <p className="text-xs text-muted-foreground">Click a skill to toggle confidence</p>
      </CardHeader>
      <CardContent className="space-y-3">
        {extractedSkills.map((cat) => (
          <div key={cat.name}>
            <p className="text-xs font-medium text-muted-foreground mb-1">{cat.name}</p>
            <div className="flex flex-wrap gap-1.5">
              {cat.skills.map((s) => {
                const status = confidenceMap[s] || "practice";
                const isKnown = status === "know";
                return (
                  <Badge
                    key={s}
                    variant={isKnown ? "default" : "secondary"}
                    className="text-xs cursor-pointer select-none transition-all duration-200 hover:scale-105"
                    onClick={() => onToggle(s)}
                  >
                    {isKnown ? "✓ " : "○ "}{s}
                  </Badge>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SkillTags;
