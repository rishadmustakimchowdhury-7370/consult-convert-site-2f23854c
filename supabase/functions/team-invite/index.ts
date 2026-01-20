import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TeamInviteRequest {
  memberName: string;
  memberEmail: string;
  memberRole: string;
  tempPassword: string;
  invitedBy: string;
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
    console.log("Email sent successfully via SMTP to:", to);
  } finally {
    await client.close();
  }
}

const getRoleLabel = (role: string): string => {
  const roleLabels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    manager: "Manager",
    seo_manager: "SEO Manager",
    editor: "Editor",
    user: "User",
  };
  return roleLabels[role] || role;
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Team invite function called");

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { memberName, memberEmail, memberRole, tempPassword, invitedBy }: TeamInviteRequest = await req.json();
    console.log("Processing team invite for:", memberEmail);

    if (!memberName || !memberEmail || !memberRole) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const superAdminEmail = "info@manhateck.com";
    const roleLabel = getRoleLabel(memberRole);
    const loginUrl = "https://consult-convert-site.lovable.app/visage/login";

    // Email to the new team member
    const memberEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">ManhaTeck</h1>
          <p style="color: #cce0ff; margin: 10px 0 0 0;">Team Invitation</p>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to the Team, ${memberName}!</h2>
          
          <p style="color: #555; line-height: 1.6;">
            You have been invited to join the ManhaTeck team as a <strong style="color: #0066cc;">${roleLabel}</strong>.
          </p>
          
          <div style="background: linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #0066cc;">
            <h3 style="color: #0066cc; margin: 0 0 15px 0;">Your Login Credentials</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #333;">${memberEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Temporary Password:</strong></td>
                <td style="padding: 8px 0; color: #333; font-family: monospace; background: #fff; padding: 5px 10px; border-radius: 4px;">${tempPassword}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666;"><strong>Role:</strong></td>
                <td style="padding: 8px 0; color: #333;">${roleLabel}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background: linear-gradient(135deg, #0066cc 0%, #004499 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);">
              Login to Dashboard
            </a>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6;">
            If you have any questions, please contact the administrator at <a href="mailto:info@manhateck.com" style="color: #0066cc;">info@manhateck.com</a>.
          </p>
          
          <p style="color: #555; margin-top: 25px;">
            Best regards,<br/>
            <strong>The ManhaTeck Team</strong>
          </p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            ManhaTeck - Digital Solutions Agency<br/>
            Email: info@manhateck.com | Phone: +447426468550
          </p>
          <p style="color: #999; font-size: 11px; margin-top: 10px;">
            © ${new Date().getFullYear()} ManhaTeck. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Email to the super admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">ManhaTeck</h1>
          <p style="color: #d4edda; margin: 10px 0 0 0;">New Team Member Added</p>
        </div>
        <div style="padding: 30px; background: #ffffff;">
          <h2 style="color: #333; margin-bottom: 20px;">New Team Member Notification</h2>
          
          <p style="color: #555; line-height: 1.6;">
            A new team member has been added to the ManhaTeck platform.
          </p>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #e9ecef;">
            <h3 style="color: #28a745; margin: 0 0 15px 0;">Team Member Details</h3>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 40%;"><strong>Full Name:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${memberName}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${memberEmail}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Assigned Role:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                  <span style="background: #0066cc; color: white; padding: 4px 12px; border-radius: 20px; font-size: 13px;">${roleLabel}</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;"><strong>Invited By:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #333;">${invitedBy}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666;"><strong>Date Added:</strong></td>
                <td style="padding: 10px 0; color: #333;">${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);">
              View Team Management
            </a>
          </div>
          
          <p style="color: #888; font-size: 13px; font-style: italic;">
            This is an automated notification from the ManhaTeck platform.
          </p>
        </div>
        <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 11px; margin: 0;">
            © ${new Date().getFullYear()} ManhaTeck. All rights reserved.
          </p>
        </div>
      </div>
    `;

    // Send email to the new team member
    await sendEmail(
      [memberEmail],
      `Welcome to ManhaTeck Team - Your Login Credentials`,
      memberEmailContent
    );
    console.log("Member welcome email sent");

    // Send notification to super admin
    await sendEmail(
      [superAdminEmail],
      `New Team Member Added: ${memberName} (${roleLabel})`,
      adminEmailContent
    );
    console.log("Admin notification email sent");

    return new Response(
      JSON.stringify({ success: true, message: "Team invite emails sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in team-invite function:", error);
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
