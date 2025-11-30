import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  link: string;
}

export const ServiceCard = ({ title, description, icon: Icon, link }: ServiceCardProps) => {
  return (
    <Link to={link} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/50 bg-card">
        <CardHeader className="space-y-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <Icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
          </div>
          <CardTitle className="text-xl group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            {description}
          </CardDescription>
          <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-2 transition-transform">
            Learn more
            <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};
