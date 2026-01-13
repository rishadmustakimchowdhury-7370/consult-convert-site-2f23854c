import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

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
  const currencySymbol = currencySymbols[invoice.currency] || "$";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>

        <div className="bg-white p-8 rounded-lg" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ManhaTeck</h1>
              <p className="text-gray-600 text-sm mt-1">www.manhateck.com</p>
              <p className="text-gray-600 text-sm">info@manhateck.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-semibold text-gray-900">INVOICE</h2>
              <p className="text-gray-700 font-medium mt-1">{invoice.invoice_number}</p>
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
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-center py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Unit Price
                  </th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 text-gray-900 font-medium">{item.service_name}</td>
                    <td className="py-4 text-gray-600 text-sm">{item.description || "-"}</td>
                    <td className="py-4 text-center text-gray-900">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-900">
                      {currencySymbol}{item.unit_price.toFixed(2)}
                    </td>
                    <td className="py-4 text-right text-gray-900 font-medium">
                      {currencySymbol}{item.line_total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
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
              <div className="flex justify-between py-3 border-t-2 border-gray-900 mt-2">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-gray-900">
                  {currencySymbol}{invoice.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
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
