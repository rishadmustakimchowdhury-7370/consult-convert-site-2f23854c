import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Fetching site settings for robots.txt");

    const { data: settings, error } = await supabase
      .from("site_settings")
      .select("discourage_search_engines")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }

    const discourageSearchEngines = settings?.discourage_search_engines ?? false;
    console.log("Discourage search engines:", discourageSearchEngines);

    let robotsTxt: string;

    if (discourageSearchEngines) {
      // Block all crawlers
      robotsTxt = `User-agent: *
Disallow: /

# This site is currently set to discourage search engine indexing.
# To allow crawling, disable this setting in the admin dashboard.
`;
    } else {
      // Allow all crawlers
      robotsTxt = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /

Sitemap: ${supabaseUrl.replace('.supabase.co', '.lovable.app')}/sitemap.xml
`;
    }

    return new Response(robotsTxt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error generating robots.txt:", error);
    return new Response(`User-agent: *\nAllow: /`, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        ...corsHeaders,
      },
    });
  }
});
