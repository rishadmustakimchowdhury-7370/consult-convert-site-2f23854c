import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TestimonialCardProps {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  image_url?: string | null;
}

export const TestimonialCard = ({ name, role, company, content, rating = 5, image_url }: TestimonialCardProps) => {
  const initials = name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card className="h-full bg-card border border-border/50 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden">
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-6 lg:p-8 space-y-5 relative z-10">
        {/* Quote icon */}
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Quote className="w-5 h-5 text-primary" />
          </div>
          {/* Rating */}
          <div className="flex gap-0.5">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>

        {/* Content */}
        <p className="text-foreground/85 leading-relaxed text-sm lg:text-base line-clamp-4 min-h-[80px]">
          "{content}"
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

        {/* Author */}
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
            {image_url && <AvatarImage src={image_url} alt={`${name} - Client testimonial for ecommerce website design services`} />}
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{name}</p>
            {(role || company) && (
              <p className="text-sm text-muted-foreground truncate">
                {role}{role && company && " at "}{company}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
