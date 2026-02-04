import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogStatusBadge from '@/components/BlogStatusBadge';
import WordPressStyleEditor from '@/components/admin/WordPressStyleEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Send, MessageSquare } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const BlogEditorUser: React.FC = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, firebaseUser, isLoading: authLoading } = useAuth();
  const isEditing = Boolean(id);
  
  const [adminFeedback, setAdminFeedback] = useState('');
  const [postStatus, setPostStatus] = useState('draft');

  // Fetch existing blog post if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['/api/blog-posts', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest('GET', `/api/blog-posts/${id}`);
      return response.json();
    },
    enabled: isEditing,
  });

  // Load admin feedback and status
  useEffect(() => {
    if (existingPost) {
      setAdminFeedback(existingPost.adminFeedback || '');
      setPostStatus(existingPost.status || 'draft');
    }
  }, [existingPost]);

  // Save as draft mutation
  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/admin/blog-posts/${id}` : '/api/admin/blog-posts';
      const response = await apiRequest(method, url, {
        ...data,
        authorId: firebaseUser?.uid,
        authorName: data.authorName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || ''),
        authorImageUrl: data.authorImageUrl || user?.profileImageUrl || '',
        status: 'draft',
        isPublished: false,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/blog-posts'] });
      toast({
        title: 'Blog post saved!',
        description: 'Your draft has been saved successfully.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Submit for review mutation (combines save + submit)
  const submitMutation = useMutation({
    mutationFn: async (data: any) => {
      // First save/update the post
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/admin/blog-posts/${id}` : '/api/admin/blog-posts';
      const saveResponse = await apiRequest(method, url, {
        ...data,
        authorId: firebaseUser?.uid,
        authorName: data.authorName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || ''),
        authorImageUrl: data.authorImageUrl || user?.profileImageUrl || '',
        status: 'draft',
      });
      const savedPost = await saveResponse.json();
      
      // Then submit for review
      const submitResponse = await apiRequest('POST', `/api/user/blog-posts/${savedPost.id}/submit`);
      return submitResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/blog-posts'] });
      toast({
        title: 'Submitted for review!',
        description: 'Your blog post has been sent to admins for approval.',
      });
      navigate('/blog/my-posts');
    },
    onError: (error: any) => {
      toast({
        title: 'Error submitting post',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Redirect if not authenticated
  if (!authLoading && !firebaseUser) {
    navigate('/');
    return null;
  }

  if (authLoading || (isEditing && isLoadingPost)) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-blue"></div>
      </div>
    );
  }

  // Handler for saving draft
  const handleSave = (data: any) => {
    saveMutation.mutate(data);
  };

  // Handler for submitting for review
  const handleSubmit = (data: any) => {
    submitMutation.mutate(data);
  };

  // Preview handler (optional - can open in new window)
  const handlePreview = (data: any) => {
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${data.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #0a0e27; color: #e5e7eb; }
            h1 { color: #60a5fa; }
            .meta { color: #9ca3af; font-size: 14px; margin-bottom: 20px; }
            .content { line-height: 1.6; }
            .featured-image { max-width: 100%; height: auto; margin: 20px 0; border-radius: 8px; }
          </style>
        </head>
        <body>
          <h1>${data.title}</h1>
          <div class="meta">
            By ${data.authorName}${data.authorTitle ? `, ${data.authorTitle}` : ''} | 
            ${new Date().toLocaleDateString()}
          </div>
          ${data.featuredImage ? `<img src="${data.featuredImage}" alt="${data.title}" class="featured-image" />` : ''}
          <div class="content">${data.content}</div>
        </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />

      <div className="pt-20">
        <div className="mx-auto">
          {/* Header with back button and status */}
          <div className="bg-space-800 border-b border-space-700 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/blog/my-posts')}
                  className="text-space-300 hover:text-white"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to My Blogs
                </Button>
                {isEditing && postStatus && (
                  <BlogStatusBadge status={postStatus} />
                )}
              </div>
              
              {/* Submit for Review Button */}
              <Button
                onClick={() => {
                  // Get current form data from the editor and submit
                  const editorData = (document.querySelector('[data-editor-content]') as any)?.getCurrentData?.();
                  if (editorData) {
                    handleSubmit(editorData);
                  }
                }}
                disabled={submitMutation.isPending}
                className="bg-cosmic-blue hover:bg-blue-600"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitMutation.isPending ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          </div>

          {/* Admin Feedback Alert */}
          {adminFeedback && (
            <div className="max-w-7xl mx-auto px-6 pt-6">
              <Card className="bg-yellow-900/20 border-yellow-700/30">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-yellow-400 mb-2">Admin Feedback</h3>
                      <p className="text-space-300 whitespace-pre-wrap">{adminFeedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* WordPress-Style Editor */}
          <WordPressStyleEditor
            initialData={existingPost ? {
              title: existingPost.title || '',
              content: existingPost.content || '',
              excerpt: existingPost.excerpt || '',
              featuredImage: existingPost.featuredImage || '',
              categories: existingPost.categories || [],
              tags: existingPost.tags || [],
              seoTitle: existingPost.seoTitle || '',
              seoDescription: existingPost.seoDescription || '',
              isPublished: false,
              scheduledDate: existingPost.scheduledDate || '',
              authorName: existingPost.authorName || (user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || ''),
              authorTitle: existingPost.authorTitle || '',
              authorImageUrl: existingPost.authorImageUrl || user?.profileImageUrl || '',
            } : {
              title: '',
              content: '',
              excerpt: '',
              featuredImage: '',
              categories: [],
              tags: [],
              seoTitle: '',
              seoDescription: '',
              isPublished: false,
              scheduledDate: '',
              authorName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email || '',
              authorTitle: '',
              authorImageUrl: user?.profileImageUrl || '',
            }}
            onSave={handleSave}
            onPublish={handleSubmit}
            onPreview={handlePreview}
            isLoading={saveMutation.isPending || submitMutation.isPending}
            publishButtonText="Submit for Review"
            saveButtonText="Save Draft"
            isUserEditor={true}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogEditorUser;

