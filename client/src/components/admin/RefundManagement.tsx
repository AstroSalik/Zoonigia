import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Search, CheckCircle, XCircle, Eye, Clock, FileText } from "lucide-react";
import type { RefundRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import GlassMorphism from "@/components/GlassMorphism";

const RefundManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const { data: refundRequests = [], isLoading, refetch } = useQuery<RefundRequest[]>({
    queryKey: ["/api/admin/refund-requests"],
  });

  const updateRefundMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: string; notes: string }) => {
      const response = await apiRequest("PUT", `/api/admin/refund-requests/${id}`, {
        status,
        adminNotes: notes,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Refund Updated",
        description: "The refund request has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/refund-requests"] });
      setShowActionModal(false);
      setSelectedRefund(null);
      setAdminNotes("");
      setActionType(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update refund request.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'processed':
        return 'bg-cosmic-blue/20 text-cosmic-blue border-cosmic-blue/30';
      default:
        return 'bg-space-600/20 text-space-400 border-space-600/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'processed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const filteredRequests = refundRequests.filter(request => {
    const matchesSearch = 
      request.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: refundRequests.length,
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    rejected: refundRequests.filter(r => r.status === 'rejected').length,
    processed: refundRequests.filter(r => r.status === 'processed').length,
  };

  const handleAction = (refund: RefundRequest, action: 'approve' | 'reject') => {
    setSelectedRefund(refund);
    setActionType(action);
    setAdminNotes("");
    setShowActionModal(true);
  };

  const handleSubmitAction = () => {
    if (!selectedRefund || !actionType) return;

    const status = actionType === 'approve' ? 'approved' : 'rejected';
    updateRefundMutation.mutate({
      id: selectedRefund.id,
      status,
      notes: adminNotes,
    });
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
          <h2 className="text-2xl font-bold text-white mb-2">Refund Management</h2>
          <p className="text-space-300">Review and process refund requests</p>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <GlassMorphism className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-space-400">Total</div>
          </div>
        </GlassMorphism>
        <GlassMorphism className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-space-400">Pending</div>
          </div>
        </GlassMorphism>
        <GlassMorphism className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-sm text-space-400">Approved</div>
          </div>
        </GlassMorphism>
        <GlassMorphism className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-sm text-space-400">Rejected</div>
          </div>
        </GlassMorphism>
        <GlassMorphism className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-cosmic-blue">{stats.processed}</div>
            <div className="text-sm text-space-400">Processed</div>
          </div>
        </GlassMorphism>
      </div>

      {/* Filters */}
      <Card className="glass-morphism border-space-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-space-400 w-4 h-4" />
                <Input
                  placeholder="Search by item name or user ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-space-800 border-space-600 text-white"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 bg-space-800 border-space-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Refund Requests List */}
      {filteredRequests.length === 0 ? (
        <Card className="glass-morphism border-space-700">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-space-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Refund Requests</h3>
            <p className="text-space-400">
              {searchTerm || filterStatus !== 'all' 
                ? "Try adjusting your filters" 
                : "No refund requests have been submitted yet"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="glass-morphism border-space-700 hover:border-cosmic-blue/50 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Request Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(request.status)}
                      <h3 className="text-lg font-semibold text-white">{request.itemName}</h3>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-space-400">
                      <div>User ID: {request.userId}</div>
                      <div>Invoice ID: #{request.invoiceId}</div>
                      <div>Type: {request.itemType}</div>
                      <div>Requested: {new Date(request.createdAt).toLocaleDateString()}</div>
                      {request.processedAt && (
                        <div>Processed: {new Date(request.processedAt).toLocaleDateString()}</div>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-2xl font-bold text-cosmic-blue">
                      ₹{parseFloat(request.refundAmount).toFixed(2)}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-cosmic-blue text-cosmic-blue hover:bg-cosmic-blue/10"
                        onClick={() => {
                          setSelectedRefund(request);
                          setShowDetailsModal(true);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>

                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleAction(request, 'approve')}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleAction(request, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-[600px] bg-space-900 border-space-700">
          <DialogHeader>
            <DialogTitle className="text-white">Refund Request Details</DialogTitle>
          </DialogHeader>
          {selectedRefund && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-space-800 rounded-lg">
                <div>
                  <div className="text-sm text-space-400">Item</div>
                  <div className="text-white font-medium">{selectedRefund.itemName}</div>
                </div>
                <div>
                  <div className="text-sm text-space-400">Amount</div>
                  <div className="text-cosmic-blue font-bold">₹{parseFloat(selectedRefund.refundAmount).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-sm text-space-400">User ID</div>
                  <div className="text-white">{selectedRefund.userId}</div>
                </div>
                <div>
                  <div className="text-sm text-space-400">Status</div>
                  <Badge className={getStatusColor(selectedRefund.status)}>
                    {selectedRefund.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold text-white mb-2">User's Reason:</div>
                <div className="p-3 bg-space-800 rounded-lg text-space-300">
                  {selectedRefund.reason}
                </div>
              </div>

              {selectedRefund.adminNotes && (
                <div>
                  <div className="text-sm font-semibold text-white mb-2">Admin Notes:</div>
                  <div className="p-3 bg-space-800 rounded-lg text-space-300 border border-cosmic-blue/30">
                    {selectedRefund.adminNotes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Modal */}
      <Dialog open={showActionModal} onOpenChange={setShowActionModal}>
        <DialogContent className="sm:max-w-[500px] bg-space-900 border-space-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {actionType === 'approve' ? 'Approve' : 'Reject'} Refund Request
            </DialogTitle>
            <DialogDescription className="text-space-300">
              Provide notes about your decision (optional but recommended)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-notes" className="text-white">Admin Notes</Label>
              <Textarea
                id="admin-notes"
                placeholder="Enter notes about your decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="mt-2 bg-space-800 border-space-600 text-white min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowActionModal(false)}
              className="border-space-600 text-space-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitAction}
              disabled={updateRefundMutation.isPending}
              className={actionType === 'approve' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
            >
              {updateRefundMutation.isPending ? 'Processing...' : `Confirm ${actionType === 'approve' ? 'Approval' : 'Rejection'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RefundManagement;

