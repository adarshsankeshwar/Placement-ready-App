import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHistory, deleteEntry } from "@/lib/history";
import type { AnalysisEntry } from "@/lib/analysis";
import { History, Trash2, ChevronRight, FileText } from "lucide-react";

const Resources = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<AnalysisEntry[]>([]);

  useEffect(() => {
    setEntries(getHistory());
  }, []);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setEntries(getHistory());
  };

  const handleOpen = (id: string) => {
    localStorage.setItem("placement-latest-id", id);
    navigate(`/dashboard/assessments?id=${id}`);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <History className="h-6 w-6 text-primary" />
          Analysis History
        </h1>
        <p className="mt-1 text-muted-foreground">
          All your past JD analyses, persisted locally.
        </p>
      </div>

      {entries.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center py-12 text-center space-y-3">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No analyses yet. Go to Practice to analyze a JD.</p>
            <Button variant="outline" onClick={() => navigate("/dashboard/practice")}>
              Analyze a JD
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => handleOpen(entry.id)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground truncate">
                      {entry.company || "Unknown Company"}
                    </span>
                    {entry.role && (
                      <Badge variant="secondary" className="text-xs">
                        {entry.role}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(entry.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-lg font-bold text-primary">{entry.readinessScore}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Resources;
