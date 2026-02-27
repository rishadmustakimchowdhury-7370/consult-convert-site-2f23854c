/**
 * Vite plugin: fetches the dynamic sitemap & robots.txt from the edge
 * functions at build time and writes them into the dist/ output so that
 * /sitemap.xml and /robots.txt are served as static files in production.
 *
 * Falls back to public/ copies when the edge function is unreachable.
 */

import type { Plugin } from 'vite';

const SUPABASE_FUNCTIONS_URL =
  'https://gfpmczssbrnyngaaolpu.supabase.co/functions/v1';

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'Content-Type': 'text/plain' } });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export function sitemapPlugin(): Plugin {
  return {
    name: 'generate-sitemap',
    apply: 'build',
    async closeBundle() {
      const fs = await import('fs');
      const path = await import('path');
      const distDir = path.resolve('dist');

      // Sitemap
      const sitemap = await fetchText(`${SUPABASE_FUNCTIONS_URL}/sitemap-xml`);
      if (sitemap) {
        fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8');
        console.log('✅ sitemap.xml generated from edge function');
      } else {
        console.log('⚠️  Edge function unreachable — using static public/sitemap.xml');
      }

      // Robots.txt
      const robots = await fetchText(`${SUPABASE_FUNCTIONS_URL}/robots-txt`);
      if (robots) {
        fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf-8');
        console.log('✅ robots.txt generated from edge function');
      } else {
        console.log('⚠️  Edge function unreachable — using static public/robots.txt');
      }
    },
  };
}
