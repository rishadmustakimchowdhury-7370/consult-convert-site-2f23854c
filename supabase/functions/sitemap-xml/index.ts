import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://manhateck.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toW3CDate(date: string | null): string {
  if (!date) return new Date().toISOString().split("T")[0];
  try {
    return new Date(date).toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all published content in parallel
    const [servicesRes, blogsRes, pagesRes] = await Promise.all([
      supabase
        .from("services")
        .select("slug, updated_at")
        .eq("is_active", true)
        .eq("status", "published")
        .order("sort_order", { ascending: true }),
      supabase
        .from("blogs")
        .select("slug, updated_at, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase
        .from("pages")
        .select("slug, updated_at")
        .eq("status", "published"),
    ]);

    const urls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string }> = [];

    // Homepage
    urls.push({
      loc: `${SITE_URL}/`,
      lastmod: new Date().toISOString().split("T")[0],
      priority: "1.0",
      changefreq: "daily",
    });

    // Static pages
    const staticPages = [
      { path: "/about/", priority: "0.8", changefreq: "monthly" },
      { path: "/services/", priority: "0.9", changefreq: "weekly" },
      { path: "/blog/", priority: "0.8", changefreq: "daily" },
      { path: "/contact/", priority: "0.7", changefreq: "monthly" },
      { path: "/projects/", priority: "0.6", changefreq: "weekly" },
      { path: "/privacy-policy/", priority: "0.3", changefreq: "yearly" },
    ];

    for (const page of staticPages) {
      urls.push({
        loc: `${SITE_URL}${page.path}`,
        lastmod: new Date().toISOString().split("T")[0],
        priority: page.priority,
        changefreq: page.changefreq,
      });
    }

    // Services
    if (servicesRes.data) {
      for (const service of servicesRes.data) {
        urls.push({
          loc: `${SITE_URL}/services/${escapeXml(service.slug)}/`,
          lastmod: toW3CDate(service.updated_at),
          priority: "0.8",
          changefreq: "weekly",
        });
      }
    }

    // Blog posts
    if (blogsRes.data) {
      for (const blog of blogsRes.data) {
        urls.push({
          loc: `${SITE_URL}/blog/${escapeXml(blog.slug)}/`,
          lastmod: toW3CDate(blog.updated_at || blog.published_at),
          priority: "0.7",
          changefreq: "weekly",
        });
      }
    }

    // Dynamic pages
    if (pagesRes.data) {
      for (const page of pagesRes.data) {
        urls.push({
          loc: `${SITE_URL}/page/${escapeXml(page.slug)}/`,
          lastmod: toW3CDate(page.updated_at),
          priority: "0.6",
          changefreq: "monthly",
        });
      }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    return new Response(sitemap, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error generating sitemap:", error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}/</loc></url></urlset>`,
      {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          ...corsHeaders,
        },
      }
    );
  }
});
