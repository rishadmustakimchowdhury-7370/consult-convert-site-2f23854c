import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
}

export const TestimonialCard = ({ name, role, company, content, rating }: TestimonialCardProps) => {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full bg-card border-2 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6 space-y-4">
        {/* Rating */}
        <div className="flex space-x-1">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-accent text-accent" />
          ))}
        </div>

        {/* Content */}
        <p className="text-foreground/80 leading-relaxed italic">"{content}"</p>

        {/* Author */}
        <div className="flex items-center space-x-3 pt-4">
          <Avatar className="w-12 h-12 bg-primary/10">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{name}</p>
            <p className="text-sm text-muted-foreground">
              {role} at {company}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
