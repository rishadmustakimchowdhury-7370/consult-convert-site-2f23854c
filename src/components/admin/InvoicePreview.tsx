import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Download, Loader2 } from "lucide-react";
import { downloadInvoicePDF } from "@/utils/invoicePdfGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

interface InvoicePreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: InvoiceData;
  items: InvoiceItem[];
}

const currencySymbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
};

const statusColors: Record<string, string> = {
  draft: "#6B7280",
  sent: "#3B82F6",
  paid: "#22C55E",
  overdue: "#EF4444",
};

export function InvoicePreview({ open, onOpenChange, invoice, items }: InvoicePreviewProps) {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const currencySymbol = currencySymbols[invoice.currency] || "$";

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("logo_url")
        .single();
      if (data?.logo_url) {
        setLogoUrl(data.logo_url);
      }
    };
    fetchLogo();
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoicePDF(invoice, items, logoUrl || undefined);
      toast({ title: "PDF downloaded successfully" });
    } catch (error) {
      console.error("Download error:", error);
      toast({ title: "Failed to download PDF", variant: "destructive" });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Invoice Preview</DialogTitle>
          <Button onClick={handleDownload} disabled={downloading} size="sm">
            {downloading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Download className="h-4 w-4 mr-2" />
            )}
            Download PDF
          </Button>
        </DialogHeader>

        <div className="bg-white p-8 rounded-lg border" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
            <div>
              {logoUrl ? (
                <img src={logoUrl} alt="Company Logo" className="h-12 mb-2 object-contain" />
              ) : (
                <h1 className="text-2xl font-bold text-primary">ManhaTeck</h1>
              )}
              <p className="text-gray-600 text-sm mt-1">www.manhateck.com</p>
              <p className="text-gray-600 text-sm">info@manhateck.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 tracking-wide">INVOICE</h2>
              <p className="text-primary font-bold mt-1">{invoice.invoice_number}</p>
              <div
                className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: statusColors[invoice.status] || "#6B7280" }}
              >
                {invoice.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Invoice Meta & Client Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
              <p className="font-semibold text-gray-900">{invoice.client_name}</p>
              {invoice.client_company && <p className="text-gray-600">{invoice.client_company}</p>}
              <p className="text-gray-600">{invoice.client_email}</p>
              {invoice.client_address && <p className="text-gray-600">{invoice.client_address}</p>}
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="text-gray-500">Invoice Date:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(invoice.invoice_date), "MMMM dd, yyyy")}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Due Date:</span>{" "}
                  <span className="font-medium">
                    {format(new Date(invoice.due_date), "MMMM dd, yyyy")}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-primary text-white">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-3 px-4 text-gray-900 font-medium">{item.service_name}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{item.description || "-"}</td>
                    <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                    <td className="py-3 px-4 text-right text-gray-900">
                      {currencySymbol}{item.unit_price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 font-medium">
                      {currencySymbol}{item.line_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-72 bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{currencySymbol}{invoice.subtotal.toFixed(2)}</span>
              </div>
              {invoice.discount_percentage > 0 && (
                <div className="flex justify-between py-2 text-green-600">
                  <span>Discount ({invoice.discount_percentage}%)</span>
                  <span>-{currencySymbol}{invoice.discount_amount.toFixed(2)}</span>
                </div>
              )}
              {invoice.tax_rate > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Tax ({invoice.tax_rate}%)</span>
                  <span className="text-gray-900">{currencySymbol}{invoice.tax_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-primary mt-2">
                <span className="text-lg font-bold text-primary">TOTAL</span>
                <span className="text-lg font-bold text-primary">
                  {currencySymbol}{invoice.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Notes</h3>
              <p className="text-gray-700 text-sm">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-600">Thank you for choosing ManhaTeck. We appreciate your business.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>ManhaTeck • www.manhateck.com • info@manhateck.com</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
