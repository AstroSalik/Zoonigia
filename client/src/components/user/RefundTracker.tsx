import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, XCircle, RefreshCw, AlertCircle, FileText } from "lucide-react";
import type { RefundRequest } from "@shared/schema";

const RefundTracker = () => {
  const { data: refundRequests = [], isLoading, refetch } = useQuery<RefundRequest[]>({
    queryKey: ["/api/user/refund-requests"],
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'approved':
        return <CheckCircle2 className="w-5 h-5 text-green-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'processed':
        return <CheckCircle2 className="w-5 h-5 text-cosmic-blue" />;
      default:
        return <AlertCircle className="w-5 h-5 text-space-400" />;
    }
  };

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your refund request is being reviewed by our team.';
      case 'approved':
        return 'Your refund has been approved and will be processed soon.';
      case 'rejected':
        return 'Your refund request was not approved. See admin notes for details.';
      case 'processed':
        return 'Your refund has been processed successfully.';
      default:
        return 'Status unknown';
    }
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
          <h2 className="text-2xl font-bold text-white mb-2">Refund Requests</h2>
          <p className="text-space-300">Track the status of your refund requests</p>
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

      {/* Refund Requests List */}
      {refundRequests.length === 0 ? (
        <Card className="glass-morphism border-space-700">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-space-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Refund Requests</h3>
            <p className="text-space-400">
              You haven't submitted any refund requests yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {refundRequests.map((request) => (
            <Card key={request.id} className="glass-morphism border-space-700">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {request.itemName}
                        </h3>
                        <p className="text-sm text-space-400">
                          Requested on {new Date(request.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(request.status)}>
                      {request.status.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between p-3 bg-space-800 rounded-lg">
                    <span className="text-space-400">Refund Amount:</span>
                    <span className="text-xl font-bold text-cosmic-blue">
                      ₹{parseFloat(request.refundAmount).toFixed(2)}
                    </span>
                  </div>

                  {/* Status Message */}
                  <div className={`p-3 rounded-lg border ${
                    request.status === 'pending' ? 'bg-yellow-500/10 border-yellow-500/30' :
                    request.status === 'approved' ? 'bg-green-500/10 border-green-500/30' :
                    request.status === 'rejected' ? 'bg-red-500/10 border-red-500/30' :
                    'bg-cosmic-blue/10 border-cosmic-blue/30'
                  }`}>
                    <p className="text-sm text-white">
                      {getStatusMessage(request.status)}
                    </p>
                  </div>

                  {/* Reason */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Your Reason:</h4>
                    <p className="text-sm text-space-300 p-3 bg-space-800 rounded-lg">
                      {request.reason}
                    </p>
                  </div>

                  {/* Admin Notes (if any) */}
                  {request.adminNotes && (
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">Admin Response:</h4>
                      <p className="text-sm text-space-300 p-3 bg-space-800 rounded-lg border border-cosmic-blue/30">
                        {request.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Processing Info */}
                  {request.processedAt && (
                    <div className="text-xs text-space-400 flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      <span>
                        Processed on {new Date(request.processedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RefundTracker;

