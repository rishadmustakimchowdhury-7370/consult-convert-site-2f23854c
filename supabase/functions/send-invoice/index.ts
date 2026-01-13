import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvoiceItem {
  service_name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

function generatePDFHTML(invoice: any, items: InvoiceItem[]): string {
  const currencySymbol = currencySymbols[invoice.currency] || "$";
  const statusColors: Record<string, string> = {
    draft: "#6B7280",
    sent: "#3B82F6",
    paid: "#22C55E",
    overdue: "#EF4444",
  };

  const itemRows = items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px 0; color: #111827; font-weight: 500;">${item.service_name}</td>
        <td style="padding: 12px 0; color: #6B7280; font-size: 14px;">${item.description || "-"}</td>
        <td style="padding: 12px 0; text-align: center; color: #111827;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right; color: #111827;">${currencySymbol}${Number(item.unit_price).toFixed(2)}</td>
        <td style="padding: 12px 0; text-align: right; color: #111827; font-weight: 500;">${currencySymbol}${Number(item.line_total).toFixed(2)}</td>
      </tr>
    `
    )
    .join("");

  const discountRow =
    Number(invoice.discount_percentage) > 0
      ? `<div style="display: flex; justify-content: space-between; padding: 8px 0; color: #16A34A;">
           <span>Discount (${invoice.discount_percentage}%)</span>
           <span>-${currencySymbol}${Number(invoice.discount_amount).toFixed(2)}</span>
         </div>`
      : "";

  const taxRow =
    Number(invoice.tax_rate) > 0
      ? `<div style="display: flex; justify-content: space-between; padding: 8px 0;">
           <span style="color: #6B7280;">Tax (${invoice.tax_rate}%)</span>
           <span style="color: #111827;">${currencySymbol}${Number(invoice.tax_amount).toFixed(2)}</span>
         </div>`
      : "";

  const notesSection = invoice.notes
    ? `<div style="margin-bottom: 32px; padding: 16px; background-color: #F9FAFB; border-radius: 8px;">
         <h3 style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Notes</h3>
         <p style="color: #374151; font-size: 14px; margin: 0;">${invoice.notes}</p>
       </div>`
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 40px; background: white; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div style="max-width: 800px; margin: 0 auto;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #E5E7EB;">
          <div>
            <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">ManhaTeck</h1>
            <p style="color: #6B7280; font-size: 14px; margin: 4px 0 0 0;">www.manhateck.com</p>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">info@manhateck.com</p>
          </div>
          <div style="text-align: right;">
            <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin: 0;">INVOICE</h2>
            <p style="color: #374151; font-weight: 500; margin: 4px 0;">${invoice.invoice_number}</p>
            <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500; color: white; background-color: ${statusColors[invoice.status] || "#6B7280"};">
              ${invoice.status.toUpperCase()}
            </span>
          </div>
        </div>

        <!-- Client & Dates -->
        <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
          <div>
            <h3 style="font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;">Bill To</h3>
            <p style="font-weight: 600; color: #111827; margin: 0;">${invoice.client_name}</p>
            ${invoice.client_company ? `<p style="color: #6B7280; margin: 0;">${invoice.client_company}</p>` : ""}
            <p style="color: #6B7280; margin: 0;">${invoice.client_email}</p>
            ${invoice.client_address ? `<p style="color: #6B7280; margin: 0;">${invoice.client_address}</p>` : ""}
          </div>
          <div style="text-align: right;">
            <p style="font-size: 14px; margin: 4px 0;">
              <span style="color: #6B7280;">Invoice Date: </span>
              <span style="font-weight: 500;">${formatDate(invoice.invoice_date)}</span>
            </p>
            <p style="font-size: 14px; margin: 4px 0;">
              <span style="color: #6B7280;">Due Date: </span>
              <span style="font-weight: 500;">${formatDate(invoice.due_date)}</span>
            </p>
          </div>
        </div>

        <!-- Items Table -->
        <table style="margin-bottom: 32px;">
          <thead>
            <tr style="border-bottom: 2px solid #E5E7EB;">
              <th style="text-align: left; padding: 12px 0; font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Service</th>
              <th style="text-align: left; padding: 12px 0; font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Description</th>
              <th style="text-align: center; padding: 12px 0; font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
              <th style="text-align: right; padding: 12px 0; font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Unit Price</th>
              <th style="text-align: right; padding: 12px 0; font-size: 12px; font-weight: 600; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display: flex; justify-content: flex-end; margin-bottom: 32px;">
          <div style="width: 250px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0;">
              <span style="color: #6B7280;">Subtotal</span>
              <span style="color: #111827;">${currencySymbol}${Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            ${discountRow}
            ${taxRow}
            <div style="display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #111827; margin-top: 8px;">
              <span style="font-size: 18px; font-weight: bold; color: #111827;">Total</span>
              <span style="font-size: 18px; font-weight: bold; color: #111827;">${currencySymbol}${Number(invoice.total_amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        ${notesSection}

        <!-- Footer -->
        <div style="text-align: center; padding-top: 32px; border-top: 1px solid #E5E7EB;">
          <p style="color: #6B7280; margin: 0;">Thank you for choosing ManhaTeck. We appreciate your business.</p>
          <p style="color: #9CA3AF; font-size: 14px; margin-top: 16px;">ManhaTeck • www.manhateck.com • info@manhateck.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateEmailHTML(invoice: any): string {
  const currencySymbol = currencySymbols[invoice.currency] || "$";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #F3F4F6; }
      </style>
    </head>
    <body>
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 8px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: bold; color: #111827; margin: 0;">ManhaTeck</h1>
            <p style="color: #6B7280; margin-top: 4px;">Billing Team</p>
          </div>

          <!-- Greeting -->
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi ${invoice.client_name},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            I hope you're doing well.
          </p>

          <!-- Main Message -->
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Please find attached the invoice <strong>${invoice.invoice_number}</strong> for the services provided by ManhaTeck.
          </p>

          <!-- Invoice Summary Box -->
          <div style="background: #F9FAFB; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #E5E7EB;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6B7280;">Invoice Number:</span>
              <span style="font-weight: 600; color: #111827;">${invoice.invoice_number}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6B7280;">Invoice Amount:</span>
              <span style="font-weight: 600; color: #111827; font-size: 18px;">${currencySymbol}${Number(invoice.total_amount).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6B7280;">Due Date:</span>
              <span style="font-weight: 600; color: #111827;">${formatDate(invoice.due_date)}</span>
            </div>
          </div>

          <p style="color: #6B7280; font-size: 14px; text-align: center;">
            The invoice is attached as an HTML file to this email.
          </p>

          <!-- Closing -->
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 24px;">
            If you have any questions or require any clarification, feel free to reply to this email.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We appreciate the opportunity to work with you and look forward to continuing our collaboration.
          </p>

          <!-- Signature -->
          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
            <p style="color: #111827; font-weight: 600; margin: 0;">ManhaTeck Billing Team</p>
            <p style="color: #6B7280; font-size: 14px; margin: 4px 0;">Email: info@manhateck.com</p>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">Website: www.manhateck.com</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 24px;">
          <p style="color: #9CA3AF; font-size: 12px;">
            © ${new Date().getFullYear()} ManhaTeck. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

async function sendEmailWithSMTP(
  to: string,
  subject: string,
  htmlContent: string,
  attachmentContent: string,
  invoiceNumber: string
): Promise<void> {
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
    // Convert HTML content to base64 for attachment
    const attachmentBase64 = btoa(unescape(encodeURIComponent(attachmentContent)));

    await client.send({
      from: "ManhaTeck Billing <info@manhateck.com>",
      to: [to],
      subject: subject,
      content: "Please view this email in an HTML-capable email client.",
      html: htmlContent,
      attachments: [
        {
          filename: `${invoiceNumber}.html`,
          content: attachmentBase64,
          encoding: "base64",
          contentType: "text/html",
        },
      ],
    });
    console.log("Invoice email sent successfully via SMTP");
  } finally {
    await client.close();
  }
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      throw new Error("Invoice ID is required");
    }

    console.log("Sending invoice:", invoiceId);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*")
      .eq("id", invoiceId)
      .single();

    if (invoiceError || !invoice) {
      throw new Error("Invoice not found");
    }

    // Fetch invoice items
    const { data: items, error: itemsError } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("sort_order");

    if (itemsError) {
      throw new Error("Failed to fetch invoice items");
    }

    // Generate PDF HTML
    const pdfHTML = generatePDFHTML(invoice, items || []);

    // Generate email HTML
    const emailHTML = generateEmailHTML(invoice);

    // Send email
    const subject = `Invoice ${invoice.invoice_number} from ManhaTeck`;
    await sendEmailWithSMTP(
      invoice.client_email,
      subject,
      emailHTML,
      pdfHTML,
      invoice.invoice_number
    );

    // Update invoice status to sent
    await supabase
      .from("invoices")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", invoiceId);

    console.log("Invoice sent successfully:", invoice.invoice_number);

    return new Response(
      JSON.stringify({ success: true, message: "Invoice sent successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Error sending invoice:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
