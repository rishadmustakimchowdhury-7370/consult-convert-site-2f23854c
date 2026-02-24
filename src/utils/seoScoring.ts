export interface SEOCheckResult {
  label: string;
  points: number;
  maxPoints: number;
  passed: boolean;
  partial?: boolean;
  message: string;
}

export interface SEOScoreResult {
  score: number;
  checks: SEOCheckResult[];
  readability: {
    score: number;
    grade: string;
    label: string;
    avgSentenceLength: number;
    complexWordPercentage: number;
  };
}

function stripHtml(html: string): string {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  const vowels = word.match(/[aeiouy]+/g);
  let count = vowels ? vowels.length : 1;
  if (word.endsWith('e')) count--;
  if (word.endsWith('le') && word.length > 2) count++;
  return Math.max(1, count);
}

function calcReadability(plainContent: string, wordCount: number) {
  if (!plainContent || wordCount < 10) {
    return { score: 0, grade: 'N/A', label: 'Add more content', avgSentenceLength: 0, complexWordPercentage: 0 };
  }

  const sentences = plainContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;
  const avgSentenceLength = wordCount / sentenceCount;

  const words = plainContent.split(/\s+/).filter(Boolean);
  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSyllablesPerWord = totalSyllables / wordCount;

  const fleschScore = Math.round(206.835 - 1.015 * avgSentenceLength - 84.6 * avgSyllablesPerWord);
  const normalizedScore = Math.max(0, Math.min(100, fleschScore));

  const complexWords = words.filter(w => countSyllables(w) >= 3).length;
  const complexWordPercentage = Math.round((complexWords / wordCount) * 100);

  let grade: string, label: string;
  if (normalizedScore >= 80) { grade = 'A'; label = 'Very Easy'; }
  else if (normalizedScore >= 70) { grade = 'B'; label = 'Easy'; }
  else if (normalizedScore >= 60) { grade = 'C'; label = 'Standard'; }
  else if (normalizedScore >= 50) { grade = 'D'; label = 'Fairly Difficult'; }
  else if (normalizedScore >= 30) { grade = 'E'; label = 'Difficult'; }
  else { grade = 'F'; label = 'Very Difficult'; }

  return { score: normalizedScore, grade, label, avgSentenceLength: Math.round(avgSentenceLength), complexWordPercentage };
}

