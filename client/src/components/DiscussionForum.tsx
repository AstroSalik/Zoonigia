import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Pin, 
  Lock,
  Send,
  Plus,
  Reply,
  CheckCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface DiscussionForumProps {
  referenceType: 'course' | 'campaign' | 'workshop' | 'general';
  referenceId?: number;
  title?: string;
}

export default function DiscussionForum({ referenceType, referenceId, title = "Discussion Forum" }: DiscussionForumProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedThread, setSelectedThread] = useState<any>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newThread, setNewThread] = useState({ title: "", content: "" });
  const [replyContent, setReplyContent] = useState("");

  // Fetch threads
  const { data: threadsData = [], isLoading } = useQuery({
    queryKey: ["/api/forum/threads", { referenceType, referenceId }],
    queryFn: async () => {
      const params = new URLSearchParams({
        referenceType,
        ...(referenceId && { referenceId: referenceId.toString() })
      });
      const response = await fetch(`/api/forum/threads?${params}`);
      if (!response.ok) throw new Error("Failed to fetch threads");
      return response.json();
    },
  });

  // Fetch single thread with replies
  const { data: threadDetail } = useQuery({
    queryKey: ["/api/forum/threads", selectedThread?.thread?.id],
    queryFn: async () => {
      const response = await fetch(`/api/forum/threads/${selectedThread.thread.id}`);
      if (!response.ok) throw new Error("Failed to fetch thread");
      return response.json();
    },
    enabled: !!selectedThread?.thread?.id,
  });

  // Create thread mutation
  const createThreadMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/forum/threads", data);
    },
    onSuccess: () => {
      toast({ title: "Thread created successfully!" });
      setIsCreateDialogOpen(false);
      setNewThread({ title: "", content: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads"] });
    },
    onError: () => {
      toast({ title: "Failed to create thread", variant: "destructive" });
    },
  });

  // Create reply mutation
  const createReplyMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/forum/replies", data);
    },
    onSuccess: () => {
      toast({ title: "Reply posted successfully!" });
      setReplyContent("");
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads"] });
    },
    onError: () => {
      toast({ title: "Failed to post reply", variant: "destructive" });
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ replyId, voteType }: any) => {
      return await apiRequest("POST", `/api/forum/replies/${replyId}/vote`, { voteType });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forum/threads"] });
    },
  });

  const handleCreateThread = () => {
    if (!newThread.title || !newThread.content) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    createThreadMutation.mutate({
      ...newThread,
      referenceType,
      referenceId,
    });
  };

  const handleReply = () => {
    if (!replyContent) {
      toast({ title: "Please enter a reply", variant: "destructive" });
      return;
    }

    createReplyMutation.mutate({
      threadId: selectedThread.thread.id,
      content: replyContent,
    });
  };

  const getUserName = (firstName: string | null, lastName: string | null, authorName: string) => {
    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    return authorName || "Anonymous";
  };

  if (selectedThread) {
    const thread = threadDetail?.thread?.thread || selectedThread.thread;
    const replies = threadDetail?.replies || [];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedThread(null)}>
            ← Back to Threads
          </Button>
        </div>

        {/* Thread Header */}
        <Card className="bg-space-800/50 border-space-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {thread.isPinned && <Pin className="w-4 h-4 text-cosmic-yellow" />}
                  {thread.isLocked && <Lock className="w-4 h-4 text-red-400" />}
                </div>
                <CardTitle className="text-2xl text-white mb-2">{thread.title}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-space-400">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={selectedThread.authorProfileImageUrl || undefined} />
                      <AvatarFallback className="bg-cosmic-purple text-xs">
                        {getUserName(selectedThread.authorFirstName, selectedThread.authorLastName, thread.authorName)[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>{getUserName(selectedThread.authorFirstName, selectedThread.authorLastName, thread.authorName)}</span>
                  </div>
                  <span>•</span>
                  <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {thread.viewCount} views
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-space-200 whitespace-pre-wrap">{thread.content}</p>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            {replies.length} {replies.length === 1 ? "Reply" : "Replies"}
          </h3>

          {replies.map((replyData: any) => {
            const reply = replyData.reply;
            return (
              <Card key={reply.id} className="bg-space-800/30 border-space-700">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={replyData.authorProfileImageUrl || undefined} />
                      <AvatarFallback className="bg-cosmic-blue">
                        {getUserName(replyData.authorFirstName, replyData.authorLastName, reply.authorName)[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-white">
                          {getUserName(replyData.authorFirstName, replyData.authorLastName, reply.authorName)}
                        </span>
                        <span className="text-xs text-space-500">
                          {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                        </span>
                        {reply.isAccepted && (
                          <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Best Answer
                          </Badge>
                        )}
                      </div>
                      <p className="text-space-200 mb-3 whitespace-pre-wrap">{reply.content}</p>
                      
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => voteMutation.mutate({ replyId: reply.id, voteType: 'upvote' })}
                          className="text-space-400 hover:text-cosmic-blue"
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          {reply.upvotes || 0}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => voteMutation.mutate({ replyId: reply.id, voteType: 'downvote' })}
                          className="text-space-400 hover:text-red-400"
                        >
                          <ThumbsDown className="w-4 h-4 mr-1" />
                          {reply.downvotes || 0}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Reply Form */}
          {user && !thread.isLocked && (
            <Card className="bg-space-800/50 border-space-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Post a Reply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={4}
                  className="bg-space-700 border-space-600 text-white"
                />
                <div className="flex justify-end">
                  <Button
                    onClick={handleReply}
                    disabled={createReplyMutation.isPending}
                    className="bg-cosmic-blue hover:bg-blue-600"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Thread List View
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        {user && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cosmic-blue hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                New Thread
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-space-800 border-space-700 text-white">
              <DialogHeader>
                <DialogTitle>Create New Thread</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-space-200">Title</label>
                  <Input
                    value={newThread.title}
                    onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                    placeholder="Thread title..."
                    className="bg-space-700 border-space-600 text-white mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-space-200">Content</label>
                  <Textarea
                    value={newThread.content}
                    onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                    placeholder="What would you like to discuss?"
                    rows={6}
                    className="bg-space-700 border-space-600 text-white mt-1"
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-space-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateThread}
                    disabled={createThreadMutation.isPending}
                    className="bg-cosmic-blue hover:bg-blue-600"
                  >
                    {createThreadMutation.isPending ? "Creating..." : "Create Thread"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-cosmic-blue border-t-transparent rounded-full" />
        </div>
      ) : threadsData.length === 0 ? (
        <Card className="bg-space-800/30 border-space-700">
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-space-500 mx-auto mb-4" />
            <p className="text-space-400">No discussions yet. Start the conversation!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {threadsData.map((threadData: any) => {
            const thread = threadData.thread;
            return (
              <Card
                key={thread.id}
                className="bg-space-800/50 border-space-700 hover:bg-space-700/50 transition-colors cursor-pointer"
                onClick={() => setSelectedThread(threadData)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={threadData.authorProfileImageUrl || undefined} />
                      <AvatarFallback className="bg-cosmic-purple">
                        {getUserName(threadData.authorFirstName, threadData.authorLastName, thread.authorName)[0]}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {thread.isPinned && <Pin className="w-4 h-4 text-cosmic-yellow flex-shrink-0" />}
                            {thread.isLocked && <Lock className="w-4 h-4 text-red-400 flex-shrink-0" />}
                            <h3 className="font-semibold text-white truncate">{thread.title}</h3>
                          </div>
                          <p className="text-sm text-space-400">
                            by {getUserName(threadData.authorFirstName, threadData.authorLastName, thread.authorName)} •{" "}
                            {formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-space-500">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {thread.replyCount || 0}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {thread.viewCount || 0}
                        </div>
                        {thread.lastReplyAt && (
                          <span className="text-xs">
                            Last reply {formatDistanceToNow(new Date(thread.lastReplyAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

