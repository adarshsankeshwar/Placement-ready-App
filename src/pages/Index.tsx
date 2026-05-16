import { useNavigate } from "react-router-dom";
import { Code, Video, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  { icon: Code, title: "Practice Problems", description: "Sharpen your coding skills with curated problem sets across all difficulty levels." },
  { icon: Video, title: "Mock Interviews", description: "Simulate real interview scenarios with timed sessions and structured feedback." },
  { icon: BarChart3, title: "Track Progress", description: "Visualize your growth with detailed analytics and performance insights." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
          Ace Your <span className="text-primary">Placement</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Practice, assess, and prepare for your dream job
        </p>
        <Button size="lg" className="mt-8 text-base px-8" onClick={() => navigate("/dashboard")}>
          Get Started
        </Button>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="border-primary/10 hover:shadow-md transition-shadow">
              <CardHeader className="items-center text-center">
                <f.icon className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t">
        © {new Date().getFullYear()} Placement Readiness Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
