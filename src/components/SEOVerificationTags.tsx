import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Globally injects Google & Bing site-verification <meta> tags into <head>.
 *
 * Why DOM injection (not react-helmet-async):
 *  - Helmet only mounts when a route renders <SEOHead>, and replaces tags on
 *    every navigation. Verification tags must be present on EVERY page,
 *    immediately, with no flicker/dedupe quirks.
 *  - Direct DOM injection keeps tags permanently in <head>, regardless of
 *    route changes or whether SEOHead is mounted.
 *
 * Accepts either a full meta-tag string (pasted from Search Console) or just
 * the bare verification code. Sanitizes input to prevent XSS.
 */

const GOOGLE_TAG_ID = "seo-google-verification";
const BING_TAG_ID = "seo-bing-verification";

/** Extracts content="..." value from a meta tag, or returns input if it's already a bare code. */
function extractCode(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const match = trimmed.match(/content\s*=\s*["']([^"']+)["']/i);
  const code = (match?.[1] ?? trimmed).trim();
  // Strip anything that isn't a safe verification token character
  const safe = code.replace(/[^A-Za-z0-9_\-=.]/g, "");
  return safe || null;
}

function upsertMeta(id: string, name: string, content: string) {
  let tag = document.getElementById(id) as HTMLMetaElement | null;
  if (!tag) {
    tag = document.createElement("meta");
    tag.id = id;
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function removeMeta(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

export function SEOVerificationTags() {
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("google_verification_meta, bing_verification_meta")
        .limit(1)
        .maybeSingle();

      if (cancelled || error || !data) return;

      const googleCode = extractCode(data.google_verification_meta);
      const bingCode = extractCode(data.bing_verification_meta);

      // Remove any duplicate verification tags that might exist
      document
        .querySelectorAll('meta[name="google-site-verification"]')
        .forEach((el) => {
          if (el.id !== GOOGLE_TAG_ID) el.remove();
        });
      document.querySelectorAll('meta[name="msvalidate.01"]').forEach((el) => {
        if (el.id !== BING_TAG_ID) el.remove();
      });

      if (googleCode) upsertMeta(GOOGLE_TAG_ID, "google-site-verification", googleCode);
      else removeMeta(GOOGLE_TAG_ID);

      if (bingCode) upsertMeta(BING_TAG_ID, "msvalidate.01", bingCode);
      else removeMeta(BING_TAG_ID);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
