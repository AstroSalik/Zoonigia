import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogStatusBadge from '@/components/BlogStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Send, 
  Eye,
  Search,
  MessageSquare
} from 'lucide-react';
import { BlogPost } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';

const UserBlogDashboard: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, firebaseUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [deletePostId, setDeletePostId] = useState<number | null>(null);

  // Fetch user's blog posts
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/user/blog-posts'],
    enabled: !!firebaseUser,
  });

  // Submit for review mutation
  const submitMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('POST', `/api/user/blog-posts/${postId}/submit`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/blog-posts'] });
      toast({
        title: 'Submitted for review!',
        description: 'Your blog post has been sent to admins for approval.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest('DELETE', `/api/admin/blog-posts/${postId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/blog-posts'] });
      toast({
        title: 'Blog post deleted',
        description: 'Your blog post has been removed.',
      });
      setDeletePostId(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Redirect if not authenticated
  if (!authLoading && !firebaseUser) {
    setLocation('/');
    return null;
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-blue"></div>
      </div>
    );
  }

  const filteredPosts = blogPosts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (postId: number) => {
    submitMutation.mutate(postId);
  };

  const handleDelete = (postId: number) => {
    setDeletePostId(postId);
  };

  const confirmDelete = () => {
    if (deletePostId) {
      deleteMutation.mutate(deletePostId);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-space font-bold mb-2">My Blog Posts</h1>
              <p className="text-space-300">
                Manage your blog posts and track their review status
              </p>
            </div>
            <Button
              onClick={() => setLocation('/blog/new')}
              className="cosmic-gradient hover:opacity-90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Post
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-space-400" />
              <Input
                placeholder="Search your posts..."
                className="pl-10 bg-space-800 border-space-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Blog Posts Grid */}
          {filteredPosts && filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-space-800/50 border-space-700 flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <BlogStatusBadge status={post.status || 'draft'} />
                      {post.featuredImage && (
                        <img 
                          src={post.featuredImage} 
                          alt={post.title}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                    </div>
                    <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-space-300 mb-4 line-clamp-3 flex-1">
                      {post.excerpt || (post.content.length > 150 
                        ? `${post.content.substring(0, 150)}...` 
                        : post.content)}
                    </p>

                    {/* Admin Feedback */}
                    {post.adminFeedback && (
                      <div className="mb-4 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="w-4 h-4 text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-xs font-semibold text-yellow-400 mb-1">
                              Admin Feedback:
                            </p>
                            <p className="text-sm text-space-300">{post.adminFeedback}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setLocation(`/blog/${post.id}`)}
                        className="border-space-600"
                      >
                        <Eye className="w-3.5 h-3.5 mr-1" />
                        View
                      </Button>

                      {(post.status === 'draft' || post.status === 'rejected') && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setLocation(`/blog/edit/${post.id}`)}
                            className="border-space-600"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" />
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSubmit(post.id)}
                            disabled={submitMutation.isPending}
                            className="bg-cosmic-blue hover:bg-blue-600"
                          >
                            <Send className="w-3.5 h-3.5 mr-1" />
                            Submit
                          </Button>
                        </>
                      )}

                      {post.status !== 'published' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(post.id)}
                          className="border-red-600 text-red-400 hover:bg-red-600/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>

                    {/* Timestamps */}
                    <div className="mt-4 pt-4 border-t border-space-700 text-xs text-space-400">
                      <div className="flex justify-between">
                        <span>Created: {new Date(post.createdAt!).toLocaleDateString()}</span>
                        {post.publishedAt && (
                          <span>Published: {new Date(post.publishedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-space-800/50 border-space-700 p-12 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-semibold mb-4">No blog posts yet</h3>
                <p className="text-space-300 mb-6">
                  Start sharing your knowledge and experiences with the community!
                </p>
                <Button
                  onClick={() => setLocation('/blog/new')}
                  className="cosmic-gradient hover:opacity-90"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Post
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      <Footer />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deletePostId !== null} onOpenChange={() => setDeletePostId(null)}>
        <AlertDialogContent className="bg-space-800 border-space-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription className="text-space-300">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-space-700 text-white border-space-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserBlogDashboard;

