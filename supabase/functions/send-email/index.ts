import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "contact" | "consultation" | "admin_notification";
  data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message?: string;
    service?: string;
    budget?: string;
    availableDate?: string;
    availableTime?: string;
  };
}

async function sendEmail(to: string[], subject: string, html: string, from: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    console.error("Resend API error:", error);
    throw new Error(`Failed to send email: ${error}`);
  }
  
  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Email function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data }: EmailRequest = await req.json();
    console.log("Processing email request:", type, data);

    // Basic validation
    if (!data.name || !data.email) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({ error: "Name and email are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get site settings for admin email
    const { data: settings } = await supabase
      .from("site_settings")
      .select("admin_email, contact_email, site_title")
      .limit(1)
      .maybeSingle();

    const adminEmails = ["mustakimchy21@gmail.com", "info@manhateck.com"];
    const siteTitle = settings?.site_title || "Manhateck";

    // Save submission to database
    await supabase.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      service: data.service,
      budget: data.budget,
      available_date: data.availableDate,
      available_time: data.availableTime,
      form_type: type,
    });

    console.log("Submission saved to database");

    // Send notification to admin
    const adminEmailContent = type === "consultation" 
      ? `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>WhatsApp:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Service:</strong> ${data.service || "Not specified"}</p>
        <p><strong>Available Date:</strong> ${data.availableDate || "Not specified"}</p>
        <p><strong>Available Time:</strong> ${data.availableTime || "Not specified"}</p>
        <p><strong>Budget:</strong> ${data.budget || "Not specified"}</p>
      `
      : `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message || "No message"}</p>
      `;

    // Using verified domain sender
    const senderEmail = "info@manhateck.com";

    // Send admin notification
    const adminResult = await sendEmail(
      adminEmails,
      type === "consultation" 
        ? `New Consultation Request from ${data.name}` 
        : `New Contact Form Submission from ${data.name}`,
      adminEmailContent,
      `${siteTitle} <${senderEmail}>`
    );

    console.log("Admin email sent:", adminResult);

    // Send thank you email to user
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Thank You for Contacting Us!</h1>
        <p>Dear ${data.name},</p>
        <p>We have received your ${type === "consultation" ? "consultation request" : "message"} and appreciate you reaching out to us.</p>
        <p>Our team will review your inquiry and get back to you within 24 hours.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>The ${siteTitle} Team</strong></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
        <p style="color: #666; font-size: 12px;">
          Email: info@manhateck.com<br/>
          Phone: +447426468550<br/>
          Address: Suite A, 82 James Carter Road, Mildenhall, Bury St. Edmunds, United Kingdom, IP28 7DE
        </p>
      </div>
    `;

    const userResult = await sendEmail(
      [data.email],
      "Thank you for contacting us!",
      userEmailContent,
      `${siteTitle} <${senderEmail}>`
    );

    console.log("User email sent:", userResult);

    return new Response(
      JSON.stringify({ success: true, message: "Emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
