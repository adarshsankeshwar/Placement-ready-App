import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from "recharts";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";

const skillData = [
  { subject: "DSA", value: 75 },
  { subject: "System Design", value: 60 },
  { subject: "Communication", value: 80 },
  { subject: "Resume", value: 85 },
  { subject: "Aptitude", value: 70 },
];

const assessments = [
  { title: "DSA Mock Test", date: "Tomorrow", time: "10:00 AM" },
  { title: "System Design Review", date: "Wed", time: "2:00 PM" },
  { title: "HR Interview Prep", date: "Friday", time: "11:00 AM" },
];

const weekDays = [
  { day: "M", active: true },
  { day: "T", active: true },
  { day: "W", active: false },
  { day: "T", active: true },
  { day: "F", active: true },
  { day: "S", active: false },
  { day: "S", active: false },
];

const SCORE = 72;
const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const OFFSET = CIRCUMFERENCE - (SCORE / 100) * CIRCUMFERENCE;

const DashboardHome = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

    <div className="grid gap-6 md:grid-cols-2">
      {/* Overall Readiness */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Overall Readiness</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center pb-8">
          <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
            <circle cx="90" cy="90" r={RADIUS} fill="none" stroke="hsl(var(--muted))" strokeWidth="12" />
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={OFFSET}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute mt-[52px] flex flex-col items-center">
            <span className="text-4xl font-bold text-foreground">{SCORE}</span>
            <span className="text-xs text-muted-foreground">Readiness Score</span>
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Skill Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={skillData} outerRadius="75%">
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Continue Practice */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Continue Practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-foreground">Dynamic Programming</p>
            <p className="text-sm text-muted-foreground">3 of 10 problems completed</p>
          </div>
          <Progress value={30} className="h-2" />
          <Button className="w-full gap-2">
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Problems Solved</span>
              <span className="font-medium text-foreground">12/20</span>
            </div>
            <Progress value={60} className="h-2" />
          </div>
          <div className="flex justify-between pt-2">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    d.active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {d.day}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Assessments */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Upcoming Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {assessments.map((a) => (
              <div key={a.title} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="font-medium text-foreground">{a.title}</span>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" />{a.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default DashboardHome;
