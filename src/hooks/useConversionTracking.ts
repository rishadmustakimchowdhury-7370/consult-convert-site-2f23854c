import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// ─── UTM / GCLID capture ───
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'] as const;
const STORAGE_KEY = 'mh_tracking_params';

interface TrackingParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  landing_page?: string;
  captured_at?: string;
}

/** Read stored tracking params */
export function getTrackingParams(): TrackingParams {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Capture UTM params + gclid from the URL on first visit */
function captureParams(search: string, pathname: string) {
  const existing = getTrackingParams();
  // Only capture once per session (first touch)
  if (existing.captured_at) return;

  const params = new URLSearchParams(search);
  const tracking: TrackingParams = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const val = params.get(key);
    if (val) {
      (tracking as any)[key] = val;
      hasAny = true;
    }
  }

  // Always store landing page
  tracking.landing_page = `${window.location.origin}${pathname}${search}`;
  tracking.captured_at = new Date().toISOString();

  if (hasAny || true) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(tracking));
  }
}

// ─── Dedup guard ───
const firedConversions = new Set<string>();

function dedupKey(eventType: string): string {
  return `${eventType}_${Date.now().toString(36)}`;
}

// ─── Google Ads gtag helpers ───
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let gtagLoaded = false;

export function loadGtag(conversionId: string) {
  if (gtagLoaded || !conversionId) return;
  // Only load on production
  if (window.location.hostname !== 'manhateck.com') return;

  gtagLoaded = true;

  // dataLayer init
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', conversionId);

  // Load script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${conversionId}`;
  document.head.appendChild(script);
}

/** Fire a Google Ads conversion event + store in DB */
export async function trackConversion(
  eventType: string,
  conversionId?: string,
  conversionLabel?: string
) {
  // Dedup: prevent double-fire within same page session
  const key = `${eventType}_${window.location.pathname}`;
  if (firedConversions.has(key)) return;
  firedConversions.add(key);

  const tracking = getTrackingParams();

  // 1. Fire Google Ads conversion
  if (conversionId && conversionLabel && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: `${conversionId}/${conversionLabel}`,
    });
  }

  // 2. Store in database
  try {
    await supabase.from('conversion_events').insert({
      event_type: eventType,
      utm_source: tracking.utm_source || null,
      utm_medium: tracking.utm_medium || null,
      utm_campaign: tracking.utm_campaign || null,
      utm_term: tracking.utm_term || null,
      utm_content: tracking.utm_content || null,
      gclid: tracking.gclid || null,
      landing_page: tracking.landing_page || null,
      page_url: window.location.href,
    });
  } catch (err) {
    console.error('Failed to store conversion event:', err);
  }
}

// ─── React hook: auto-capture params + load gtag ───
export function useConversionTracking() {
  const location = useLocation();
  const initialised = useRef(false);

  useEffect(() => {
    captureParams(location.search, location.pathname);
  }, [location.search, location.pathname]);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    // Load Google Ads settings
    supabase
      .from('site_settings')
      .select('google_ads_conversion_id, google_ads_conversion_label, google_ads_enabled')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.google_ads_enabled && data.google_ads_conversion_id) {
          loadGtag(data.google_ads_conversion_id);
        }
      });
  }, []);
}

/** Hook that returns a fire-and-forget conversion trigger */
export function useTrackConversion() {
  const settingsRef = useRef<{
    id?: string;
    label?: string;
    enabled?: boolean;
  }>({});
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    supabase
      .from('site_settings')
      .select('google_ads_conversion_id, google_ads_conversion_label, google_ads_enabled')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          settingsRef.current = {
            id: data.google_ads_conversion_id ?? undefined,
            label: data.google_ads_conversion_label ?? undefined,
            enabled: data.google_ads_enabled ?? false,
          };
        }
      });
  }, []);

  return (eventType: string) => {
    const { id, label, enabled } = settingsRef.current;
    trackConversion(
      eventType,
      enabled ? id : undefined,
      enabled ? label : undefined
    );
  };
}
