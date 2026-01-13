import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Eye, Edit, Copy, Trash2, Send, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  status: InvoiceStatus;
  client_name: string;
  client_company: string | null;
  client_email: string;
  total_amount: number;
  currency: string;
  created_at: string;
}

const statusColors: Record<InvoiceStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  paid: "bg-green-100 text-green-800",
  overdue: "bg-red-100 text-red-800",
};

const currencySymbols: Record<string, string> = {
  USD: "$",
  GBP: "£",
};

export default function Invoices() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice deleted successfully" });
      setDeleteId(null);
    },
    onError: () => {
      toast({ title: "Failed to delete invoice", variant: "destructive" });
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("invoices")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice marked as paid" });
    },
    onError: () => {
      toast({ title: "Failed to update invoice", variant: "destructive" });
    },
  });

  const sendInvoiceMutation = useMutation({
    mutationFn: async (id: string) => {
      setSendingId(id);
      const { data, error } = await supabase.functions.invoke("send-invoice", {
        body: { invoiceId: id },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast({ title: "Invoice sent successfully" });
      setSendingId(null);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to send invoice", 
        description: error.message,
        variant: "destructive" 
      });
      setSendingId(null);
    },
  });

  const duplicateInvoice = async (invoice: Invoice) => {
    // Get invoice number
    const { data: invoiceNumber } = await supabase.rpc("generate_invoice_number");
    
    // Get invoice items
    const { data: items } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoice.id);

    // Create new invoice
    const { data: newInvoice, error: invoiceError } = await supabase
      .from("invoices")
      .insert({
        invoice_number: invoiceNumber,
        invoice_date: new Date().toISOString().split("T")[0],
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        status: "draft",
        client_name: invoice.client_name,
        client_company: invoice.client_company,
        client_email: invoice.client_email,
        subtotal: invoice.total_amount,
        total_amount: invoice.total_amount,
        currency: invoice.currency,
      })
      .select()
      .single();

    if (invoiceError) {
      toast({ title: "Failed to duplicate invoice", variant: "destructive" });
      return;
    }

    // Copy items
    if (items && items.length > 0) {
      await supabase.from("invoice_items").insert(
        items.map((item) => ({
          invoice_id: newInvoice.id,
          service_name: item.service_name,
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.line_total,
          sort_order: item.sort_order,
        }))
      );
    }

    queryClient.invalidateQueries({ queryKey: ["invoices"] });
    toast({ title: "Invoice duplicated successfully" });
  };

  if (isLoading) {
    return <div className="p-6">Loading invoices...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage client invoices</p>
        </div>
        <Button onClick={() => navigate("/visage/invoices/new")}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="bg-background border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No invoices yet. Create your first invoice.
                </TableCell>
              </TableRow>
            )}
            {invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{invoice.client_name}</div>
                    {invoice.client_company && (
                      <div className="text-sm text-muted-foreground">{invoice.client_company}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</TableCell>
                <TableCell>{format(new Date(invoice.due_date), "MMM dd, yyyy")}</TableCell>
                <TableCell>
                  {currencySymbols[invoice.currency] || "$"}
                  {Number(invoice.total_amount).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[invoice.status]} variant="secondary">
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/visage/invoices/${invoice.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View / Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => duplicateInvoice(invoice)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      {invoice.status === "draft" && (
                        <DropdownMenuItem 
                          onClick={() => sendInvoiceMutation.mutate(invoice.id)}
                          disabled={sendingId === invoice.id}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {sendingId === invoice.id ? "Sending..." : "Send Invoice"}
                        </DropdownMenuItem>
                      )}
                      {(invoice.status === "sent" || invoice.status === "overdue") && (
                        <DropdownMenuItem onClick={() => markPaidMutation.mutate(invoice.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Paid
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this invoice? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
