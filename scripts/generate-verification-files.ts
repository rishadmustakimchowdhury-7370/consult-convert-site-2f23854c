/**
 * Vite plugin: at build time, downloads SEO verification files
 * (Google / Bing) stored in Supabase storage and writes them into
 * dist/ so they are served as real static files at the domain root.
 *
 * Why: Google Search Console requires the verification HTML file
 * to be physically present at https://domain.com/googleXXXX.html
 * with HTTP 200. SPA hosting does NOT fall back to index.html for
 * paths ending in a file extension, so the file must exist in the
 * build output.
 *
 * Trigger: runs automatically on `vite build` (and therefore on every
 * Lovable Publish). After uploading a new verification file in the
 * admin panel, the user must republish for it to go live.
 */

import type { Plugin } from 'vite';

const SUPABASE_URL = 'https://gfpmczssbrnyngaaolpu.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcG1jenNzYnJueW5nYWFvbHB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzI2NTEsImV4cCI6MjA4MDUwODY1MX0.5N6m2oLsHid7oCI4pIQvBJUsCwIketsZi2R4FYBH3MM';

interface VerificationRow {
  google_verification_file: string | null;
  bing_verification_file: string | null;
}

async function fetchSettings(): Promise<VerificationRow | null> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_settings?select=google_verification_file,bing_verification_file&limit=1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as VerificationRow[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

async function downloadFile(
  url: string,
): Promise<{ name: string; body: Buffer } | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const name = url.split('/').pop()?.split('?')[0];
    if (!name) return null;
    const ab = await res.arrayBuffer();
    return { name, body: Buffer.from(ab) };
  } catch {
    return null;
  }
}

export function verificationFilesPlugin(): Plugin {
  return {
    name: 'generate-verification-files',
    apply: 'build',
    async closeBundle() {
      const fs = await import('fs');
      const path = await import('path');
      const distDir = path.resolve('dist');

      const settings = await fetchSettings();
      if (!settings) {
        console.log('⚠️  Verification files: no site_settings row found');
        return;
      }

      const urls = [
        settings.google_verification_file,
        settings.bing_verification_file,
      ].filter((u): u is string => Boolean(u));

      if (urls.length === 0) {
        console.log('ℹ️  Verification files: none configured, skipping');
        return;
      }

      for (const url of urls) {
        const file = await downloadFile(url);
        if (!file) {
          console.log(`⚠️  Verification file fetch failed: ${url}`);
          continue;
        }
        const target = path.join(distDir, file.name);
        fs.writeFileSync(target, file.body);
        console.log(`✅ Verification file written: /${file.name}`);
      }
    },
  };
}
