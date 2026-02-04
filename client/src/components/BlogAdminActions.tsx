import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, XCircle, Edit3 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface BlogAdminActionsProps {
  postId: number;
  postTitle: string;
  onSuccess?: () => void;
}

const BlogAdminActions: React.FC<BlogAdminActionsProps> = ({ 
  postId, 
  postTitle, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [feedbackDialog, setFeedbackDialog] = useState<'reject' | 'revision' | null>(null);
  const [feedback, setFeedback] = useState('');

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/admin/blog-posts/${postId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      toast({
        title: 'Blog post approved!',
        description: `"${postTitle}" has been published successfully.`,
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error approving post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (feedbackText: string) => {
      const response = await apiRequest('POST', `/api/admin/blog-posts/${postId}/reject`, {
        feedback: feedbackText,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      toast({
        title: 'Blog post rejected',
        description: `Feedback has been sent to the author.`,
      });
      setFeedbackDialog(null);
      setFeedback('');
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error rejecting post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Request revision mutation
  const revisionMutation = useMutation({
    mutationFn: async (feedbackText: string) => {
      const response = await apiRequest('POST', `/api/admin/blog-posts/${postId}/request-revision`, {
        feedback: feedbackText,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/blog-posts'] });
      toast({
        title: 'Revision requested',
        description: `The author has been notified to make changes.`,
      });
      setFeedbackDialog(null);
      setFeedback('');
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error requesting revision',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleApprove = () => {
    approveMutation.mutate();
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast({
        title: 'Feedback required',
        description: 'Please provide feedback when rejecting a post.',
        variant: 'destructive',
      });
      return;
    }
    rejectMutation.mutate(feedback);
  };

  const handleRequestRevision = () => {
    if (!feedback.trim()) {
      toast({
        title: 'Feedback required',
        description: 'Please provide feedback when requesting revisions.',
        variant: 'destructive',
      });
      return;
    }
    revisionMutation.mutate(feedback);
  };

  return (
    <>
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={handleApprove}
          disabled={approveMutation.isPending}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {approveMutation.isPending ? 'Approving...' : 'Approve & Publish'}
        </Button>

        <Button
          onClick={() => setFeedbackDialog('revision')}
          disabled={revisionMutation.isPending}
          variant="outline"
          className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Request Changes
        </Button>

        <Button
          onClick={() => setFeedbackDialog('reject')}
          disabled={rejectMutation.isPending}
          variant="outline"
          className="border-red-600 text-red-400 hover:bg-red-600/10"
        >
          <XCircle className="w-4 h-4 mr-2" />
          Reject
        </Button>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog !== null} onOpenChange={() => setFeedbackDialog(null)}>
        <DialogContent className="bg-space-800 border-space-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              {feedbackDialog === 'reject' ? 'Reject Blog Post' : 'Request Revisions'}
            </DialogTitle>
            <DialogDescription className="text-space-300">
              Provide feedback to help the author improve their post.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] bg-space-700 border-space-600 text-white"
            />
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setFeedbackDialog(null);
                setFeedback('');
              }}
              className="text-space-300"
            >
              Cancel
            </Button>
            <Button
              onClick={feedbackDialog === 'reject' ? handleReject : handleRequestRevision}
              disabled={!feedback.trim() || rejectMutation.isPending || revisionMutation.isPending}
              className={feedbackDialog === 'reject' ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
            >
              {feedbackDialog === 'reject' ? 'Reject Post' : 'Request Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BlogAdminActions;

