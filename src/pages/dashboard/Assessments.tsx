import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import type { AnalysisEntry } from "@/lib/analysis";
import { getEntryById } from "@/lib/history";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Target,
  ListChecks,
  CalendarDays,
  HelpCircle,
  ArrowLeft,
  Tag,
} from "lucide-react";

const RADIUS = 60;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const Assessments = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<AnalysisEntry | null>(null);

  useEffect(() => {
    const id = searchParams.get("id") || localStorage.getItem("placement-latest-id");
    if (id) {
      const found = getEntryById(id);
      if (found) setEntry(found);
    }
  }, [searchParams]);

  if (!entry) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <Target className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">No Analysis Yet</h2>
        <p className="text-muted-foreground max-w-sm">
          Paste a job description in the Practice tab to generate your personalized preparation plan.
        </p>
        <Button variant="outline" onClick={() => navigate("/dashboard/practice")}>
          Go to JD Analyzer
        </Button>
      </div>
    );
  }

  const offset = CIRCUMFERENCE - (entry.readinessScore / 100) * CIRCUMFERENCE;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analysis Results</h1>
          <p className="text-sm text-muted-foreground">
            {entry.company && `${entry.company} · `}{entry.role && `${entry.role} · `}
            {new Date(entry.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Score + Skills Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Readiness Score */}
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
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{entry.readinessScore}</span>
                <span className="text-xs text-muted-foreground">/ 100</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Extracted Skills */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" /> Key Skills Extracted
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {entry.extractedSkills.map((cat) => (
              <div key={cat.name}>
                <p className="text-xs font-medium text-muted-foreground mb-1">{cat.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {cat.skills.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Checklist, Plan, Questions */}
      <Tabs defaultValue="checklist">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="checklist" className="gap-1.5 text-xs sm:text-sm">
            <ListChecks className="h-3.5 w-3.5" /> Checklist
          </TabsTrigger>
          <TabsTrigger value="plan" className="gap-1.5 text-xs sm:text-sm">
            <CalendarDays className="h-3.5 w-3.5" /> 7-Day Plan
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-1.5 text-xs sm:text-sm">
            <HelpCircle className="h-3.5 w-3.5" /> Questions
          </TabsTrigger>
        </TabsList>

        {/* Checklist Tab */}
        <TabsContent value="checklist" className="space-y-4 mt-4">
          {entry.checklist.map((round) => (
            <Card key={round.round}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  <span className="text-primary font-bold mr-2">{round.round}</span>
                  {round.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {round.items.map((item, i) => (
                  <label key={i} className="flex items-start gap-2 text-sm cursor-pointer group">
                    <Checkbox className="mt-0.5" />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {item}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* 7-Day Plan Tab */}
        <TabsContent value="plan" className="space-y-4 mt-4">
          {entry.plan.map((day, i) => (
            <Card key={day.day}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>
                    <span className="text-primary font-bold mr-2">{day.day}</span>
                    {day.focus}
                  </span>
                  <span className="text-xs text-muted-foreground font-normal">
                    {i + 1}/7
                  </span>
                </CardTitle>
                <Progress value={((i + 1) / 7) * 100} className="h-1" />
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {day.tasks.map((task, j) => (
                    <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {task}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Questions Tab */}
        <TabsContent value="questions" className="space-y-3 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">10 Likely Interview Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {entry.questions.map((q, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{q}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assessments;
