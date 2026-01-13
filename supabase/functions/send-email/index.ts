import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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

async function sendEmail(to: string[], subject: string, html: string): Promise<void> {
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");
  
  if (!smtpPassword) {
    throw new Error("SMTP_PASSWORD not configured");
  }

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: "info@manhateck.com",
        password: smtpPassword,
      },
    },
  });

  try {
    await client.send({
      from: "ManhaTeck <info@manhateck.com>",
      to: to,
      subject: subject,
      content: "Please view this email in an HTML-capable email client.",
      html: html,
    });
    console.log("Email sent successfully via SMTP");
  } finally {
    await client.close();
  }
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

    const adminEmails = ["info@manhateck.com"];
    const siteTitle = settings?.site_title || "ManhaTeck";

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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Consultation Request</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.email}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>WhatsApp:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.phone || "Not provided"}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Service:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.service || "Not specified"}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Available Date:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.availableDate || "Not specified"}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Available Time:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.availableTime || "Not specified"}</td></tr>
            <tr><td style="padding: 10px 0;"><strong>Budget:</strong></td><td style="padding: 10px 0;">${data.budget || "Not specified"}</td></tr>
          </table>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">This email was sent from the ManhaTeck website contact form.</p>
        </div>
      `
      : `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.email}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Subject:</strong></td><td style="padding: 10px 0; border-bottom: 1px solid #eee;">${data.subject || "Not provided"}</td></tr>
          </table>
          <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <strong>Message:</strong>
            <p style="margin-top: 10px;">${data.message || "No message"}</p>
          </div>
          <p style="color: #666; margin-top: 20px; font-size: 12px;">This email was sent from the ManhaTeck website contact form.</p>
        </div>
      `;

    // Send admin notification
    await sendEmail(
      adminEmails,
      type === "consultation" 
        ? `New Consultation Request from ${data.name}` 
        : `New Contact Form Submission from ${data.name}`,
      adminEmailContent
    );

    console.log("Admin email sent");

    // Send thank you email to user
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">ManhaTeck</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #333;">Thank You for Contacting Us!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your ${type === "consultation" ? "consultation request" : "message"} and appreciate you reaching out to us.</p>
          <p>Our team will review your inquiry and get back to you within 24 hours.</p>
          <div style="background-color: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #0066cc;"><strong>What happens next?</strong></p>
            <ul style="color: #555; margin-top: 10px;">
              <li>Our team will review your request</li>
              <li>We'll prepare a personalized response</li>
              <li>You'll hear from us within 24 hours</li>
            </ul>
          </div>
          <p>Best regards,</p>
          <p><strong>The ${siteTitle} Team</strong></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            Email: info@manhateck.com<br/>
            Phone: +447426468550<br/>
            Address: Suite A, 82 James Carter Road, Mildenhall, Bury St. Edmunds, United Kingdom, IP28 7DE
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 10px;">
            © ${new Date().getFullYear()} ManhaTeck. All rights reserved.
          </p>
        </div>
      </div>
    `;

    await sendEmail(
      [data.email],
      "Thank you for contacting ManhaTeck!",
      userEmailContent
    );

    console.log("User thank you email sent");

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
