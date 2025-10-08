import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, RefreshCw } from "lucide-react";
import type { Invoice } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface RefundRequestModalProps {
  invoice: Invoice;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RefundRequestModal = ({ invoice, open, onClose, onSuccess }: RefundRequestModalProps) => {
  const { toast } = useToast();
  const [reason, setReason] = useState("");

  const refundMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/refund-requests", {
        invoiceId: invoice.id,
        reason,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Refund Request Submitted",
        description: "Your refund request has been submitted successfully. We'll review it within 3-5 business days.",
      });
      setReason("");
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Submit Request",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reason.trim().length < 10) {
      toast({
        title: "Reason Required",
        description: "Please provide a detailed reason for the refund (at least 10 characters).",
        variant: "destructive",
      });
      return;
    }

    refundMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-space-900 border-space-700">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-cosmic-blue" />
              Request Refund
            </DialogTitle>
            <DialogDescription className="text-space-300">
              Submit a refund request for your purchase. Our team will review it within 3-5 business days.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* Order Details */}
            <div className="space-y-3 p-4 bg-space-800 rounded-lg border border-space-700">
              <div className="flex justify-between">
                <span className="text-space-400">Item:</span>
                <span className="text-white font-medium">{invoice.itemName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Invoice:</span>
                <span className="text-white font-mono text-sm">{invoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Amount:</span>
                <span className="text-cosmic-blue font-bold">₹{parseFloat(invoice.totalAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-space-400">Purchase Date:</span>
                <span className="text-white text-sm">
                  {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>

            {/* Refund Policy Notice */}
            <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-medium mb-1">Refund Policy</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-300/80">
                  <li>7-day money-back guarantee</li>
                  <li>Refund processed within 7-10 business days</li>
                  <li>Amount credited to original payment method</li>
                </ul>
              </div>
            </div>

            {/* Reason Input */}
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-white">
                Reason for Refund *
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a detailed reason for requesting a refund (minimum 10 characters)..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[120px] bg-space-800 border-space-600 text-white"
                required
              />
              <p className="text-xs text-space-400">
                {reason.length} / {reason.length >= 10 ? '✓' : '10 minimum'} characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={refundMutation.isPending}
              className="border-space-600 text-space-300 hover:bg-space-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={refundMutation.isPending || reason.trim().length < 10}
              className="bg-cosmic-blue hover:bg-blue-600"
            >
              {refundMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RefundRequestModal;

