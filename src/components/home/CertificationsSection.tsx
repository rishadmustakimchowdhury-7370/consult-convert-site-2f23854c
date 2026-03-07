import { motion } from "framer-motion";
import { Shield, ShieldCheck, Lock, Bug, Search, FileText, Wrench, ScanLine } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const certifications = [
  {
    name: "CEH",
    fullName: "Certified Ethical Hacker",
    description:
      "Advanced penetration testing and ethical hacking certification.",
    icon: Shield,
  },
  {
    name: "OSCP",
    fullName: "Offensive Security Certified Professional",
    description:
      "Hands-on penetration testing certification from Offensive Security.",
    icon: Bug,
  },
  {
    name: "Security+",
    fullName: "CompTIA Security+",
    description:
      "CompTIA certification validating foundational cybersecurity skills.",
    icon: ShieldCheck,
  },
  {
    name: "OWASP",
    fullName: "OWASP Security Professional",
    description:
      "Expertise in OWASP Top 10 web application security vulnerabilities.",
    icon: Lock,
  },
];

const methodologySteps = [
  { label: "Reconnaissance", icon: Search },
  { label: "Vulnerability Scanning", icon: ScanLine },
  { label: "Exploitation", icon: Bug },
  { label: "Post Exploitation", icon: Lock },
  { label: "Detailed Security Report", icon: FileText },
  { label: "Remediation Guidance", icon: Wrench },
];

export const CertificationsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.03] to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-3 block">
            Verified Professionals
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Trusted Cybersecurity{" "}
            <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our team holds industry-recognised certifications, ensuring every
            engagement meets the highest security standards.
          </p>
        </motion.div>

        <TooltipProvider delayDuration={200}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap justify-center gap-5 md:gap-8 mb-20"
          >
            {certifications.map((cert, idx) => {
              const Icon = cert.icon;
              return (
                <Tooltip key={cert.name}>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover={{ scale: 1.06, y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group flex flex-col items-center gap-3 px-6 py-5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm cursor-default hover:border-primary/40 hover:shadow-[0_0_24px_hsl(var(--primary)/0.12)] transition-all duration-300 w-[140px] md:w-[170px]"
                      role="img"
                      aria-label={`${cert.fullName} Certification`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <span className="text-sm font-bold tracking-wide text-foreground">
                        {cert.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground leading-tight text-center">
                        {cert.fullName}
                      </span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="max-w-[220px] text-center"
                  >
                    <p className="font-semibold mb-1">{cert.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      {cert.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </motion.div>
        </TooltipProvider>

        {/* Methodology */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            Our Penetration Testing{" "}
            <span className="gradient-text">Methodology</span>
          </h3>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            A structured, repeatable approach that mirrors real-world attack
            scenarios and delivers actionable findings.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto"
        >
          {methodologySteps.map((step, idx) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * idx }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/40 bg-card/40 hover:border-primary/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <StepIcon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight">
                  {step.label}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  0{idx + 1}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
