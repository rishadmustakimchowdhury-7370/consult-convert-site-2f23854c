import { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, X, AlertTriangle, Globe, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calculateSEOScore, type SEOScoreResult } from '@/utils/seoScoring';

interface SEOAnalyzerProps {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  focusKeyword: string;
  onScoreChange?: (score: number) => void;
}

export default function SEOAnalyzer({
  title,
  slug,
  metaTitle,
  metaDescription,
  content,
  focusKeyword,
  onScoreChange,
}: SEOAnalyzerProps) {
  const result: SEOScoreResult = useMemo(
    () => calculateSEOScore({ title, slug, metaTitle, metaDescription, content, focusKeyword }),
    [title, slug, metaTitle, metaDescription, content, focusKeyword]
  );

  useEffect(() => {
    onScoreChange?.(result.score);
  }, [result.score, onScoreChange]);

  const { score, checks, readability } = result;

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = () => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getReadabilityColor = () => {
    if (readability.score >= 70) return 'text-green-600 bg-green-100';
    if (readability.score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const wordCount = (content.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean)).length;

  return (
    <Card className="h-fit sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">SEO Score</span>
          <div className={cn('w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl', getScoreColor())}>
            {score}
          </div>
        </CardTitle>
        <p className="text-xs text-muted-foreground">out of 100 points</p>
        <Progress value={score} className={cn('h-3 mt-2', getProgressColor())} />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readability Score */}
        <div className="p-4 bg-secondary/50 rounded-lg border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Readability Score
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{readability.score}</span>
            <Badge className={cn('text-sm', getReadabilityColor())}>
              {readability.grade} - {readability.label}
            </Badge>
          </div>
          <Progress value={readability.score} className={cn('h-2 mb-3',
            readability.score >= 70 ? 'bg-green-500' :
            readability.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
          )} />
          {wordCount >= 10 && (
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Avg. sentence: <span className="font-medium text-foreground">{readability.avgSentenceLength} words</span></div>
              <div>Complex words: <span className="font-medium text-foreground">{readability.complexWordPercentage}%</span></div>
            </div>
          )}
        </div>

        {/* Google Preview */}
        <div className="p-4 bg-secondary/50 rounded-lg border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Globe className="w-3 h-3" /> Google Preview
          </p>
          <p className="text-blue-600 text-base font-medium truncate hover:underline cursor-pointer">
            {metaTitle || title || 'Page Title'}
          </p>
          <p className="text-green-700 text-sm truncate">
            manhateck.com/{slug || 'page-url'}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {metaDescription || 'Add a meta description to preview how it will appear in search results.'}
          </p>
        </div>

        {/* Weighted Checklist */}
        <div className="space-y-2">
          <p className="font-medium text-sm">SEO Checklist</p>
          {checks.map((check, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-2 p-2 rounded text-sm',
                check.passed && !check.partial ? 'bg-green-50' : check.partial ? 'bg-amber-50' : check.passed ? 'bg-green-50' : 'bg-red-50'
              )}
            >
              {check.passed && !check.partial ? (
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : check.partial ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className={cn(
                    'font-medium',
                    check.passed && !check.partial ? 'text-green-700' : check.partial ? 'text-amber-700' : 'text-red-700'
                  )}>
                    {check.label}
                  </p>
                  <span className={cn(
                    'text-xs font-bold',
                    check.points === check.maxPoints ? 'text-green-600' : check.points > 0 ? 'text-amber-600' : 'text-red-600'
                  )}>
                    {check.points}/{check.maxPoints}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
