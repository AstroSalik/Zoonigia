import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, RefreshCw, Search, Calendar } from "lucide-react";
import type { Invoice } from "@shared/schema";
import RefundRequestModal from "./RefundRequestModal";

const OrderHistory = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const { data: invoices = [], isLoading, refetch } = useQuery<Invoice[]>({
    queryKey: ["/api/user/invoices"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'refunded':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-space-600/20 text-space-400 border-space-600/30';
    }
  };

  const getItemTypeIcon = (type: string) => {
    switch (type) {
      case 'course':
        return '📚';
      case 'workshop':
        return '🔬';
      case 'campaign':
        return '🚀';
      default:
        return '📦';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || invoice.itemType === filterType;
    return matchesSearch && matchesType;
  });

  const canRequestRefund = (invoice: Invoice) => {
    // Can request refund if:
    // 1. Payment is completed
    // 2. Not already refunded
    // 3. Within refund period (e.g., 7 days for courses)
    if (invoice.paymentStatus !== 'completed') return false;
    if (invoice.paymentStatus === 'refunded') return false;
    
    const daysSincePurchase = Math.floor(
      (new Date().getTime() - new Date(invoice.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return daysSincePurchase <= 7; // 7-day refund window
  };

  const handleRefundClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowRefundModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Order History</h2>
          <p className="text-space-300">View and manage your purchases</p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-morphism border-space-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-space-400 w-4 h-4" />
                <Input
                  placeholder="Search by item name or invoice number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-space-800 border-space-600 text-white"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 bg-space-800 border-space-600 text-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="course">Courses</SelectItem>
                <SelectItem value="workshop">Workshops</SelectItem>
                <SelectItem value="campaign">Campaigns</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredInvoices.length === 0 ? (
        <Card className="glass-morphism border-space-700">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-space-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Orders Found</h3>
            <p className="text-space-400">
              {searchTerm || filterType !== 'all' 
                ? "Try adjusting your filters" 
                : "You haven't made any purchases yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <Card key={invoice.id} className="glass-morphism border-space-700 hover:border-cosmic-blue/50 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Item Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{getItemTypeIcon(invoice.itemType)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-white">{invoice.itemName}</h3>
                          <Badge className={getStatusColor(invoice.paymentStatus)}>
                            {invoice.paymentStatus}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-space-400">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span>Invoice: {invoice.invoiceNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          {invoice.paymentMethod && (
                            <div className="flex items-center gap-2">
                              <span className="capitalize">Payment: {invoice.paymentMethod}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cosmic-blue">
                        ₹{parseFloat(invoice.totalAmount).toFixed(2)}
                      </div>
                      {invoice.tax && parseFloat(invoice.tax) > 0 && (
                        <div className="text-xs text-space-400">
                          (incl. tax: ₹{parseFloat(invoice.tax).toFixed(2)})
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10"
                        onClick={() => {
                          toast({
                            title: "Invoice Download",
                            description: "Invoice download feature coming soon!",
                          });
                        }}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Invoice
                      </Button>

                      {canRequestRefund(invoice) && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
                          onClick={() => handleRefundClick(invoice)}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Refund
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Refund Request Modal */}
      {selectedInvoice && (
        <RefundRequestModal
          invoice={selectedInvoice}
          open={showRefundModal}
          onClose={() => {
            setShowRefundModal(false);
            setSelectedInvoice(null);
          }}
          onSuccess={() => {
            refetch();
            setShowRefundModal(false);
            setSelectedInvoice(null);
          }}
        />
      )}
    </div>
  );
};

export default OrderHistory;

