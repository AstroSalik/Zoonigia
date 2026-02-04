import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import WordPressStyleEditor from '@/components/admin/WordPressStyleEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Globe, Eye, Calendar } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

const BlogEditor: React.FC = () => {
  const [, navigate] = useLocation();
  const { id } = useParams<{ id?: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  // Fetch existing blog post if editing
  const { data: existingPost, isLoading: isLoadingPost } = useQuery({
    queryKey: ['/api/admin/blog-posts', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiRequest('GET', `/api/admin/blog-posts/${id}`);
      return response.json();
    },
    enabled: isEditing,
  });

  // Create/Update mutations
  const createBlogPost = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/admin/blog-posts', data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ 
        title: "Blog post created successfully!", 
        description: "Your post has been saved and is ready to publish." 
      });
      navigate('/admin');
    },
    onError: (error: any) => {
      toast({ 
        title: "Error creating blog post", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const updateBlogPost = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', `/api/admin/blog-posts/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ 
        title: "Blog post updated successfully!", 
        description: "Your changes have been saved." 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error updating blog post", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const publishBlogPost = useMutation({
    mutationFn: async (data: any) => {
      const publishData = { ...data, isPublished: true, status: 'published' };
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/admin/blog-posts/${id}` : '/api/admin/blog-posts';
      const response = await apiRequest(method, url, publishData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog-posts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({ 
        title: "Blog post published successfully!", 
        description: "Your post is now live and visible to users." 
      });
      navigate('/admin');
    },
    onError: (error: any) => {
      toast({ 
        title: "Error publishing blog post", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const handleSave = (data: any) => {
    if (isEditing) {
      updateBlogPost.mutate(data);
    } else {
      createBlogPost.mutate(data);
    }
  };

  const handlePublish = (data: any) => {
    publishBlogPost.mutate(data);
  };

  const handlePreview = (data: any) => {
    // Open preview in new window
    const previewWindow = window.open('', '_blank');
    if (previewWindow) {
      previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Preview: ${data.title}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #1e40af; }
            .meta { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
            .content { line-height: 1.6; }
            .featured-image { max-width: 100%; height: auto; margin: 20px 0; }
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

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-space-900">
      {/* Header */}
      <div className="bg-space-800 border-b border-space-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="text-space-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-space-300 text-sm">
                {isEditing ? 'Update your blog post content and settings' : 'Create a new educational blog post'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePreview(existingPost || {})}
              className="border-space-600 text-space-300 hover:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSave(existingPost || {})}
              disabled={createBlogPost.isPending || updateBlogPost.isPending}
              className="border-space-600 text-space-300 hover:text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={() => handlePublish(existingPost || {})}
              disabled={createBlogPost.isPending || updateBlogPost.isPending || publishBlogPost.isPending}
              className="bg-cosmic-blue hover:bg-blue-600"
            >
              <Globe className="w-4 h-4 mr-2" />
              {publishBlogPost.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <WordPressStyleEditor
        initialData={existingPost}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
        isLoading={createBlogPost.isPending || updateBlogPost.isPending || publishBlogPost.isPending}
      />
    </div>
  );
};

export default BlogEditor;
