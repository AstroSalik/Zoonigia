import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import BlogStatusBadge from '@/components/BlogStatusBadge';
import BlogAdminActions from '@/components/BlogAdminActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Eye,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { BlogPost } from '@shared/schema';

const AdminBlogReview: React.FC = () => {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [activeTab, setActiveTab] = useState('under_review');

  // Fetch blog posts by status
  const { data: underReviewPosts, isLoading: loadingUnderReview } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog-posts/status/under_review'],
    enabled: !!user?.isAdmin,
  });

  const { data: publishedPosts, isLoading: loadingPublished } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog-posts/status/published'],
    enabled: !!user?.isAdmin,
  });

  const { data: rejectedPosts, isLoading: loadingRejected } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog-posts/status/rejected'],
    enabled: !!user?.isAdmin,
  });

  const { data: draftPosts, isLoading: loadingDrafts } = useQuery<BlogPost[]>({
    queryKey: ['/api/admin/blog-posts/status/draft'],
    enabled: !!user?.isAdmin,
  });

  // Redirect if not admin
  if (!authLoading && (!user || !user.isAdmin)) {
    setLocation('/');
    return null;
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-space-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cosmic-blue"></div>
      </div>
    );
  }

  const filterPosts = (posts: BlogPost[] | undefined) => {
    if (!posts) return [];
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderPostCard = (post: BlogPost) => (
    <Card key={post.id} className="bg-space-800/50 border-space-700">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <BlogStatusBadge status={post.status || 'draft'} className="mb-2" />
            <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-space-400">
              <span className="font-medium text-space-300">{post.authorName}</span>
              {post.authorTitle && <span>• {post.authorTitle}</span>}
            </div>
          </div>
          {post.featuredImage && (
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-20 h-20 rounded object-cover ml-4"
            />
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Excerpt */}
        <p className="text-space-300 line-clamp-3">
          {post.excerpt || (post.content.length > 200 
            ? `${post.content.substring(0, 200)}...` 
            : post.content)}
        </p>

        {/* Admin Feedback (if exists) */}
        {post.adminFeedback && (
          <div className="p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-yellow-400 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-yellow-400 mb-1">
                  Previous Feedback:
                </p>
                <p className="text-sm text-space-300">{post.adminFeedback}</p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-space-400 pt-3 border-t border-space-700">
          {post.submittedAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Submitted: {new Date(post.submittedAt).toLocaleDateString()}
            </div>
          )}
          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Published: {new Date(post.publishedAt).toLocaleDateString()}
            </div>
          )}
          {post.viewCount !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.viewCount} views
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-3 border-t border-space-700">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedPost(post)}
            className="border-space-600"
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Review
          </Button>

          {post.status === 'under_review' && (
            <div className="flex-1">
              <BlogAdminActions 
                postId={post.id} 
                postTitle={post.title}
                onSuccess={() => setSelectedPost(null)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const getPendingCount = () => underReviewPosts?.length || 0;
  const getPublishedCount = () => publishedPosts?.length || 0;
  const getRejectedCount = () => rejectedPosts?.length || 0;
  const getDraftCount = () => draftPosts?.length || 0;

  return (
    <div className="min-h-screen bg-space-900 text-space-50">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-space font-bold mb-2">Blog Review Dashboard</h1>
            <p className="text-space-300">
              Review and manage blog submissions from the community
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-space-400" />
              <Input
                placeholder="Search by title or author..."
                className="pl-10 bg-space-800 border-space-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-space-800 border border-space-700">
              <TabsTrigger value="under_review" className="data-[state=active]:bg-space-700">
                <Clock className="w-4 h-4 mr-2" />
                Pending Review ({getPendingCount()})
              </TabsTrigger>
              <TabsTrigger value="published" className="data-[state=active]:bg-space-700">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Published ({getPublishedCount()})
              </TabsTrigger>
              <TabsTrigger value="rejected" className="data-[state=active]:bg-space-700">
                <XCircle className="w-4 h-4 mr-2" />
                Rejected ({getRejectedCount()})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="data-[state=active]:bg-space-700">
                Drafts ({getDraftCount()})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="under_review" className="mt-6">
              {loadingUnderReview ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-blue"></div>
                </div>
              ) : filterPosts(underReviewPosts).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterPosts(underReviewPosts).map(renderPostCard)}
                </div>
              ) : (
                <Card className="bg-space-800/50 border-space-700 p-12 text-center">
                  <p className="text-space-300">No posts pending review</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="published" className="mt-6">
              {loadingPublished ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-blue"></div>
                </div>
              ) : filterPosts(publishedPosts).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterPosts(publishedPosts).map(renderPostCard)}
                </div>
              ) : (
                <Card className="bg-space-800/50 border-space-700 p-12 text-center">
                  <p className="text-space-300">No published posts</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rejected" className="mt-6">
              {loadingRejected ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-blue"></div>
                </div>
              ) : filterPosts(rejectedPosts).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterPosts(rejectedPosts).map(renderPostCard)}
                </div>
              ) : (
                <Card className="bg-space-800/50 border-space-700 p-12 text-center">
                  <p className="text-space-300">No rejected posts</p>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-6">
              {loadingDrafts ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-blue"></div>
                </div>
              ) : filterPosts(draftPosts).length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filterPosts(draftPosts).map(renderPostCard)}
                </div>
              ) : (
                <Card className="bg-space-800/50 border-space-700 p-12 text-center">
                  <p className="text-space-300">No draft posts</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />

      {/* Post Preview Dialog */}
      <Dialog open={selectedPost !== null} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="bg-space-800 border-space-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-white mb-4">
              {selectedPost?.title}
            </DialogTitle>
            <div className="flex items-center gap-3 mb-4">
              <BlogStatusBadge status={selectedPost?.status || 'draft'} />
              <span className="text-sm text-space-400">
                by {selectedPost?.authorName}
                {selectedPost?.authorTitle && ` • ${selectedPost.authorTitle}`}
              </span>
            </div>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-6">
              {/* Featured Image */}
              {selectedPost.featuredImage && (
                <img 
                  src={selectedPost.featuredImage} 
                  alt={selectedPost.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}

              {/* Content */}
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
              />

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-space-700">
                  {selectedPost.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-space-700 rounded-full text-sm text-space-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Admin Actions */}
              {selectedPost.status === 'under_review' && (
                <div className="pt-4 border-t border-space-700">
                  <BlogAdminActions 
                    postId={selectedPost.id} 
                    postTitle={selectedPost.title}
                    onSuccess={() => setSelectedPost(null)}
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBlogReview;

