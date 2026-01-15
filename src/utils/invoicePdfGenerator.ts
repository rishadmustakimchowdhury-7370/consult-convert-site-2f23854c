import jsPDF from "jspdf";

interface InvoiceItem {
  service_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

interface InvoiceData {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: string;
  client_name: string;
  client_company: string;
  client_email: string;
  client_address: string;
  currency: string;
  subtotal: number;
  discount_percentage: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
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
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function generateInvoicePDF(
  invoice: InvoiceData,
  items: InvoiceItem[],
  logoUrl?: string
): Promise<jsPDF> {
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
  const primaryColor = { r: 17, g: 94, b: 89 }; // Teal
  const darkText = { r: 17, g: 24, b: 39 };
  const grayText = { r: 107, g: 114, b: 128 };
  const lightGray = { r: 229, g: 231, b: 235 };

  // ===== HEADER SECTION =====
  // Logo
  if (logoUrl) {
    const logoBase64 = await loadImageAsBase64(logoUrl);
    if (logoBase64) {
      try {
        pdf.addImage(logoBase64, "PNG", margin, yPos, 40, 15);
      } catch {
        // Fallback to text if image fails
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

  // Company info under logo
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("www.manhateck.com", margin, yPos + 20);
  pdf.text("info@manhateck.com", margin, yPos + 25);

  // Invoice title on right
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

  // Header divider
  pdf.setDrawColor(lightGray.r, lightGray.g, lightGray.b);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // ===== CLIENT & DATES SECTION =====
  // Bill To
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

  // Dates on right side
  const datesY = yPos - 20;
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Invoice Date:", pageWidth - margin - 60, datesY, { align: "left" });
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(formatDate(invoice.invoice_date), pageWidth - margin, datesY, { align: "right" });

  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Due Date:", pageWidth - margin - 60, datesY + 6, { align: "left" });
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(formatDate(invoice.due_date), pageWidth - margin, datesY + 6, { align: "right" });

  yPos += 10;

  // ===== ITEMS TABLE =====
  // Table header
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

  // Table rows
  items.forEach((item, index) => {
    const rowHeight = 12;
    
    // Alternate row background
    if (index % 2 === 1) {
      pdf.setFillColor(249, 250, 251);
      pdf.rect(margin, yPos - 2, contentWidth, rowHeight, "F");
    }

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(darkText.r, darkText.g, darkText.b);
    
    // Truncate service name if too long
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
    pdf.text(`${currencySymbol}${item.unit_price.toFixed(2)}`, margin + 130, yPos + 5);
    
    pdf.setFont("helvetica", "bold");
    pdf.text(`${currencySymbol}${item.line_total.toFixed(2)}`, pageWidth - margin - 3, yPos + 5, { align: "right" });

    yPos += rowHeight;
  });

  // Table bottom border
  pdf.setDrawColor(lightGray.r, lightGray.g, lightGray.b);
  pdf.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 15;

  // ===== TOTALS SECTION =====
  const totalsX = pageWidth - margin - 70;
  const valuesX = pageWidth - margin;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayText.r, grayText.g, grayText.b);
  pdf.text("Subtotal:", totalsX, yPos);
  pdf.setTextColor(darkText.r, darkText.g, darkText.b);
  pdf.text(`${currencySymbol}${invoice.subtotal.toFixed(2)}`, valuesX, yPos, { align: "right" });
  yPos += 6;

  if (invoice.discount_percentage > 0) {
    pdf.setTextColor(34, 197, 94);
    pdf.text(`Discount (${invoice.discount_percentage}%):`, totalsX, yPos);
    pdf.text(`-${currencySymbol}${invoice.discount_amount.toFixed(2)}`, valuesX, yPos, { align: "right" });
    yPos += 6;
  }

  if (invoice.tax_rate > 0) {
    pdf.setTextColor(grayText.r, grayText.g, grayText.b);
    pdf.text(`Tax (${invoice.tax_rate}%):`, totalsX, yPos);
    pdf.setTextColor(darkText.r, darkText.g, darkText.b);
    pdf.text(`${currencySymbol}${invoice.tax_amount.toFixed(2)}`, valuesX, yPos, { align: "right" });
    yPos += 6;
  }

  // Total
  yPos += 2;
  pdf.setDrawColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.setLineWidth(0.8);
  pdf.line(totalsX - 5, yPos, pageWidth - margin, yPos);
  yPos += 8;

  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b);
  pdf.text("TOTAL:", totalsX, yPos);
  pdf.text(`${currencySymbol}${invoice.total_amount.toFixed(2)}`, valuesX, yPos, { align: "right" });

  yPos += 15;

  // ===== NOTES SECTION =====
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

  return pdf;
}

export async function downloadInvoicePDF(
  invoice: InvoiceData,
  items: InvoiceItem[],
  logoUrl?: string
): Promise<void> {
  const pdf = await generateInvoicePDF(invoice, items, logoUrl);
  pdf.save(`${invoice.invoice_number}.pdf`);
}

export async function getInvoicePDFBlob(
  invoice: InvoiceData,
  items: InvoiceItem[],
  logoUrl?: string
): Promise<Blob> {
  const pdf = await generateInvoicePDF(invoice, items, logoUrl);
  return pdf.output("blob");
}
