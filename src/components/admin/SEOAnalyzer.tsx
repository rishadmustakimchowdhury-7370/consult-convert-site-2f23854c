import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, X, AlertTriangle, Globe, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOAnalyzerProps {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  focusKeyword: string;
}

interface SEOCheck {
  label: string;
  passed: boolean;
  warning?: boolean;
  message: string;
}

export default function SEOAnalyzer({
  title,
  slug,
  metaTitle,
  metaDescription,
  content,
  focusKeyword,
}: SEOAnalyzerProps) {
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const plainContent = stripHtml(content);
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  const firstParagraph = plainContent.slice(0, 300).toLowerCase();

  // Readability calculations
  const readabilityAnalysis = useMemo(() => {
    if (!plainContent || wordCount < 10) {
      return { score: 0, grade: 'N/A', label: 'Add more content' };
    }

    const sentences = plainContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length || 1;
    const avgSentenceLength = wordCount / sentenceCount;

    // Count syllables (simplified)
    const countSyllables = (word: string) => {
      word = word.toLowerCase().replace(/[^a-z]/g, '');
      if (word.length <= 3) return 1;
      const vowels = word.match(/[aeiouy]+/g);
      let count = vowels ? vowels.length : 1;
      if (word.endsWith('e')) count--;
      if (word.endsWith('le') && word.length > 2) count++;
      return Math.max(1, count);
    };

    const words = plainContent.split(/\s+/).filter(Boolean);
    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    const avgSyllablesPerWord = totalSyllables / wordCount;

    // Flesch Reading Ease Score (0-100, higher = easier)
    const fleschScore = Math.round(
      206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    );
    const normalizedScore = Math.max(0, Math.min(100, fleschScore));

    // Complex words (3+ syllables)
    const complexWords = words.filter(w => countSyllables(w) >= 3).length;
    const complexWordPercentage = (complexWords / wordCount) * 100;

    let grade: string;
    let label: string;

    if (normalizedScore >= 80) {
      grade = 'A';
      label = 'Very Easy';
    } else if (normalizedScore >= 70) {
      grade = 'B';
      label = 'Easy';
    } else if (normalizedScore >= 60) {
      grade = 'C';
      label = 'Standard';
    } else if (normalizedScore >= 50) {
      grade = 'D';
      label = 'Fairly Difficult';
    } else if (normalizedScore >= 30) {
      grade = 'E';
      label = 'Difficult';
    } else {
      grade = 'F';
      label = 'Very Difficult';
    }

    return {
      score: normalizedScore,
      grade,
      label,
      avgSentenceLength: Math.round(avgSentenceLength),
      complexWordPercentage: Math.round(complexWordPercentage),
    };
  }, [plainContent, wordCount]);

  const checks: SEOCheck[] = useMemo(() => {
    const keyword = focusKeyword.toLowerCase().trim();
    const titleLower = title.toLowerCase();
    const metaTitleLower = metaTitle.toLowerCase();
    const metaDescLower = metaDescription.toLowerCase();
    const slugLower = slug.toLowerCase();
    const contentLower = plainContent.toLowerCase();

    return [
      {
        label: 'Focus keyword in title',
        passed: keyword ? titleLower.includes(keyword) : false,
        message: keyword 
          ? titleLower.includes(keyword) 
            ? 'Great! Focus keyword appears in the title.' 
            : 'Add focus keyword to the title.'
          : 'Set a focus keyword first.',
      },
      {
        label: 'Focus keyword in meta description',
        passed: keyword ? metaDescLower.includes(keyword) : false,
        message: keyword 
          ? metaDescLower.includes(keyword) 
            ? 'Focus keyword found in meta description.' 
            : 'Include focus keyword in meta description.'
          : 'Set a focus keyword first.',
      },
      {
        label: 'Focus keyword in URL slug',
        passed: keyword ? slugLower.includes(keyword.replace(/\s+/g, '-')) : false,
        message: keyword 
          ? slugLower.includes(keyword.replace(/\s+/g, '-')) 
            ? 'Focus keyword present in URL.' 
            : 'Add focus keyword to URL slug.'
          : 'Set a focus keyword first.',
      },
      {
        label: 'Focus keyword in first paragraph',
        passed: keyword ? firstParagraph.includes(keyword) : false,
        message: keyword 
          ? firstParagraph.includes(keyword) 
            ? 'Focus keyword appears early in content.' 
            : 'Use focus keyword in the first paragraph.'
          : 'Set a focus keyword first.',
      },
      {
        label: 'Content length (300+ words)',
        passed: wordCount >= 300,
        warning: wordCount > 0 && wordCount < 300,
        message: wordCount >= 300 
          ? `Content has ${wordCount} words. Good length!` 
          : `Content has ${wordCount} words. Aim for 300+.`,
      },
      {
        label: 'Meta title length (50-60 chars)',
        passed: metaTitle.length >= 50 && metaTitle.length <= 60,
        warning: metaTitle.length > 0 && (metaTitle.length < 50 || metaTitle.length > 60),
        message: metaTitle.length >= 50 && metaTitle.length <= 60
          ? `Meta title is ${metaTitle.length} characters. Perfect!`
          : `Meta title is ${metaTitle.length} characters. Aim for 50-60.`,
      },
      {
        label: 'Meta description length (120-160 chars)',
        passed: metaDescription.length >= 120 && metaDescription.length <= 160,
        warning: metaDescription.length > 0 && (metaDescription.length < 120 || metaDescription.length > 160),
        message: metaDescription.length >= 120 && metaDescription.length <= 160
          ? `Meta description is ${metaDescription.length} characters. Perfect!`
          : `Meta description is ${metaDescription.length} characters. Aim for 120-160.`,
      },
      {
        label: 'Image alt tags present',
        passed: content.includes('alt='),
        message: content.includes('alt=')
          ? 'Images have alt attributes.'
          : 'Add alt attributes to images.',
      },
      {
        label: 'Internal links present',
        passed: content.includes('href="/') || content.includes("href='/"),
        message: content.includes('href="/') || content.includes("href='/")
          ? 'Internal links found.'
          : 'Add internal links to your content.',
      },
      {
        label: 'External links present',
        passed: content.includes('href="http') || content.includes("href='http"),
        message: content.includes('href="http') || content.includes("href='http")
          ? 'External links found.'
          : 'Consider adding relevant external links.',
      },
      {
        label: 'Readability score',
        passed: readabilityAnalysis.score >= 60,
        warning: readabilityAnalysis.score >= 40 && readabilityAnalysis.score < 60,
        message: readabilityAnalysis.score >= 60
          ? `Content is easy to read (${readabilityAnalysis.label}).`
          : readabilityAnalysis.score >= 40
          ? `Content is fairly difficult to read. Simplify sentences.`
          : `Content is hard to read. Use shorter sentences and simpler words.`,
      },
    ];
  }, [title, slug, metaTitle, metaDescription, content, focusKeyword, plainContent, firstParagraph, wordCount, readabilityAnalysis]);

  const passedChecks = checks.filter(c => c.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);

  const getScoreColor = () => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getProgressColor = () => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getReadabilityColor = () => {
    if (readabilityAnalysis.score >= 70) return 'text-green-600 bg-green-100';
    if (readabilityAnalysis.score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <Card className="h-fit sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg">SEO Analysis</span>
          <Badge className={cn('text-sm', getScoreColor())}>
            {score}%
          </Badge>
        </CardTitle>
        <Progress value={score} className={cn('h-2', getProgressColor())} />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Readability Score */}
        <div className="p-4 bg-secondary/50 rounded-lg border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Readability Score
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{readabilityAnalysis.score}</span>
            <Badge className={cn('text-sm', getReadabilityColor())}>
              {readabilityAnalysis.grade} - {readabilityAnalysis.label}
            </Badge>
          </div>
          <Progress value={readabilityAnalysis.score} className={cn('h-2 mb-3', 
            readabilityAnalysis.score >= 70 ? 'bg-green-500' : 
            readabilityAnalysis.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
          )} />
          {wordCount >= 10 && (
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>Avg. sentence: <span className="font-medium text-foreground">{readabilityAnalysis.avgSentenceLength} words</span></div>
              <div>Complex words: <span className="font-medium text-foreground">{readabilityAnalysis.complexWordPercentage}%</span></div>
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
            yoursite.com/{slug || 'page-url'}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {metaDescription || 'Add a meta description to preview how it will appear in search results.'}
          </p>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          <p className="font-medium text-sm">SEO Checklist</p>
          {checks.map((check, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-2 p-2 rounded text-sm',
                check.passed ? 'bg-green-50' : check.warning ? 'bg-amber-50' : 'bg-red-50'
              )}
            >
              {check.passed ? (
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
              ) : check.warning ? (
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <p className={cn(
                  'font-medium',
                  check.passed ? 'text-green-700' : check.warning ? 'text-amber-700' : 'text-red-700'
                )}>
                  {check.label}
                </p>
                <p className="text-muted-foreground text-xs">{check.message}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
