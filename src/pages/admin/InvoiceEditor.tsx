import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Trash2, Save, Send, Eye } from "lucide-react";
import { InvoicePreview } from "@/components/admin/InvoicePreview";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

interface InvoiceItem {
  id?: string;
  service_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  sort_order: number;
}

interface InvoiceFormData {
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  client_name: string;
  client_company: string;
  client_email: string;
  client_address: string;
  currency: string;
  discount_percentage: number;
  tax_rate: number;
  notes: string;
}

const defaultServices = [
  "Website Design & Development",
  "eCommerce Store Development",
  "SaaS / Web Application Development",
  "AI Agent & Automation Development",
  "Cybersecurity & Penetration Testing",
  "SEO & Digital Marketing",
  "Maintenance & Support",
];

const currencySymbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
};

export default function InvoiceEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isNew = id === "new" || !id;
  const [showPreview, setShowPreview] = useState(false);
  const [sendingInvoice, setSendingInvoice] = useState(false);
  const [currentInvoiceId, setCurrentInvoiceId] = useState<string | undefined>(id === "new" ? undefined : id);
  const [customServices, setCustomServices] = useState<string[]>([]);
  const [newServiceName, setNewServiceName] = useState("");

  const [formData, setFormData] = useState<InvoiceFormData>({
    invoice_number: "",
    invoice_date: new Date().toISOString().split("T")[0],
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "draft",
    client_name: "",
    client_company: "",
    client_email: "",
    client_address: "",
    currency: "USD",
    discount_percentage: 0,
    tax_rate: 0,
    notes: "",
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { service_name: "", description: "", quantity: 1, unit_price: 0, line_total: 0, sort_order: 0 },
  ]);

  // Generate invoice number for new invoices
  useEffect(() => {
    if (isNew) {
      supabase.rpc("generate_invoice_number").then(({ data }) => {
        if (data) {
          setFormData((prev) => ({ ...prev, invoice_number: data }));
        }
      });
    }
  }, [isNew]);

  // Fetch existing invoice
  const { data: existingInvoice, isLoading } = useQuery({
    queryKey: ["invoice", id],
    queryFn: async () => {
      if (isNew) return null;
      
      const { data: invoice, error } = await supabase
        .from("invoices")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      const { data: invoiceItems } = await supabase
        .from("invoice_items")
        .select("*")
        .eq("invoice_id", id)
        .order("sort_order");

      return { invoice, items: invoiceItems || [] };
    },
    enabled: !isNew,
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingInvoice?.invoice) {
      const inv = existingInvoice.invoice;
      setFormData({
        invoice_number: inv.invoice_number,
        invoice_date: inv.invoice_date,
        due_date: inv.due_date,
        status: inv.status as InvoiceStatus,
        client_name: inv.client_name,
        client_company: inv.client_company || "",
        client_email: inv.client_email,
        client_address: inv.client_address || "",
        currency: inv.currency,
        discount_percentage: Number(inv.discount_percentage) || 0,
        tax_rate: Number(inv.tax_rate) || 0,
        notes: inv.notes || "",
      });

      if (existingInvoice.items.length > 0) {
        setItems(
          existingInvoice.items.map((item: any) => ({
            id: item.id,
            service_name: item.service_name,
            description: item.description || "",
            quantity: item.quantity,
            unit_price: Number(item.unit_price),
            line_total: Number(item.line_total),
            sort_order: item.sort_order,
          }))
        );
      }
    }
  }, [existingInvoice]);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);
  const discountAmount = (subtotal * formData.discount_percentage) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * formData.tax_rate) / 100;
  const totalAmount = taxableAmount + taxAmount;

  // Update item
  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      
      // Recalculate line total
      if (field === "quantity" || field === "unit_price") {
        updated[index].line_total = updated[index].quantity * updated[index].unit_price;
      }
      
      return updated;
    });
  };

  // Add item
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { service_name: "", description: "", quantity: 1, unit_price: 0, line_total: 0, sort_order: prev.length },
    ]);
  };

  // Remove item
  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const invoiceData = {
        invoice_number: formData.invoice_number,
        invoice_date: formData.invoice_date,
        due_date: formData.due_date,
        status: formData.status,
        client_name: formData.client_name,
        client_company: formData.client_company || null,
        client_email: formData.client_email,
        client_address: formData.client_address || null,
        currency: formData.currency,
        subtotal,
        discount_percentage: formData.discount_percentage,
        discount_amount: discountAmount,
        tax_rate: formData.tax_rate,
        tax_amount: taxAmount,
        total_amount: totalAmount,
        notes: formData.notes || null,
      };

      let invoiceId = id;

      if (isNew) {
        const { data, error } = await supabase
          .from("invoices")
          .insert(invoiceData)
          .select()
          .single();

        if (error) throw error;
        invoiceId = data.id;
      } else {
        const { error } = await supabase
          .from("invoices")
          .update(invoiceData)
          .eq("id", id);

        if (error) throw error;

        // Delete existing items
        await supabase.from("invoice_items").delete().eq("invoice_id", id);
      }

      // Insert items
      const itemsToInsert = items.map((item, index) => ({
        invoice_id: invoiceId,
        service_name: item.service_name,
        description: item.description || null,
        quantity: item.quantity,
        unit_price: item.unit_price,
        line_total: item.line_total,
        sort_order: index,
      }));

      const { error: itemsError } = await supabase.from("invoice_items").insert(itemsToInsert);
      if (itemsError) throw itemsError;

      return invoiceId;
    },
    onSuccess: (invoiceId) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice saved successfully" });
      if (invoiceId) {
        setCurrentInvoiceId(invoiceId);
      }
      if (isNew && invoiceId) {
        navigate(`/visage/invoices/${invoiceId}`);
      }
    },
    onError: (error: any) => {
      toast({ title: "Failed to save invoice", description: error.message, variant: "destructive" });
    },
  });

  // Send invoice mutation
  const sendMutation = useMutation({
    mutationFn: async () => {
      setSendingInvoice(true);
      // Save first and get the invoice ID
      const savedInvoiceId = await saveMutation.mutateAsync();
      
      const invoiceIdToSend = savedInvoiceId || currentInvoiceId;
      if (!invoiceIdToSend) {
        throw new Error("Invoice must be saved before sending");
      }
      
      const { data, error } = await supabase.functions.invoke("send-invoice", {
        body: { invoiceId: invoiceIdToSend },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice sent successfully" });
      setSendingInvoice(false);
    },
    onError: (error: any) => {
      toast({ title: "Failed to send invoice", description: error.message, variant: "destructive" });
      setSendingInvoice(false);
    },
  });

  if (isLoading) {
    return <div className="p-6">Loading invoice...</div>;
  }

  const currencySymbol = currencySymbols[formData.currency] || "$";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/visage/invoices")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {isNew ? "New Invoice" : `Invoice ${formData.invoice_number}`}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? "Create a new invoice" : "Edit invoice details"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending}>
            <Save className="h-4 w-4 mr-2" />
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
          {!isNew && formData.status === "draft" && (
            <Button onClick={() => sendMutation.mutate()} disabled={sendingInvoice}>
              <Send className="h-4 w-4 mr-2" />
              {sendingInvoice ? "Sending..." : "Send Invoice"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Invoice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input value={formData.invoice_number} disabled className="bg-muted" />
            </div>
            <div>
              <Label>Invoice Date</Label>
              <Input
                type="date"
                value={formData.invoice_date}
                onChange={(e) => setFormData({ ...formData, invoice_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Client Name *</Label>
              <Input
                value={formData.client_name}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Company Name</Label>
              <Input
                value={formData.client_company}
                onChange={(e) => setFormData({ ...formData, client_company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div>
              <Label>Client Email *</Label>
              <Input
                type="email"
                value={formData.client_email}
                onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Client Address</Label>
              <Input
                value={formData.client_address}
                onChange={(e) => setFormData({ ...formData, client_address: e.target.value })}
                placeholder="123 Main St, City, Country"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Service Items</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => {
                const name = prompt("Enter new service name:");
                if (name && name.trim()) {
                  setCustomServices(prev => [...prev, name.trim()]);
                  toast({ title: "Service added", description: `"${name.trim()}" added to services list` });
                }
              }}>
                <Plus className="h-4 w-4 mr-1" />
                New Service
              </Button>
              <Button size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-start border-b pb-4">
                  <div className="col-span-12 md:col-span-3">
                    <Label className="text-xs">Service</Label>
                    <Select
                      value={item.service_name}
                      onValueChange={(value) => {
                        if (value === "__custom__") {
                          const customName = prompt("Enter custom service name:");
                          if (customName && customName.trim()) {
                            setCustomServices(prev => [...prev, customName.trim()]);
                            updateItem(index, "service_name", customName.trim());
                          }
                        } else {
                          updateItem(index, "service_name", value);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...defaultServices, ...customServices].map((service) => (
                          <SelectItem key={service} value={service}>
                            {service}
                          </SelectItem>
                        ))}
                        <SelectItem value="__custom__" className="text-primary font-medium">
                          + Add Custom Service
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-12 md:col-span-4">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(index, "description", e.target.value)}
                      placeholder="Service description..."
                    />
                  </div>
                  <div className="col-span-4 md:col-span-1">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2">
                    <Label className="text-xs">Unit Price ({currencySymbol})</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unit_price}
                      onChange={(e) => updateItem(index, "unit_price", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="col-span-3 md:col-span-1">
                    <Label className="text-xs">Total</Label>
                    <div className="h-10 flex items-center font-medium">
                      {currencySymbol}{item.line_total.toFixed(2)}
                    </div>
                  </div>
                  <div className="col-span-1 flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={items.length === 1}
                      className="h-10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Discount (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_percentage: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.tax_rate}
                    onChange={(e) =>
                      setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2 text-right">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>{currencySymbol}{subtotal.toFixed(2)}</span>
                </div>
                {formData.discount_percentage > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({formData.discount_percentage}%):</span>
                    <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                {formData.tax_rate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax ({formData.tax_rate}%):</span>
                    <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Grand Total:</span>
                  <span>{currencySymbol}{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes for the client..."
              rows={3}
            />
          </CardContent>
        </Card>
      </div>

      {/* Invoice Preview Dialog */}
      <InvoicePreview
        open={showPreview}
        onOpenChange={setShowPreview}
        invoice={{
          ...formData,
          subtotal,
          discount_amount: discountAmount,
          tax_amount: taxAmount,
          total_amount: totalAmount,
        }}
        items={items}
      />
    </div>
  );
}
