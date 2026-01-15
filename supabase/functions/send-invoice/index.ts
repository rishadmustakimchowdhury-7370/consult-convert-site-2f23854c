import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.2";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";
import { jsPDF } from "https://esm.sh/jspdf@2.5.1";

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

const statusColors: Record<string, { r: number; g: number; b: number }> = {
  draft: { r: 107, g: 114, b: 128 },
  sent: { r: 59, g: 130, b: 246 },
  paid: { r: 34, g: 197, b: 94 },
  overdue: { r: 239, g: 68, b: 68 },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return `data:${blob.type};base64,${btoa(binary)}`;
  } catch (error) {
    console.error("Failed to load image:", error);
    return null;
  }
}

async function generateInvoicePDF(invoice: any, items: InvoiceItem[], logoUrl?: string): Promise<string> {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let yPos = margin;

  const currencySymbol = currencySymbols[invoice.currency] || "$";
  const statusColor = statusColors[invoice.status] || statusColors.draft;

  // Colors
  const primaryColor = { r: 17, g: 94, b: 89 };
  const darkText = { r: 17, g: 24, b: 39 };
  const grayText = { r: 107, g: 114, b: 128 };
  const lightGray = { r: 229, g: 231, b: 235 };

  // ===== HEADER SECTION =====
  // Logo or Company Name
  if (logoUrl) {
    const logoBase64 = await loadImageAsBase64(logoUrl);
    if (logoBase64) {
      try {
        pdf.addImage(logoBase64, "PNG", margin, yPos, 40, 15);
      } catch {
        pdf.setFontSize(20);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
        pdf.text("ManhaTeck", margin, yPos + 10);
      }
    }
  } else {
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
    pdf.text("ManhaTeck", margin, yPos + 10);
  }

  // Company info
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("www.manhateck.com", margin, yPos + 20);
  pdf.text("info@manhateck.com", margin, yPos + 25);

  // Invoice title
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text("INVOICE", pageWidth - margin, yPos + 8, { align: "right" });

  // Invoice number
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.text(invoice.invoice_number, pageWidth - margin, yPos + 16, { align: "right" });

  // Status badge
  const statusText = invoice.status.toUpperCase();
  pdf.setFontSize(8);
  const statusWidth = pdf.getTextWidth(statusText) + 8;
  const statusX = pageWidth - margin - statusWidth;
  pdf.setFillColor(statusColor.r, statusColor.g, statusColor.b);
  pdf.roundedRect(statusX, yPos + 20, statusWidth, 6, 3, 3, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.text(statusText, statusX + 4, yPos + 24.5);

  yPos += 35;

  // Divider
  pdf.setDrawColor(lightGray.r, lightGray.g, lightGray.b);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // ===== CLIENT & DATES =====
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("BILL TO", margin, yPos);

  yPos += 6;
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(invoice.client_name, margin, yPos);

  yPos += 5;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);

  if (invoice.client_company) {
    pdf.text(invoice.client_company, margin, yPos);
    yPos += 5;
  }
  pdf.text(invoice.client_email, margin, yPos);
  yPos += 5;
  if (invoice.client_address) {
    const addressLines = pdf.splitTextToSize(invoice.client_address, 80);
    pdf.text(addressLines, margin, yPos);
    yPos += addressLines.length * 5;
  }

  // Dates
  const datesY = yPos - 20;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Invoice Date:", pageWidth - margin - 60, datesY);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(formatDate(invoice.invoice_date), pageWidth - margin, datesY, { align: "right" });

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Due Date:", pageWidth - margin - 60, datesY + 6);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(formatDate(invoice.due_date), pageWidth - margin, datesY + 6, { align: "right" });

  yPos += 10;

  // ===== ITEMS TABLE =====
  pdf.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.rect(margin, yPos, contentWidth, 10, "F");

  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(255, 255, 255);
  pdf.text("SERVICE", margin + 3, yPos + 7);
  pdf.text("DESCRIPTION", margin + 55, yPos + 7);
  pdf.text("QTY", margin + 110, yPos + 7);
  pdf.text("PRICE", margin + 130, yPos + 7);
  pdf.text("TOTAL", pageWidth - margin - 3, yPos + 7, { align: "right" });

  yPos += 12;

  items.forEach((item, index) => {
    const rowHeight = 12;
    
    if (index % 2 === 1) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPos - 2, contentWidth, rowHeight, "F");
    }

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkText.r, darkText.g, darkText.b);
    
    const serviceName = item.service_name.length > 25 
      ? item.service_name.substring(0, 22) + "..." 
      : item.service_name;
    pdf.text(serviceName, margin + 3, yPos + 5);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(grayText.r, grayText.g, grayText.b);
    const description = item.description || "-";
    const truncatedDesc = description.length > 25 
      ? description.substring(0, 22) + "..." 
      : description;
    pdf.text(truncatedDesc, margin + 55, yPos + 5);

    pdf.setTextColor(darkText.r, darkText.g, darkText.b);
    pdf.text(String(item.quantity), margin + 113, yPos + 5);
    pdf.text(`${currencySymbol}${Number(item.unit_price).toFixed(2)}`, margin + 130, yPos + 5);
    
    pdf.setFont("helvetica", "bold");
    pdf.text(`${currencySymbol}${Number(item.line_total).toFixed(2)}`, pageWidth - margin - 3, yPos + 5, { align: "right" });

    yPos += rowHeight;
  });

  pdf.setDrawColor(lightGray.r, lightGray.g, lightGray.b);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // ===== TOTALS =====
  const totalsX = pageWidth - margin - 70;
  const valuesX = pageWidth - margin;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Subtotal:", totalsX, yPos);
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(`${currencySymbol}${Number(invoice.subtotal).toFixed(2)}`, valuesX, yPos, { align: "right" });
  yPos += 6;

  if (Number(invoice.discount_percentage) > 0) {
    pdf.setTextColor(34, 197, 94);
    pdf.text(`Discount (${invoice.discount_percentage}%):`, totalsX, yPos);
    pdf.text(`-${currencySymbol}${Number(invoice.discount_amount).toFixed(2)}`, valuesX, yPos, { align: "right" });
    yPos += 6;
  }

  if (Number(invoice.tax_rate) > 0) {
    pdf.setTextColor(grayText.r, grayText.g, grayText.b);
    pdf.text(`Tax (${invoice.tax_rate}%):`, totalsX, yPos);
    pdf.setTextColor(darkText.r, darkText.g, darkText.b);
    pdf.text(`${currencySymbol}${Number(invoice.tax_amount).toFixed(2)}`, valuesX, yPos, { align: "right" });
    yPos += 6;
  }

  yPos += 2;
  pdf.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.setLineWidth(0.8);
  pdf.line(totalsX - 5, yPos, pageWidth - margin, yPos);
  yPos += 8;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.text("TOTAL:", totalsX, yPos);
  pdf.text(`${currencySymbol}${Number(invoice.total_amount).toFixed(2)}`, valuesX, yPos, { align: "right" });

  yPos += 15;

  // ===== NOTES =====
  if (invoice.notes) {
    pdf.setFillColor(249, 250, 251);
    const notesLines = pdf.splitTextToSize(invoice.notes, contentWidth - 10);
    const notesHeight = notesLines.length * 5 + 15;
    pdf.roundedRect(margin, yPos, contentWidth, notesHeight, 3, 3, "F");

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(grayText.r, grayText.g, grayText.b);
    pdf.text("NOTES", margin + 5, yPos + 7);

    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(darkText.r, darkText.g, darkText.b);
    pdf.text(notesLines, margin + 5, yPos + 14);

    yPos += notesHeight + 10;
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 25;

  pdf.setDrawColor(lightGray.r, lightGray.g, lightGray.b);
  pdf.setLineWidth(0.3);
  pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Thank you for choosing ManhaTeck. We appreciate your business.", pageWidth / 2, footerY, { align: "center" });

  pdf.setFontSize(8);
  pdf.setTextColor(156, 163, 175);
  pdf.text("ManhaTeck • www.manhateck.com • info@manhateck.com", pageWidth / 2, footerY + 6, { align: "center" });

  // Return base64 PDF
  return pdf.output("datauristring").split(",")[1];
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
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 24px; font-weight: bold; color: #115e59; margin: 0;">ManhaTeck</h1>
            <p style="color: #6B7280; margin-top: 4px;">Billing Team</p>
          </div>

          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Hi ${invoice.client_name},
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            I hope you're doing well.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            Please find attached the invoice <strong>${invoice.invoice_number}</strong> for the services provided by ManhaTeck.
          </p>

          <div style="background: #F9FAFB; border-radius: 8px; padding: 24px; margin: 24px 0; border: 1px solid #E5E7EB;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6B7280;">Invoice Number:</span>
              <span style="font-weight: 600; color: #111827;">${invoice.invoice_number}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
              <span style="color: #6B7280;">Invoice Amount:</span>
              <span style="font-weight: 600; color: #115e59; font-size: 18px;">${currencySymbol}${Number(invoice.total_amount).toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6B7280;">Due Date:</span>
              <span style="font-weight: 600; color: #111827;">${formatDate(invoice.due_date)}</span>
            </div>
          </div>

          <p style="color: #115e59; font-size: 14px; text-align: center; font-weight: 500;">
            📎 The invoice PDF is attached to this email.
          </p>

          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 24px;">
            If you have any questions or require any clarification, feel free to reply to this email.
          </p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6;">
            We appreciate the opportunity to work with you and look forward to continuing our collaboration.
          </p>

          <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #E5E7EB;">
            <p style="color: #111827; font-weight: 600; margin: 0;">ManhaTeck Billing Team</p>
            <p style="color: #6B7280; font-size: 14px; margin: 4px 0;">Email: info@manhateck.com</p>
            <p style="color: #6B7280; font-size: 14px; margin: 0;">Website: www.manhateck.com</p>
          </div>
        </div>

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
  pdfBase64: string,
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
    await client.send({
      from: "ManhaTeck Billing <info@manhateck.com>",
      to: [to],
      subject: subject,
      content: "Please view this email in an HTML-capable email client.",
      html: htmlContent,
      attachments: [
        {
          filename: `${invoiceNumber}.pdf`,
          content: pdfBase64,
          encoding: "base64",
          contentType: "application/pdf",
        },
      ],
    });
    console.log("Invoice PDF email sent successfully via SMTP");
  } finally {
    await client.close();
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      throw new Error("Invoice ID is required");
    }

    console.log("Sending invoice:", invoiceId);

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

    // Fetch logo URL
    const { data: settings } = await supabase
      .from("site_settings")
      .select("logo_url")
      .single();

    // Generate PDF
    console.log("Generating PDF...");
    const pdfBase64 = await generateInvoicePDF(invoice, items || [], settings?.logo_url);
    console.log("PDF generated successfully");

    // Generate email HTML
    const emailHTML = generateEmailHTML(invoice);

    // Send email with PDF attachment
    const subject = `Invoice ${invoice.invoice_number} from ManhaTeck`;
    await sendEmailWithSMTP(
      invoice.client_email,
      subject,
      emailHTML,
      pdfBase64,
      invoice.invoice_number
    );

    // Update invoice status
    await supabase
      .from("invoices")
      .update({ status: "sent", sent_at: new Date().toISOString() })
      .eq("id", invoiceId);

    console.log("Invoice sent successfully:", invoice.invoice_number);

    return new Response(
      JSON.stringify({ success: true, message: "Invoice PDF sent successfully" }),
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
