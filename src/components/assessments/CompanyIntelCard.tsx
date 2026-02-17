import { Building2, Users, Briefcase, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CompanyIntel } from "@/lib/analysis";

interface CompanyIntelCardProps {
  intel: CompanyIntel;
}

const sizeIcon: Record<string, string> = {
  Startup: "🚀",
  "Mid-size": "🏢",
  Enterprise: "🏛️",
};

const CompanyIntelCard = ({ intel }: CompanyIntelCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Company Intel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Company
            </p>
            <p className="text-sm font-semibold text-foreground">{intel.companyName}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Briefcase className="h-3 w-3" /> Industry
            </p>
            <p className="text-sm text-foreground">{intel.industry}</p>
          </div>
          <div className="space-y-1 col-span-2">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" /> Estimated Size
            </p>
            <Badge variant="secondary" className="text-xs">
              {sizeIcon[intel.size]} {intel.size}
              {intel.size === "Startup" && " (<200)"}
              {intel.size === "Mid-size" && " (200–2000)"}
              {intel.size === "Enterprise" && " (2000+)"}
            </Badge>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
            <Info className="h-3 w-3" /> Typical Hiring Focus
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{intel.hiringFocus}</p>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <p className="text-[10px] text-muted-foreground/60 italic">
          Demo Mode: Company intel generated heuristically.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CompanyIntelCard;
