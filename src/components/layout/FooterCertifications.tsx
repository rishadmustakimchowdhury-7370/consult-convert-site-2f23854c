import { Shield, ShieldCheck, Lock, Bug } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const certs = [
  { name: "CEH", tip: "Certified Ethical Hacker", icon: Shield },
  { name: "OSCP", tip: "Offensive Security Certified Professional", icon: Bug },
  { name: "Security+", tip: "CompTIA Security+", icon: ShieldCheck },
];

export const FooterCertifications = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Security & Certifications</h3>
    <TooltipProvider delayDuration={200}>
      <div className="flex flex-wrap gap-3">
        {certs.map((c) => {
          const Icon = c.icon;
          return (
            <Tooltip key={c.name}>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border/50 bg-secondary/40 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-default"
                  role="img"
                  aria-label={`${c.tip} Certification`}
                >
                  <Icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground">{c.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">{c.tip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  </div>
);
