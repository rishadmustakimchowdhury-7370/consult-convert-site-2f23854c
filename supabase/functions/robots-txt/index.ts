import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://manhateck.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("discourage_search_engines")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }

    const discourage = settings?.discourage_search_engines ?? false;

    let robotsTxt: string;

    if (discourage) {
      robotsTxt = `User-agent: *
Disallow: /

# Search engine indexing is currently discouraged.
# Change this in admin settings to allow crawling.
`;
    } else {
      robotsTxt = `User-agent: *
Allow: /

# Block admin area
Disallow: /visage/

Sitemap: ${SITE_URL}/sitemap.xml
`;
    }

    return new Response(robotsTxt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error generating robots.txt:", error);
    return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        ...corsHeaders,
      },
    });
  }
});