export function calculateSEOScore(params: {
  title: string;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  content: string;
  focusKeyword: string;
}): SEOScoreResult {
  const { title, slug, metaTitle, metaDescription, content, focusKeyword } = params;

  const plainContent = stripHtml(content);
  const wordCount = plainContent.split(/\s+/).filter(Boolean).length;
  const firstParagraph = plainContent.slice(0, 300).toLowerCase();
  const keyword = focusKeyword.toLowerCase().trim();
  const contentLower = plainContent.toLowerCase();

  const readability = calcReadability(plainContent, wordCount);

  const checks: SEOCheckResult[] = [];

  // 1. Focus keyword in title → 10 pts
  const kwInTitle = keyword ? title.toLowerCase().includes(keyword) : false;
  checks.push({
    label: 'Focus keyword in title',
    points: kwInTitle ? 10 : 0,
    maxPoints: 10,
    passed: kwInTitle,
    message: !keyword ? 'Set a focus keyword first.' : kwInTitle ? 'Focus keyword appears in the title.' : 'Add focus keyword to the title.',
  });

  // 2. Focus keyword in meta description → 10 pts
  const kwInMeta = keyword ? metaDescription.toLowerCase().includes(keyword) : false;
  checks.push({
    label: 'Focus keyword in meta description',
    points: kwInMeta ? 10 : 0,
    maxPoints: 10,
    passed: kwInMeta,
    message: !keyword ? 'Set a focus keyword first.' : kwInMeta ? 'Focus keyword found in meta description.' : 'Include focus keyword in meta description.',
  });

  // 3. Focus keyword in URL slug → 10 pts
  const kwInSlug = keyword ? slug.toLowerCase().includes(keyword.replace(/\s+/g, '-')) : false;
  checks.push({
    label: 'Focus keyword in URL slug',
    points: kwInSlug ? 10 : 0,
    maxPoints: 10,
    passed: kwInSlug,
    message: !keyword ? 'Set a focus keyword first.' : kwInSlug ? 'Focus keyword present in URL.' : 'Add focus keyword to URL slug.',
  });

  // 4. Focus keyword in first paragraph → 10 pts
  const kwInFirst = keyword ? firstParagraph.includes(keyword) : false;
  checks.push({
    label: 'Focus keyword in first paragraph',
    points: kwInFirst ? 10 : 0,
    maxPoints: 10,
    passed: kwInFirst,
    message: !keyword ? 'Set a focus keyword first.' : kwInFirst ? 'Focus keyword appears early in content.' : 'Use focus keyword in the first paragraph.',
  });

  // 5. Content length → 15 pts (300+ full, 150-299 partial)
  let contentPts = 0;
  let contentPassed = false;
  let contentPartial = false;
  let contentMsg: string;
  if (wordCount >= 300) {
    contentPts = 15;
    contentPassed = true;
    contentMsg = `Content has ${wordCount} words. Great length!`;
  } else if (wordCount >= 150) {
    contentPts = 10;
    contentPassed = true;
    contentPartial = true;
    contentMsg = `Content has ${wordCount} words. Good, but 300+ is better.`;
  } else {
    contentPts = 0;
    contentMsg = `Content has ${wordCount} words. Aim for 300+.`;
  }
  checks.push({ label: 'Content length', points: contentPts, maxPoints: 15, passed: contentPassed, partial: contentPartial, message: contentMsg });

  // 6. Meta title length (50-60 chars) → 5 pts
  const titleOk = metaTitle.length >= 50 && metaTitle.length <= 60;
  checks.push({
    label: 'Meta title length (50-60 chars)',
    points: titleOk ? 5 : 0,
    maxPoints: 5,
    passed: titleOk,
    message: titleOk ? `Meta title is ${metaTitle.length} chars. Perfect!` : `Meta title is ${metaTitle.length} chars. Aim for 50-60.`,
  });

  // 7. Meta description length (120-160 chars) → 5 pts
  const descOk = metaDescription.length >= 120 && metaDescription.length <= 160;
  checks.push({
    label: 'Meta description length (120-160 chars)',
    points: descOk ? 5 : 0,
    maxPoints: 5,
    passed: descOk,
    message: descOk ? `Meta description is ${metaDescription.length} chars. Perfect!` : `Meta description is ${metaDescription.length} chars. Aim for 120-160.`,
  });

  // 8. Image alt tags present → 10 pts
  const hasAlt = content.includes('alt=');
  checks.push({
    label: 'Image alt tags present',
    points: hasAlt ? 10 : 0,
    maxPoints: 10,
    passed: hasAlt,
    message: hasAlt ? 'Images have alt attributes.' : 'Add alt attributes to images.',
  });

  // 9. Internal links present → 10 pts
  const hasInternal = content.includes('href="/') || content.includes("href='/");
  checks.push({
    label: 'Internal links present',
    points: hasInternal ? 10 : 0,
    maxPoints: 10,
    passed: hasInternal,
    message: hasInternal ? 'Internal links found.' : 'Add internal links to your content.',
  });

  // 10. External links present → 5 pts
  const hasExternal = content.includes('href="http') || content.includes("href='http");
  checks.push({
    label: 'External links present',
    points: hasExternal ? 5 : 0,
    maxPoints: 5,
    passed: hasExternal,
    message: hasExternal ? 'External links found.' : 'Consider adding relevant external links.',
  });

  // 11. Readability score → 10 pts (lenient for AI content)
  const readOk = readability.score >= 40;
  const readPartial = readability.score >= 25 && readability.score < 40;
  checks.push({
    label: 'Readability score',
    points: readOk ? 10 : readPartial ? 5 : 0,
    maxPoints: 10,
    passed: readOk,
    partial: readPartial,
    message: readOk
      ? `Content readability is acceptable (${readability.label}).`
      : readPartial
      ? 'Content is fairly difficult to read. Consider simplifying some sentences.'
      : 'Content is very hard to read. Use shorter sentences and simpler words.',
  });

  const totalPoints = checks.reduce((sum, c) => sum + c.points, 0);
  const score = totalPoints; // out of 100

  return { score, checks, readability };
}
